function BinFetcher(arrBuff) {
    this.buf_ = arrBuff;    
    this.offset_ = 0;
    this.view_ = new DataView(this.buf_);
}

BinFetcher.prototype = {
uint8 : function() {
    var v = this.view_.getUint8(this.offset_);
    ++this.offset_;
    return v;
},

uint16 : function() {
    var v = this.view_.getUint16(this.offset_);
    this.offset_ += 2;
    return v;
},

uint32 : function() {
    var v = this.view_.getUint32(this.offset_);
    this.offset_ += 4;
    return v;
},

raw : function(len) {
    if (len === undefined) {
        len = this.buf_.byteLength - this.offset_;
    }
    var res = "";
    var elapse = len;
    for(;elapse > 0;) {
        var count = Math.min(elapse, 10240);
        res += String.fromCharCode.apply(null, new Uint8Array(this.buf_, this.offset_, count));
        elapse -= count;
        this.offset_ += count;
    }
    return res;
},

empty : function() {
    return this.buf_.byteLength == this.offset_;
}
}
