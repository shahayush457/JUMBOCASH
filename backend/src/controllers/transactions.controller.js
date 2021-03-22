const { validationResult } = require("express-validator");
const Transaction = require("../models/transactions.model");
const User = require("../models/users.model");
const Entity = require("../models/entities.model");
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
      message: [{ msg: error.message }]
    });
  }
};

exports.createTransactions = async (req, res, next) => {
  try {
    // Finds the validation errors in this request and wraps them in an object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        message: errors.array()
      });
      return;
    }

    // Retrieve user id from the decoded JWT
    const { id: userId } = req.decoded;

    // check whether the entity exists or not
    const entity = await Entity.findById(req.body.entityId);
    if (!entity) {
      next({
        status: 404,
        message: [{ msg: "Entity not found" }]
      });
      return;
    }

    const transaction = await Transaction.create({
      userId,
      ...req.body
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
      message: [{ msg: error.message }]
    });
  }
};

exports.getTransactionsById = async (req, res, next) => {
  const id = req.params.id;
  try {
    // Finds the validation errors in this request and wraps them in an object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        message: errors.array()
      });
      return;
    }

    const transaction = await Transaction.findById(id);
    if (!transaction)
      return next({
        status: 404,
        message: [{ msg: "Transaction not found" }]
      });
    res.status(200).json(transaction);
  } catch (error) {
    next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    // Finds the validation errors in this request and wraps them in an object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        message: errors.array()
      });
      return;
    }

    // user id is not allowed to update
    if (req.body.userId) {
      return next({
        status: 405,
        message: [{ msg: "User id is not allowed to update" }]
      });
    }

    // if updating entity id then check whether the entity exists or not
    if (req.body.entityId) {
      const entity = await Entity.findById(req.body.entityId);
      if (!entity) {
        next({
          status: 404,
          message: [{ msg: "Entity not found" }]
        });
        return;
      }
    }

    const transaction = await Transaction.findById(req.params.id); // Todo - can get rid of this if updated transaction not required to be sent in response

    if (!transaction)
      return next({
        status: 404,
        message: [{ msg: "Transaction not found" }]
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
      message: [{ msg: error.message }]
    });
  }
};

exports.getFilteredTransactions = async (req, res, next) => {
  try {
    // Retrieve user id from the decoded JWT
    const { id: userId } = req.decoded;

    // Finds the validation errors in this request and wraps them in an object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        message: errors.array()
      });
      return;
    }

    log.info(req.query);
    let filter = {},
      sort = {};

    // Add filter queries applied by the user
    filter.userId = mongoose.Types.ObjectId(userId);

    filter.transactionType = {
      $in: req.query.tType
    };

    filter.transactionMode = {
      $in: req.query.tMode
    };

    filter.transactionStatus = {
      $in: req.query.tStatus
    };

    filter.amount = {
      $gte: req.query.sAmount,
      $lte: req.query.eAmount
    };

    if (req.query.sDate && req.query.eDate)
      filter.createdAt = {
        $gte: req.query.sDate,
        $lte: req.query.eDate
      };
    else if (req.query.sDate)
      filter.createdAt = {
        $gte: req.query.sDate
      };
    else if (req.query.eDate) {
      let endDate = req.query.eDate;
      endDate.setDate(endDate.getDate() + 1);
      filter.createdAt = {
        $lte: endDate
      };
    }

    // Add filter queries for entities fields
    filter["entity.entityType"] = {
      $in: req.query.eType
    };

    if (req.query.eName)
      filter["entity.name"] = {
        $in: req.query.eName
      };

    if (req.query.eAddress)
      filter["entity.address"] = {
        $in: req.query.eAddress
      };

    if (req.query.entityId)
      filter.entityId = {
        $in: req.query.entityId.map(id => mongoose.Types.ObjectId(id))
      };

    // Add sorting queries applied by the user
    sort[req.query.sortBy] = req.query.orderBy;

    // Paging
    const limit = req.query.limit;
    const skip = req.query.pageNo * limit - limit;

    log.info(filter);

    const transactions = await Transaction.aggregate([
      {
        $lookup: {
          from: Entity.collection.name, // Mongoose pluralize the collection name at the time of creation (Entity -> entities)
          localField: "entityId",
          foreignField: "_id",
          as: "entity"
        }
      },
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
      message: [{ msg: error.message }]
    });
  }
};
