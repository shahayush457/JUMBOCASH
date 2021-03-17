const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config");

exports.OAuth = async (req, res, next) => {
  try {
    const { id, name } = req.user;
    // Generate token and send
    const token = jwt.sign({ id, name }, jwt_secret);
    res.status(200).json({ id, name, token });
  } catch (error) {
    return next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};
