const { body, query } = require("express-validator");

exports.sanitiseCreate = async (req, res, next) => {
  await body("name")
    .escape()
    .trim()
    .run(req);

  await body("address")
    .escape()
    .trim()
    .run(req);

  await body("contactNo")
    .escape()
    .trim()
    .run(req);

  next();
};

exports.sanitiseUpdate = async (req, res, next) => {
  await body("name")
    .optional()
    .escape()
    .trim()
    .run(req);

  await body("address")
    .optional()
    .escape()
    .trim()
    .run(req);

  await body("contactNo")
    .optional()
    .escape()
    .trim()
    .run(req);

  next();
};

exports.sanitiseFilter = async (req, res, next) => {
  await query("eType")
    .default(["vendor", "customer"])
    .toArray()
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
    .default("name")
    .run(req);

  await query("orderBy")
    .default(1)
    .toInt()
    .run(req);

  next();
};
