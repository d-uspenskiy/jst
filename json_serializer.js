class JSONSerializer {
  constructor(cls) {
    this.known_classes_ = {};
    for (var c of cls) {
      this.known_classes_[c.name] = c.prototype;
    }
  }

  serialize(val) {
    var r = val;
    if (val instanceof Array) {
      r = this.serializeArray(val);
    } else if (val instanceof Object) {
      r = this.serializeObject(val);
    }
    return r;
  }

  deserialize(val) {
    var r = val;
    if (val instanceof Array) {
      r = this.deserializeArray(val);
    } else if (val instanceof Object) {
      r = this.deserializeObject(val);
    }
    return r;
  }

  serializeArray(arr) {
    var r = [];
    for (var v of arr) {
      r.push(this.serialize(v));
    }
    return r;
  }

  serializeObject(obj) {
    var cl_name = obj.constructor.name;
    if (!(cl_name in this.known_classes_)) {
      throw `Serializing of unknown class: ${cl_name}`; 
    }
    var r = {};
    for (var key of Object.getOwnPropertyNames(obj)) {
      var v = obj[key];
      if (v !== null) {
        r[key] = this.serialize(v);
      }
    }
    return {[`@${cl_name}`]: r};
  }

  deserializeArray(arr) {
    var r = [];
    for (var v of arr) {
      r.push(this.deserialize(v));
    }
    return r;
  }

  deserializeObject(val) {
    var cl = Object.getOwnPropertyNames(val)[0];
    var v = val[cl];
    var cl_name = cl.substr(1);
    var proto = this.known_classes_[cl_name]
    if (proto == null) {
      throw `Deserializing unknown class: ${cl_name}`;
    }
    var r = Object.create(proto);
    for (var p of Object.getOwnPropertyNames(v)) {
     r[p] = this.deserialize(v[p]);
    }
    return r;
  }
}
