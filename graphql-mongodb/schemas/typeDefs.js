const typeDefs = `
  type Query {
    users: [User]
    messages: [Message]
  }
  type User {
    id: ID!
    name: String!
    username: String!
    messages: [Message]
  }
  type Message {
    id: ID!
    message: String!
    senderUsername: String!
    receiverUsername: String!
    timestamp: Float!
    users: [User]
  }
  type Mutation {
    addNewUser(name: String! username: String!): User!
    updateUserDetails(id: ID! name: String!): User!
    deleteUser(username: String!): Boolean!
    userTyping(username: String! receiverUsername: String!): Boolean!
    sendMessage(senderUsername: String! receiverUsername: String! message: String! timestamp: Float!): Message!
    updateMessage(id: ID! message: String!): Message!
    deleteMessage(id: String!): Boolean!
  }
  type Subscription {
    newMessage(receiverUsername: String!): Message
    newUser: User
    oldUser: String
    userTyping (receiverUsername: String!): String
  }
`;
module.exports = typeDefs;
