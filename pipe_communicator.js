class ReadPipe {
  constructor(element, hnd) {
    this.hnd_ = hnd;
    this.observer_ = new MutationObserver(this.onEvent_.bind(this));
    this.observer_.observe(element, {childList: true});
  }

  onEvent_(rec) {
    for(var r of rec) {
      for (var a of r.addedNodes) {
        this.hnd_(JSON.parse(a.value));
      }
    }
  }
}

class WritePipe {
  constructor(element) {
    this.element_ = element;
  }

  push(msg) {
    var e = document.createElement("option");
    e.value = JSON.stringify(msg);
    this.element_.appendChild(e);
    this.element_.removeChild(e);
  }
}

class PipeCommunicator {
  constructor(rp, wp, hnd) {
    this.write_ = new WritePipe(wp);
    this.read_ = new ReadPipe(rp, function(msg) {
      hnd(msg, this);
    }.bind(this));
  }

  send(msg) {
    this.write_.push(msg);
  }
}

function createPipeCommunictor(el, hnd, reverse_direction) {
  var container = document.getElementById(el);
  if (container == null) {
    container = document.createElement("div");
    container.id = el;
    container.style.display = 'none';
    document.body.appendChild(container);
  }
  var items = [...container.getElementsByTagName("select")];
  for (var i = items.length; i < 2; ++i) {
    var new_item = document.createElement("select");
    container.appendChild(new_item);
    items.push(new_item);
  }
  var r = items[0];
  var w = items[1];
  if (reverse_direction) {
    [r, w] = [w, r];
  } 
  return new PipeCommunicator(r, w, hnd);
}