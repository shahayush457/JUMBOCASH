const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transaction = new Schema({
  userId: {
    type: Schema.Types.ObjectID,
    ref: 'User',
    required: true,
    description: "Id of the user who added the transaction"
  },
  entityId: {
    type: Schema.Types.ObjectID,
    ref: 'Entity',
    required: true,
    description: "Id of the entity for which the transaction was added"
  },
  amount: {
    type: Number,
    required: true,
    description: "Amount of the transaction"
  },
  transactionType: {
    type: String,
    required: true,
    enum: ["debit", "credit"],
    description: "Type of the transaction"
  },
  transactionMode: {
    type: String,
    required: true,
    enum: ["cash", "upi", "debit-card", "credit-card"],
    description: "Mode of the transaction"
  },
  remark: {
    type: String,
    required: true,
    description: "Any remark written by the user"
  },
  createdOn: {
    type: Date,
    default: Date.now,
    required: true,
    description: "Date of the transaction"
  }
});

const transactions = mongoose.model("Transaction", transaction);
module.exports = transactions;
