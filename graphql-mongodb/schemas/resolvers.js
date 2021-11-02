const { PubSub, withFilter } = require("graphql-yoga");
const { User, Message } = require("../models");
const resolvers = {
  Query: {
    users: () => User.find(),
    messages: () => Message.find(),
  },
  User: {
    messages: async ({ username }) => {
      return Message.find({ senderUsername: username });
    },
  },
  Message: {
    users: async ({ senderUsername }) => {
      return User.find({ username: senderUsername });
    },
  },
  Mutation: {
    addNewUser: async (_, { name, username }) => {
      const user = new User({ name, username });
      await user.save();
      pubsub.publish("newUser", { newUser: user });
      return user;
    },
    updateUserDetails: async (_, { id, name }) => {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { name },
        { new: true }
      );
      return user;
    },
    deleteUser: async (_, { username }) => {
      await Promise.all([
        User.findOneAndDelete({ username: username }),
        Message.deleteMany({ senderUsername: username }),
      ]);
      pubsub.publish("oldUser", { oldUser: username });
      return true;
    },
    userTyping: (_, { username, receiverUsername }) => {
      pubsub.publish("userTyping", {
        userTyping: username,
        receiverUsername,
      });
      return true;
    },
    sendMessage: async (
      _,
      { senderUsername, receiverUsername, message, timestamp }
    ) => {
      const userText = new Message({
        senderUsername,
        receiverUsername,
        message,
        timestamp,
      });
      await userText.save();
      pubsub.publish("newMessage", {
        newMessage: userText,
        receiverUsername,
      });
      return userText;
    },
    updateMessage: async (_, { id, message }) => {
      const userText = await Message.findOneAndUpdate(
        { _id: id },
        { message },
        { new: true }
      );
      return userText;
    },
    deleteMessage: async (_, { id }) => {
      await Message.findOneAndDelete({ _id: id });
      return true;
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("newMessage"),
        (payload, variables) => {
          return payload.receiverUsername === variables.receiverUsername;
        }
      ),
    },
    newUser: {
      subscribe: (_, {}, { pubsub }) => {
        return pubsub.asyncIterator("newUser");
      },
    },
    oldUser: {
      subscribe: (_, {}, { pubsub }) => {
        return pubsub.asyncIterator("oldUser");
      },
    },
    userTyping: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("userTyping"),
        (payload, variables) => {
          return payload.receiverUsername === variables.receiverUsername;
        }
      ),
    },
  },
};
const pubsub = new PubSub();
module.exports = resolvers;
