const log = require("../common/logger");
const db = require("../database/dbQueries");

exports.userInsights = async (req, res, next) => {
  const { id: userId } = req.decoded;
  try {
    const pipelinesForFavouriteEntity = [
      // The match stage will filter the transactions of the user using its userId.
      {
        $match: {
          userId: db.getObjectId(userId)
        }
      },
      // The lookup stage will populate the entity using the entityId.
      {
        $lookup: {
          from: db.getCollectionName("entity"), // Mongoose pluralize the collection name at the time of creation (Entity -> entities)
          localField: "entityId",
          foreignField: "_id",
          as: "entity"
        }
      },
      // This stage will group the transactions by its entityId and store the count of transactions in the group,
      // keeping the entity information in the group as well.
      {
        $group: {
          _id: "$entityId",
          entity: { $first: "$entity" },
          count: { $sum: 1 }
        }
      },
      // This stage will now group the data by the entity type - So now we have two groups, one for vendor and
      // the other for customer. In each group we have the max count from all entities in that group and an
      // array of entities in that group with their respective counts of transactions.
      {
        $group: {
          _id: "$entity.entityType",
          maxCount: { $max: "$count" },
          data: {
            $push: {
              entity: "$entity",
              count: "$count"
            }
          }
        }
      },
      // Now in each group (vendor and customer) we want to remove the unwanted entities from the array
      // and keep only that entity whose count is equal to the maxCount. This way we get the vendor with
      // max transaction count and the customer with max transaction count.
      {
        $project: {
          maxCount: 1,
          data: {
            $setDifference: [
              {
                $map: {
                  input: "$data",
                  as: "entity",
                  in: {
                    $cond: [
                      { $eq: ["$maxCount", "$$entity.count"] },
                      "$$entity",
                      false
                    ]
                  }
                }
              },
              [false]
            ]
          }
        }
      }
    ];

    const EntityTypeFrequency = await db.aggregateData(
      "transaction",
      pipelinesForFavouriteEntity
    );

    const pipelinesForModeFrequency = [
      // The match stage will filter the transactions of the user using its userId.
      {
        $match: {
          userId: db.getObjectId(userId)
        }
      },
      // This stage will group the transactions by its mode of payment and count the
      // number of transactions performed using each mode.
      {
        $group: {
          _id: "$transactionMode",
          count: { $sum: 1 }
        }
      }
    ];

    const ModeFrequency = await db.aggregateData(
      "transaction",
      pipelinesForModeFrequency
    );

    const pipelinesForBalanceInOut = [
      // The match stage will filter the paid transactions of the user using its userId.
      {
        $match: {
          userId: db.getObjectId(userId),
          transactionStatus: "paid"
        }
      },
      // This stage will group the transactions by its transaction type (debit and credit)
      // and calculate the total amount in each group.
      {
        $group: {
          _id: "$transactionType",
          balance: { $sum: "$amount" }
        }
      }
    ];

    const balanceInOut = await db.aggregateData(
      "transaction",
      pipelinesForBalanceInOut
    );

    let response = {
      onlinePayments: 0,
      inCashPayments: 0,
      totalBalanceIn: 0,
      totalBalanceOut: 0,
      favouriteVendor: { entity: [], count: 0 },
      favouriteCustomer: { entity: [], count: 0 }
    };

    EntityTypeFrequency.forEach(type => {
      if (type.data[0].entity[0].entityType === "vendor")
        response.favouriteVendor = type.data[0];
      else response.favouriteCustomer = type.data[0];
    });

    ModeFrequency.forEach(mode => {
      if (mode._id === "cash") response.inCashPayments = mode.count;
      else response.onlinePayments += mode.count;
    });

    balanceInOut.forEach(type => {
      if (type._id === "debit") response.totalBalanceOut = type.balance;
      else response.totalBalanceIn = type.balance;
    });

    res.status(200).json(response);
  } catch (error) {
    return next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};
