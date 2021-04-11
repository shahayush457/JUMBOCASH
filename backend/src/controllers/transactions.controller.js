const { validationResult } = require("express-validator");
const log = require("../common/logger");
const db = require("../database/dbQueries");
const agenda = require("../jobScheduler/agenda");

exports.getTransactionsByUser = async (req, res, next) => {
  // Retrieve user id from the decoded JWT
  const { id: userId } = req.decoded;
  try {
    const transactions = await db.find(
      "transaction",
      { userId },
      { createdAt: -1 },
      true
    );
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

    // check whether the entity exists or not.
    const entity = await db.findById("entity", req.body.entityId, true);
    if (!entity) {
      next({
        status: 404,
        message: [{ msg: "Entity not found" }]
      });
      return;
    }

    const transaction = await db.createData("transaction", {
      userId,
      ...req.body
    });

    if (
      transaction.reminderDate &&
      transaction.transactionStatus === "pending"
    ) {
      // The third parameter to `schedule()` is an object that can contain
      // arbitrary data. This data will be stored in the `data` property
      // in the document in mongodb
      await agenda.schedule(transaction.reminderDate, "send email reminder", {
        to: user.email,
        userName: user.name,
        transactionType: transaction.transactionType,
        transactionMode: transaction.transactionMode,
        amount: transaction.amount,
        remark: transaction.remark,
        entityName: entity.name,
        entityType: entity.entityType,
        entityAddress: entity.address,
        entityContactNo: entity.contactNo
      });
    }

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

    const transaction = await db.findById("transaction", id, true);
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

exports.getUserProfitAndPendingAmount = async (req, res, next) => {
  try {
    const { id: userId } = req.decoded;

    let filter = { userId: db.getObjectId(userId) };

    if (req.query.sDate && req.query.eDate) {
      let startDate = req.query.sDate;
      startDate.setHours(00, 00, 00, 000);
      let endDate = req.query.eDate;
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    } else if (req.query.sDate) {
      let startDate = req.query.sDate;
      startDate.setHours(00, 00, 00, 000);
      filter.createdAt = {
        $gte: startDate
      };
    } else if (req.query.eDate) {
      let endDate = req.query.eDate;
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt = {
        $lte: endDate
      };
    }

    const pipelines = [
      // The match stage will filter transactions for current user and for given dates.
      {
        $match: filter
      },
      // The group stage will group the transactions according to type and status and will calculate
      // the count and total amount in each group.
      {
        $group: {
          _id: {
            type: "$transactionType",
            status: "$transactionStatus"
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      }
    ];

    const response = await db.aggregateData("transaction", pipelines);

    let amount = {
      balance: 0,
      pendingAmountCredit: 0,
      pendingAmountDebit: 0
    };

    // Add total amount to their respective fields.
    response.forEach(curBalance => {
      const type = curBalance._id.type,
        status = curBalance._id.status;

      if (status === "paid") {
        if (type === "debit") amount.balance -= curBalance.totalAmount;
        else amount.balance += curBalance.totalAmount;
      } else {
        if (type === "debit")
          amount.pendingAmountDebit += curBalance.totalAmount;
        else amount.pendingAmountCredit += curBalance.totalAmount;
      }
    });

    res.status(200).json(amount);
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
      const entity = await db.findById("entity", req.body.entityId, true);
      if (!entity) {
        next({
          status: 404,
          message: [{ msg: "Entity not found" }]
        });
        return;
      }
    }

    const transaction = await db.findById("transaction", req.params.id, true); // Todo - can get rid of this if updated transaction not required to be sent in response

    if (!transaction)
      return next({
        status: 404,
        message: [{ msg: "Transaction not found" }]
      });

    // update the transaction info in the database
    const newTransaction = await db.findByIdAndUpdate(
      "transaction",
      req.params.id,
      req.body,
      true,
      true
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

    let filter = {},
      sort = {};

    // Add filter queries applied by the user
    filter.userId = db.getObjectId(userId);

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
      $gte: req.query.sAmount, // default start amount = 0
      $lte: req.query.eAmount // default end amount = Infinity
    };

    if (req.query.sDate && req.query.eDate) {
      let startDate = req.query.sDate;
      startDate.setHours(00, 00, 00, 000);
      let endDate = req.query.eDate;
      endDate.setHours(23, 59, 59, 999);
      filter.createdAt = {
        $gte: startDate,
        $lte: endDate
      };
    } else if (req.query.sDate) {
      let startDate = req.query.sDate;
      startDate.setHours(00, 00, 00, 000);
      filter.createdAt = {
        $gte: startDate
      };
    } else if (req.query.eDate) {
      let endDate = req.query.eDate;
      endDate.setHours(23, 59, 59, 999);
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
        $in: req.query.entityId.map(id => db.getObjectId(id)) // converting string to ObjectId
      };

    // Add sorting queries applied by the user
    sort[req.query.sortBy] = req.query.orderBy; // default sortBy = createdAt, orderBy = -1

    // Paging
    const limit = req.query.limit; // default = 10
    const skip = req.query.pageNo * limit - limit; // default pageNo = 1

    log.info(filter);

    const pipelines = [
      {
        $lookup: {
          from: db.getCollectionName("entity"), // Mongoose pluralize the collection name at the time of creation (Entity -> entities)
          localField: "entityId",
          foreignField: "_id",
          as: "entity"
        }
      },
      { $match: filter },
      { $sort: sort },
      {
        $facet: {
          transactions: [{ $skip: skip }, { $limit: limit }],
          totalCount: [
            {
              $count: "count"
            }
          ]
        }
      }
    ];

    const transactions = await db.aggregateData("transaction", pipelines);

    if (!transactions[0].totalCount[0])
      transactions[0].totalCount.push({ count: 0 });

    log.info(transactions);

    res.status(200).json(transactions[0]);
  } catch (error) {
    next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};
