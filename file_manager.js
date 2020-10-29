function FileManager(size) {
    this.pending_init_ = true;
    this.fs_ = null;
    this.cmds_ = [];
    window.webkitStorageInfo.requestQuota(window.PERSISTENT, size, function(grantedBytes) {
        requestFs = window.requestFileSystem || window.webkitRequestFileSystem;
        requestFs(window.PERSISTENT, size, bind(this, this.init_, true), bind(this, this.init_, false));
    }.bind(this));
}

FileManager.prototype = {
init_ : function(success, fs) {
    this.pending_init_ = false;
    console.log("init", success);
    if(success) {
        this.fs_ = fs;
    }
    for(var i = 0; i < this.cmds_.length; ++i) {
        this.cmds_[i]();
    }
    this.cmds_ = null;
},

read : function(name, hnd) {
    this.run_(bind(this, this.readImpl_, name, hnd));
},

write : function(name, blob, hnd) {
    this.run_(bind(this, this.writeImpl_, name, blob, hnd));
},

writeImpl_ : function(name, blob, hnd) {
    var errhnd = bind(this, this.error_, hnd);
    if(this.fs_) {
        this.fs_.root.getFile(name, {create: true}, function(entry) {
            entry.createWriter(function(writer) {
              writer.onwriteend = function(e) {
                writer.onwriteend = function() {};
                console.log('Write completed.');
                this.truncate(this.position);
                hnd && hnd(true);
              };
              writer.onerror = function(e) {
                console.log('Write failed: ' + e.toString());
                hnd && hnd(false);
              };
              writer.write(blob);        
            }, errhnd);
        }, errhnd);
    } else {
        hnd && hnd(false);
    }
},

readImpl_ : function(name, hnd) {
    var errhnd = bind(this, this.error_, hnd);
    if(this.fs_) {
      this.fs_.root.getFile(name, {}, function(entry) {
        entry.file(function(file) {
           var reader = new FileReader();
           reader.onloadend = function(e) {
               hnd && hnd(true, this.result);
           };
           reader.readAsText(file);
        }, errhnd);
      }, errhnd);
    } else {
        hnd && hnd(false);
    }
},

run_ : function(cmd) {
    if(this.pending_init_) {
        this.cmds_.push(cmd);
    } else {
        cmd();
    }
},

error_ : function(hnd, e) {
    console.log("error_", e);
    hnd && hnd(false);
}
}
