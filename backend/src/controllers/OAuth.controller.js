const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config");

exports.OAuth = async (req, res, next) => {
  try {
    const { id, email } = req.user;
    // Generate token and send
    const token = jwt.sign({ id, email }, jwt_secret);
    res.status(200).json({ id, email, token });
  } catch (error) {
    return next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};
