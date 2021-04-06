const db = require("../database/dbQueries");

// Helper function to get number of days in a month.
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

exports.getCurrentMonthReport = async (req, res, next) => {
  try {
    const { id: userId } = req.decoded;
    const pipelines = [
      // The match stage will filter the data relevant to the current user and the current year and month.
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
            }
          ]
        }
      },
      // The group stage is grouping the data according to the month of creation, transaction type
      // and transaction status and counting the number of documents in each group.
      {
        $group: {
          _id: {
            dayOfMonth: { $dayOfMonth: "$createdAt" },
            type: "$transactionType",
            status: "$transactionStatus"
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" }
        }
      }
    ];

    const response = await db.aggregateData("transaction", pipelines);

    let report = [];

    // Getting the number of days in current month.
    let today = new Date();
    let month = today.getMonth();
    let daysInCurrentMonth = daysInMonth(month + 1, today.getFullYear());

    // Creating the default report array.
    for (let i = 0; i < daysInCurrentMonth; i++)
      report.push({
        dayOfMonth: i + 1,
        total: 0,
        debit: 0,
        credit: 0,
        paid: 0,
        pending: 0,
        totalAmount: 0
      });

    // Add each day's data to their respective fields.
    response.forEach(curDay => {
      const day = curDay._id.dayOfMonth - 1;
      report[day].total += curDay.count;
      report[day].totalAmount += curDay.totalAmount;
      report[day][curDay._id.type] += curDay.count;
      report[day][curDay._id.status] += curDay.count;
    });

    res.status(200).json({ report });
  } catch (error) {
    return next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};
