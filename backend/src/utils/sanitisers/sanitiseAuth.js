const { body } = require("express-validator");

exports.sanitiseRegister = async (req, res, next) => {
  await body("name")
    .escape()
    .trim()
    .run(req);

  next();
};
