const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config");

exports.googleOAuth = async (req, res, next) => {
  const { id, name } = req.user;
  // Generate token
  const token = jwt.sign({ id, name }, jwt_secret);
  res.status(200).json({ id, name, token });
};
