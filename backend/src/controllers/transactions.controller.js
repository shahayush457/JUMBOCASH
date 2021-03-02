const Transaction = require("../models/transactions.model");
const User = require("../models/users.model");

exports.getTransactionsByUser = async (req, res, next) => {
  // Retrieve user id from the decoded JWT
  const { id } = req.decoded;
  try {
    let user = await User.findById(id).populate("transactions");
    user.transactions.sort((a, b) => {
      if (a.createdOn < b.createdOn) return 1;
      else return -1;
    });

    res.status(200).json(user.transactions);
  } catch (error) {
    next({
      status: 400,
      message: error.message
    });
  }
};

exports.createTransactions = async (req, res, next) => {
  // Retrieve user id from the decoded JWT
  const { id: userId } = req.decoded;
  const {
    entityId,
    amount,
    transactionType,
    transactionMode,
    remark
  } = req.body;

  try {
    const transaction = await Transaction.create({
      userId,
      entityId,
      amount,
      transactionType,
      transactionMode,
      remark
    });

    const user = await User.findById(userId);
    if (transaction.transactionType === "credit") {
      // transaction (type = Credit) then add transaction amount to user balance
      user.balance += transaction.amount;
    } else {
      // transaction (type = Debit) then subtract transaction amount from user balance
      user.balance -= transaction.amount;
    }
    // add new transaction's entry in the user's record
    user.transactions.push(transaction._id);
    await user.save();
    res.status(201).json(transaction);
  } catch (error) {
    next({
      status: 400,
      message: error.message
    });
  }
};

exports.getTransactionsById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) throw new Error("Transaction not found");
    res.status(200).json(transaction);
  } catch (error) {
    next({
      status: 404,
      message: error.message
    });
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    // user id and transaction type not allowed to update
    if (res.body.userId || req.body.transactionType) {
      return next({
        status: 405,
        message: "Method not allowed"
      });
    }
    const transaction = await Transaction.findById(req.params.id);
    const user = await User.findById(transaction.userId);
    // if updating transaction amount then update user balance accordingly
    if (req.body.amount) {
      // subtract old amount
      user.balance -= transaction.amount;
      // add new amount
      user.balance += req.body.amount;
      await user.save();
    }
    const newTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(newTransaction);
  } catch (error) {
    next({
      status: 400,
      message: error.message
    });
  }
};
