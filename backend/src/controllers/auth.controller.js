const db = require('../models/users.model');
const jwt = require('jsonwebtoken');

// for development only
exports.getUsers = async (req, res, next) => {
  try 
  {
    const users = await db.find();
    return res.status(200).json(users);
  } 
  catch (err) 
  {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.register = async (req, res, next) => {
  try 
  {
    const user = await db.create(req.body);
    const { id, email } = user;
    const token = jwt.sign({ id, email }, process.env.SECRET);

    return res.status(201).json({
        id,
        email,
        token,
    });
  } 
  catch (err) 
  {
    if (err.code === 11000) 
    {
      err.message = 'Sorry, that email is already taken';
    }
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try 
  {
    const user = await db.findOne({
      email: req.body.email,
    });
    const { id, email } = user;
    const valid = await user.comparePassword(req.body.password);

    if (valid) 
    {
      const token = jwt.sign({ id, email }, process.env.SECRET);
      return res.status(200).json({
        id,
        email,
        token,
      });
    } 
    else 
    {
      throw new Error();
    }
  } 
  catch (err) 
  {
    return next({ status: 400, message: 'Invalid Email/Password' });
  }
};
