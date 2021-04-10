const { query } = require("express-validator");

exports.sanitiseInsights = async (req, res, next) => {
  await query("sDate")
    .optional()
    .toDate()
    .run(req);

  await query("eDate")
    .optional()
    .toDate()
    .run(req);
    
  next();
};
