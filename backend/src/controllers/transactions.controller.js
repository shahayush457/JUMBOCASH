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
    transactionStatus,
    remark
  } = req.body;

  try {
    const transaction = await Transaction.create({
      userId,
      entityId,
      amount,
      transactionType,
      transactionMode,
      transactionStatus,
      remark
    });

    let user = await User.findById(userId);

    // Update user balance and pending amounts
    if (transaction.transactionStatus === "paid") {
      if (transaction.transactionType === "credit") {
        // transaction (type = Credit) then add transaction amount to user balance
        user.balance += transaction.amount;
      } else {
        // transaction (type = Debit) then subtract transaction amount from user balance
        user.balance -= transaction.amount;
      }
    } else {
      if (transaction.transactionType === "credit") {
        /* transaction (type = Credit) then add transaction amount 
        to total pending amount that the user will get*/
        user.pendingAmountCredit += transaction.amount;
      } else {
        /* transaction (type = Debit) then add transaction amount 
        to total pending amount that the user will get*/
        user.pendingAmountDebit += transaction.amount;
      }
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
    // user id is not allowed to update
    if (req.body.userId) {
      return next({
        status: 405,
        message: "User id or transaction type are not allowed to update"
      });
    }

    const transaction = await Transaction.findById(req.params.id); // Todo - can get rid of this if updated transaction not required to be sent in response

    if (!transaction)
      return next({
        status: 404,
        message: "Transaction not found"
      });

    let user = await User.findById(transaction.userId);

    const newStatus =
      req.body.transactionStatus || transaction.transactionStatus;
    const newTransactionType =
      req.body.transactionType || transaction.transactionType;
    const newAmount = req.body.amount;
    const oldAmount = transaction.amount;

    /* if updating status and new status is not equal to old status then 
    update user balance and pending amounts accordingly */
    if (newStatus !== transaction.transactionStatus) {
      if (newStatus === "paid") {
        if (transaction.transactionType === "credit")
          (user.balance += oldAmount), (user.pendingAmountCredit -= oldAmount);
        else
          (user.balance -= oldAmount), (user.pendingAmountDebit -= oldAmount);
      } else {
        if (transaction.transactionType === "credit")
          (user.balance -= oldAmount), (user.pendingAmountCredit += oldAmount);
        else
          (user.balance += oldAmount), (user.pendingAmountDebit += oldAmount);
      }
    }

    // if updating transaction type then update user balance and pending amounts accordingly
    if (
      newStatus === "paid" &&
      newTransactionType !== transaction.transactionType
    ) {
      if (newTransactionType === "credit") user.balance += 2 * oldAmount;
      else user.balance -= 2 * oldAmount;
    } else if (
      newStatus === "pending" &&
      newTransactionType !== transaction.transactionType
    ) {
      if (newTransactionType === "credit")
        (user.pendingAmountDebit -= oldAmount),
          (user.pendingAmountCredit += oldAmount);
      else
        (user.pendingAmountDebit += oldAmount),
          (user.pendingAmountCredit -= oldAmount);
    }

    /* if updating transaction amount then update user balance 
    and pending amounts accordingly */
    if (newStatus === "paid" && newAmount) {
      // subtract old amount and add new amount
      if (newTransactionType === "credit") {
        user.balance -= oldAmount;
        user.balance += newAmount;
      } else {
        // add old amount and subtract new amount
        user.balance += oldAmount;
        user.balance -= newAmount;
      }
    } else if (newAmount) {
      // subtract old amount and add new amount to pending credit amount
      if (newTransactionType === "credit") {
        user.pendingAmountCredit -= oldAmount;
        user.pendingAmountCredit += newAmount;
      } else {
        // subtract old amount and add new amount to pending debit amount
        user.pendingAmountDebit -= oldAmount;
        user.pendingAmountDebit += newAmount;
      }
    }

    // save updated user info in the database
    await user.save();

    // update the transaction info in the database
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

exports.getFilteredTransactions = async (req, res, next) => {
  // Retrieve user id from the decoded JWT
  const { id: userId } = req.decoded;
  try {
    log.info(req.query);
    let filter = {},
      sort = {};

    if (
      req.query.orderBy &&
      (req.query.orderBy !== "1" || req.query.orderBy !== "-1")
    )
      return next({
        status: 406,
        message: "Invalid query"
      });

    // Add filter queries applied by the user
    filter.userId = mongoose.Types.ObjectId(userId);

    if (req.query.tType)
      filter.transactionType = {
        $in:
          req.query.tType instanceof Array ? req.query.tType : [req.query.tType]
      };

    if (req.query.tMode)
      filter.transactionMode = {
        $in:
          req.query.tMode instanceof Array ? req.query.tMode : [req.query.tMode]
      };

    if (req.query.tStatus)
      filter.transactionStatus = {
        $in:
          req.query.tStatus instanceof Array
            ? req.query.tStatus
            : [req.query.tStatus]
      };

    if (req.query.entityId)
      filter.entityId = {
        $in:
          req.query.entityId instanceof Array
            ? req.query.entityId.map(id => mongoose.Types.ObjectId(id))
            : [mongoose.Types.ObjectId(req.query.entityId)]
      };

    filter.amount = {
      $gte: Number(req.query.sAmount) || 0,
      $lte: Number(req.query.eAmount) || Infinity
    };

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

    // Add sorting queries applied by the user
    sort[req.query.sortBy || "createdAt"] = Number(req.query.orderBy) || -1;

    // Paging
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
