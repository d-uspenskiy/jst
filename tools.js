function byId(id) {
    return document.getElementById(id);
}

function extend(Child, Parent) {
    var F = function() { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.superclass = Parent.prototype;
}

function safeGet(obj, field, def) {
    return (obj && obj.hasOwnProperty(field)) ? obj[field] : (def === undefined ? null : def);
}

function safeSplice(arr, idx, count) {
    if(idx >= 0 && idx < arr.length) {
        arr.splice(idx, count);    
        return null;
    }
}

function safeLen(src) {
    return src == null ? 0 : src.length;
}

function safeStr(str) {
    return str == null ? "" : str;
}

function safeArray(src) {
    return src == null ? [] : src;
}

function safeArrayGet(arr, idx) {
    return (idx >= 0 && idx < arr.length) ? arr[idx] : null;
}

function empty(obj) {
    return !(obj && obj.length);
}

function formJSON(obj) {
    return JSON.stringify(obj, null, 2);
}

function int(val) {
    return val | 0;
}

function forEach(obj, processor) {
    for(var k in obj)
        if(obj.hasOwnProperty(k) && processor(k, obj[k]) === false)
            break;
}

function str(val) {
    return val.toString();
}

function pushNotNull(dest, e) {
    if (e != null) {
        dest.push(e);
    }
}

function todayStart() {
    var d = new Date();
    return d.getTime() - ((((d.getHours() * 60 + d.getMinutes()) * 60) + d.getSeconds()) * 1000 + d.getMilliseconds());
}

function registerLoadHandler(hnd) {
    document.addEventListener("DOMContentLoaded", hnd);
}

function getFirst(src) {
    return empty(src) ? null : src[0];
}

function msecStamp() {
    return Math.floor(Date.now());
}

function readFile(name, hnd) {
  return fetch(name, {method: 'GET'}).then(response => response.text().then(txt => hnd(txt)));
}

function readFiles(hnd, ...files) {
  var idx = 0;
  var datas = [];
  var pending = files.length;
  for (var f of files) {
    datas.push(null);
    readFile(f, function(i) {
      return function(txt) {
        datas[i] = txt;
        if (!--pending) {
          hnd(datas, files);
        }
      }
    }(idx++));
  }
}

function trueAdd(set, value) {
  var pSize = set.size;
  set.add(value);
  return set.size > pSize;
}

function pushNotNull(arr, value) {
  if (value !== null && value !== undefined) {
    arr.push(value);
  }
}

class ChainIterator {
  constructor(items) {
    this.iterators_ = items[Symbol.iterator]();
    this.currentIter_ = null;
    this.nextIterator_();
    this[Symbol.iterator] = () => this;
  }

  next() {
    while (this.currentIter_) {
      var obj = this.currentIter_.next();
      if (!obj.done) {
        return obj;
      }
      this.nextIterator_();
    }
    return { done: true };
  }

  nextIterator_() {
    var n = this.iterators_.next();
    this.currentIter_ = n.done ? null : n.value[Symbol.iterator]();
  }
}

function chain() {
  return new ChainIterator(arguments);
}
