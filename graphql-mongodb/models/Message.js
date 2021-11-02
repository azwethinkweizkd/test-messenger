const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  message: String,
  senderUsername: String,
  receiverUsername: String,
  timestamp: Number,
});

const Message = model("Message", messageSchema);

module.exports = Message;
