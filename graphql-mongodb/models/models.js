const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    index: { unique: true },
  },
});
const Message = mongoose.model("Message", {
  message: String,
  senderUsername: String,
  receiverUsername: String,
  timestamp: Number,
});
