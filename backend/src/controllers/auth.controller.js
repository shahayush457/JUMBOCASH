const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { jwt_secret } = require("../config/config");
const db = require("../models/users.model");

// for development only
exports.getUsers = async (req, res, next) => {
  try {
    const users = await db.find().lean();
    return res.status(200).json(users);
  } catch (err) {
    return next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};

exports.register = async (req, res, next) => {
  try {
    // Finds the validation errors in this request and wraps them in an object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        message: errors.array()
      });
      return;
    }

    const user = await db.findOne({
      email: req.body.email
    });

    if (user) {
      // registered user
      if (user.method.includes("local", 0)) {
        return next({
          status: 409,
          message: [{ msg: "Email is already registered. Please login" }]
        });
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
      err.message = "Email is already registered. Please login";
    }
    return next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    // Finds the validation errors in this request and wraps them in an object
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({
        status: 422,
        message: errors.array()
      });
      return;
    }

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
        return next({
          status: 401,
          message: [{ msg: "Invalid Email/Password" }]
        });
      }
    } else {
      return next({
        status: 401,
        message: [
          {
            msg:
              "Please register on the site or proceed with google/facebook login"
          }
        ]
      });
    }
  } catch (err) {
    return next({ status: 400, message: [{ msg: error.message }] });
  }
};
