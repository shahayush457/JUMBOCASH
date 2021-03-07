const db = require("../models/users.model");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config/config");

// for development only
exports.getUsers = async (req, res, next) => {
  try {
    const users = await db.find();
    return res.status(200).json(users);
  } catch (err) {
    return next({
      status: 400,
      message: err.message
    });
  }
};

// For registering user
exports.register = async (req, res, next) => {
  try {
    const user = await db.findOne({
      email: req.body.email
    });
    if (user) {
      // registered user
      if (user.method.includes("local", 0)) {
        throw new Error("Email is already registered. Please Signin");
      } else {
        user.password = req.body.password;
        user.method.push("local");
        await user.save();
        const { id, email } = user;
        const token = jwt.sign({ id, email }, jwt_secret);
        return res.status(201).json({
          id,
          email,
          token
        });
      }
    }
    // first time
    req.body.method = ["local"];
    const newuser = await db.create(req.body);
    const { id, email } = newuser;
    const token = jwt.sign({ id, email }, jwt_secret);

    return res.status(201).json({
      id,
      email,
      token
    });
  } catch (err) {
    if (err.code === 11000) {
      err.message = "Email is already registered. Please Signin";
    }
    return next({
      status: 400,
      message: err.message
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await db.findOne({
      email: req.body.email
    });
    const { id, email } = user;
    if (user.method.includes("local", 0)) {
      const valid = await user.comparePassword(req.body.password);
      if (valid) {
        const token = jwt.sign({ id, email }, jwt_secret);
        return res.status(200).json({
          id,
          email,
          token
        });
      } else {
        throw new Error("Invalid Email/Password");
      }
    } else {
      throw new Error(
        "Please register on the site or proceed with google/facebook login"
      );
    }
  } catch (err) {
    return next({ status: 400, message: err.message });
  }
};
