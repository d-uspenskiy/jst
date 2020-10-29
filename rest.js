class REST {
  constructor(root, no_credentials) {
    this.root_ = root === undefined ? window.location.origin : root;
    this.with_credentials_ = no_credentials ? false : true;
  }

  send(handler, method, path, content, data, headers) {
    var r = new XMLHttpRequest();
    r.withCredentials = this.with_credentials_;
    r.open(method.toUpperCase(), this.root_ + path, true);
    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        r.setRequestHeader(key, value);
      }
    }
    if (handler) {
      r.onreadystatechange = function(){
        if (r.readyState == 4)
          handler(r.status, r.responseText);
      };
    }
    r.setRequestHeader('content-type', content);
    r.send(data);
  }
}

function safeData(r, array) {
  var r = r.status == 200 ? r.data : null;
  return r == null ? (array ? [] : {}) : r;
}

function requestJSON(rest, method, path, data, hnd) {
  rest.send(function(r, t) {
    hnd && hnd(r == 204 ? true : (r == 200 ? JSON.parse(t) : null));
  }, method, path, data == null ? null : "application/json", data == null ? null : JSON.stringify(data));
}
