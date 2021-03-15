const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { jwt_secret } = require("../config/config");
const db = require("../database/dbQueries");

// for development only
exports.getUsers = async (req, res, next) => {
  try {
    const users = await db.find("user", {}, {}, true);
    return res.status(200).json(users);
  } catch (err) {
    return next({
      status: 400,
      message: [{ msg: err.message }]
    });
  }
};

exports.getUserbyId = async (req,res,next) =>{
  try{
    const { id: userId } = req.decoded;
    const user= await db.findById(userId);
    return res.status(200).json(user);
  }
  catch(err){
    return next({ status: 400, message: err.message });
  }
}
// For registering user
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

    const user = await db.findOneDocument(
      "user",
      {
        email: req.body.email
      },
      false
    );

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

        await db.updateData(user);

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
    const newuser = await db.createData("user", req.body);
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
      message: [{ msg: err.message }]
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

    const user = await db.findOneDocument(
      "user",
      {
        email: req.body.email
      },
      false
    );

    const { id, email } = user;

    if (user.method.includes("local", 0)) {
      const valid = await user.comparePassword(req.body.password);
      if (valid) {
        const token = jwt.sign({ id,name  }, jwt_secret);
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
    return next({ status: 400, message: [{ msg: err.message }] });
  }
};
