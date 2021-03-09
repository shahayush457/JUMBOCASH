const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config");

module.exports = (req, res, next) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"].split(" ")[1];
    console.log(req.headers);
    jwt.verify(token, jwt_secret, (err, decoded) => {
      if (err) {
        next(Error("Failed to authenticate token"));
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    next(Error("No token provided"));
  }
};
