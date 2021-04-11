const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

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
    description: "Email of the user",
    unique: true
  },
  password: {
    type: String,
    description: "Password of the user for local authentication method"
  }
});

user.pre("save", async function(next) {
  try {
    if (!this.isModified("password")) return next();
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

user.methods.comparePassword = async function(attempt, next) {
  try {
    return await bcrypt.compare(attempt, this.password);
  } catch (err) {
    return next(err);
  }
};

const users = mongoose.model("User", user);
module.exports = users;
