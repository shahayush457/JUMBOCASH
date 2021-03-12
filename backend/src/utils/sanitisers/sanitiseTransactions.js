const { body, query } = require("express-validator");

exports.sanitiseCreate = async (req, res, next) => {
  await body("remark")
    .escape()
    .trim()
    .run(req);

  next();
};

exports.sanitiseUpdate = async (req, res, next) => {
  await body("remark")
    .optional()
    .escape()
    .trim()
    .run(req);

  next();
};

exports.sanitiseFilter = async (req, res, next) => {
  await query("tType")
    .default(["debit", "credit"])
    .toArray()
    .run(req);

  await query("tMode")
    .default(["cash", "upi", "debit-card", "credit-card"])
    .toArray()
    .run(req);

  await query("tStatus")
    .default(["paid", "pending"])
    .toArray()
    .run(req);

  await query("eType")
    .default(["customer", "vendor"])
    .toArray()
    .run(req);

  await query("eName")
    .optional()
    .toArray()
    .run(req);

  await query("eAddress")
    .optional()
    .toArray()
    .run(req);

  await query("entityId")
    .optional()
    .toArray()
    .run(req);

  await query("sDate")
    .optional()
    .toDate()
    .run(req);

  await query("eDate")
    .optional()
    .toDate()
    .run(req);

  await query("sAmount")
    .default(0)
    .toInt()
    .run(req);

  await query("eAmount")
    .default(Number.MAX_SAFE_INTEGER)
    .toInt()
    .run(req);

  await query("limit")
    .default(10)
    .toInt()
    .run(req);

  await query("pageNo")
    .default(1)
    .toInt()
    .run(req);

  await query("sortBy")
    .default("createdAt")
    .run(req);

  await query("orderBy")
    .default(-1)
    .toInt()
    .run(req);

  next();
};
