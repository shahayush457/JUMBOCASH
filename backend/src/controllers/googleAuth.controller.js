const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config");

exports.googleOAuth = async (req, res, next) => {
  const { id, email } = req.user;
  // Generate token
  const token = jwt.sign({ id, email }, jwt_secret);
  res.status(200).json({ id, email, token });
};
