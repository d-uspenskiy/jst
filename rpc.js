class InvokePayload {
  constructor(class_name, method_name, args) {
    this.class_name = class_name;
    this.method_name = method_name;
    this.args = args;
  }
}

class RpcMessage {
  constructor(req_id, payload) {
    this.req_id = req_id;
    this.payload = payload;
  }
}

class RemoteError {
  constructor(msg) {
    this.msg = msg;
  }
}

function interfaceMethods(cl) {
  var result = [];
  for(var p of Object.getOwnPropertyNames(cl.prototype)) {
    if (p != "constructor") {
      result.push(p);
    }
  }
  return result;
}

class Rpc {
  constructor(endpoint_builder) {
    this.endpoint_ = endpoint_builder(this.handle_.bind(this));
    this.impl_ = {};
    this.next_req_id_ = 0;
    this.handlers_ = {};
  }

  stub(client) {
    console.log("RpcClient::stub", client);
    var stub = new Object();
    for(var method of interfaceMethods(client)) {
      stub[method] = this.caller_(client.name, method);
    }
    return stub;
  }

  register(client, impl) {
    console.log("register", client.name, client, impl);
    var iface = new Set(interfaceMethods(client));
    for (var m of interfaceMethods(impl.constructor)) {
      iface.delete(m);
    }
    if (iface.size > 0) {
      throw "Unimplemented methods: " + Array.from(iface).join(', ');
    }
    this.impl_[client.name] = impl;
  }

  caller_(client_name, method) {
    var that = this;
    return function() {
      var args = [...arguments];
      return new Promise((hnd, rej) => {
        var req_id = ++that.next_req_id_;
        that.handlers_[req_id] = function(payload) {
          payload instanceof RemoteError ? rej(new Error(payload.msg)) : hnd(payload);
        }
        that.endpoint_.send(new RpcMessage(req_id, new InvokePayload(client_name, method, args)));
      });
    };
  }

  handle_(msg) {
    if (msg.payload instanceof InvokePayload) {
      var invoke = msg.payload;
      var hnd = function(payload) {
        if (payload instanceof Error) {
          payload = new RemoteError(payload.stack);
        }
        this.endpoint_.send(new RpcMessage(msg.req_id, payload));
      }.bind(this);
      try {
        var impl = this.impl_[invoke.class_name];
        impl[invoke.method_name].apply(impl, (new Array(hnd)).concat(invoke.args));
      } catch(e) {
        hnd(e);
      }
    } else {
      try {
        var hnd = this.handlers_[msg.req_id];
        delete this.handlers_[msg.req_id];
        hnd(msg.payload);
      } catch(e) {
        console.log(e);
      }
    }
  }
}
