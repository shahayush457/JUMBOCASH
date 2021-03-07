const Transaction = require("../models/transactions.model");
const User = require("../models/users.model");
const log = require("../common/logger");
const mongoose = require("mongoose");

exports.getTransactionsByUser = async (req, res, next) => {
  // Retrieve user id from the decoded JWT
  const { id: userId } = req.decoded;
  try {
    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1
    });
    res.status(200).json(transactions);
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

    let user = await User.findById(userId);
    if (transaction.transactionType === "credit") {
      // transaction (type = Credit) then add transaction amount to user balance
      user.balance += transaction.amount;
    } else {
      // transaction (type = Debit) then subtract transaction amount from user balance
      user.balance -= transaction.amount;
    }
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
    if (req.body.userId || req.body.transactionType) {
      return next({
        status: 405,
        message: "User id or transaction type are not allowed to update"
      });
    }

    const transaction = await Transaction.findById(req.params.id); // Todo - can get rid of this if updated transaction not required to be sent in response
    if (!transaction) throw new Error("Transaction not found");
    let user = await User.findById(transaction.userId);

    // if updating transaction amount then update user balance accordingly
    if (req.body.amount) {
      // subtract old amount and add new amount
      if (transaction.transactionType === "credit") {
        user.balance -= transaction.amount;
        user.balance += req.body.amount;
      } else {
        // add old amount and subtract new amount
        user.balance += transaction.amount;
        user.balance -= req.body.amount;
      }
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
      status: 404,
      message: error.message
    });
  }
};

// Todo - support multiple values for a field in filter
exports.getFilteredTransactions = async (req, res, next) => {
  // Retrieve user id from the decoded JWT
  const { id: userId } = req.decoded;
  try {
    let filter = {},
      sort = {};
    filter.userId = mongoose.Types.ObjectId(userId);

    if (req.query.tType) filter.transactionType = { $eq: req.query.tType };

    if (req.query.tMode) filter.transactionMode = { $eq: req.query.tMode };

    filter.amount = {
      $gte: Number(req.query.sAmount) || 0,
      $lte: Number(req.query.eAmount) || Infinity
    };

    if (req.query.entityId)
      filter.entityId = { $eq: mongoose.Types.ObjectId(req.query.entityId) };

    if (req.query.sDate && req.query.eDate)
      filter.createdAt = {
        $gte: new Date(req.query.sDate),
        $lte: new Date(req.query.eDate)
      };
    else if (req.query.sDate)
      filter.createdAt = {
        $gte: new Date(req.query.sDate)
      };
    else if (req.query.eDate) {
      let endDate = new Date(req.query.eDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.createdAt = {
        $lte: endDate
      };
    }

    sort[req.query.sortBy || "createdAt"] = Number(req.query.orderBy) || -1;

    const limit = Number(req.query.limit) || 10;
    const skip = (Number(req.query.pageNo) || 1) * limit - limit;

    const transactions = await Transaction.aggregate([
      { $match: filter },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit }
    ]);

    log.info(transactions);
    res.status(200).json(transactions);
  } catch (error) {
    next({
      status: 400,
      message: error.message
    });
  }
};
