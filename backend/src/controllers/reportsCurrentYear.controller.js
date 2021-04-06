const db = require("../database/dbQueries");

// Helper function to get month name using its integer value (1 -> January).
var getMonth = function(month) {
  // Create month names
  let monthNames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function(mon) {
    return new Date(2000, mon).toLocaleString({}, { month: "long" });
  });
  return monthNames[month - 1];
};

exports.getCurrentYearReport = async (req, res, next) => {
  try {
    const { id: userId } = req.decoded;
    const pipelines = [
      // The match stage will filter the data relevant to the current user and the current year.
      {
        $match: {
          userId: db.getObjectId(userId),
          $expr: {
            $eq: [{ $year: "$createdAt" }, { $year: new Date() }]
          }
        }
      },
      // The group stage is grouping the data according to the month of creation, transaction type
      // and transaction status and counting the number of documents in each group.
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
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
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // Creating the default report document.
    months.forEach(month => {
      report[getMonth(month)] = {
        total: 0,
        debit: 0,
        credit: 0,
        paid: 0,
        pending: 0,
        totalAmount: 0
      };
    });

    // Add each month's data to their respective fields.
    response.forEach(curMonth => {
      const month = getMonth(curMonth._id.month);
      report[month].total += curMonth.count;
      report[month].totalAmount += curMonth.totalAmount;
      report[month][curMonth._id.type] += curMonth.count;
      report[month][curMonth._id.status] += curMonth.count;
    });

    res.status(200).json(report);
  } catch (error) {
    return next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};
