const db = require("../database/dbQueries");

exports.getCurrentWeekReport = async (req, res, next) => {
  try {
    const { id: userId } = req.decoded;
    const pipelines = [
      // The match stage will filter the data relevant to the current user and the current week of current year.
      {
        $match: {
          userId: db.getObjectId(userId),
          $and: [
            {
              $expr: {
                $eq: [{ $year: "$createdAt" }, { $year: new Date() }]
              }
            },
            {
              $expr: {
                $eq: [{ $month: "$createdAt" }, { $month: new Date() }]
              }
            },
            {
              $expr: {
                $eq: [{ $week: "$createdAt" }, { $week: new Date() }]
              }
            }
          ]
        }
      },
      // The group stage is grouping the data according to the month of creation, transaction type
      // and transaction status and counting the number of documents in each group.
      {
        $group: {
          _id: {
            dayOfWeek: { $dayOfWeek: "$createdAt" },
            type: "$transactionType",
            status: "$transactionStatus"
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      }
    ];

    const response = await db.aggregateData("transaction", pipelines);

    let report = {};
    let dayOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    // Creating the default report array.
    dayOfWeek.forEach(day => {
      report[day] = {
        total: 0,
        debit: 0,
        credit: 0,
        paid: 0,
        pending: 0,
        totalAmount: 0
      };
    });

    // Add each day's data to their respective fields.
    response.forEach(curDay => {
      const day = dayOfWeek[curDay._id.dayOfWeek - 1];
      report[day].total += curDay.count;
      report[day].totalAmount += curDay.totalAmount;
      report[day][curDay._id.type] += curDay.count;
      report[day][curDay._id.status] += curDay.count;
    });

    res.status(200).json(report);
  } catch (error) {
    return next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};
