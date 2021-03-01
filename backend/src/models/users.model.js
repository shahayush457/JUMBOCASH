const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
  method: {
    type: [String],
    enum: ["local", "google", "facebook"],
    required: true,
    description: "Methods of authentication"
  },
  name: {
    type: String,
    required: true,
    description: "Name of the user"
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    description: "Email of the user"
  },
  password: {
    type: String,
    description: "Password of the user for local authentication method"
  },
  balance: {
    type: Number,
    required: true,
    description: "Current balance of the user"
  },
  transactions: {
    type: [Schema.ObjectID],
    description: "All transactions done by the user"
  },
  entities: {
    type: [Schema.ObjectID],
    description: "All entities added by the user"
  }
});

const users = mongoose.model("user", user);
module.exports = users;
