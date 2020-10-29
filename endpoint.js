class Endpoint {
  constructor(pipe_communicator_builder, hnd, serializer) {
    this.serializer_ = serializer;
    this.pipe_ = pipe_communicator_builder(function(msg) {
      hnd(this.serializer_.deserialize(msg));
    }.bind(this));
  }

  send(msg) {
    console.log("Endpoint::send", msg);
    this.pipe_.send(this.serializer_.serialize(msg));
  }
}
