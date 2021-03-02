const Entity = require('../models/entities.model');
const User = require('../models/users.model');

exports.userEntities = async (req, res, next) => {
  const { id } = req.decoded;
  try 
  {
    const user = await User.findById(id).populate('entities');
    return res.status(200).json(user.entities);
  } 
  catch (err) 
  {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.createEntity = async (req, res, next) => {
  const { id: userId } = req.decoded;
  const { name, address, contactNo,entityType } = req.body;
  try 
  {
    const user = await User.findById(userId);
    const entity = await Entity.create({
      userId,
      name,
      address, 
      contactNo,
      entityType
    });
    user.entities.push(entity._id);
    await user.save();
    return res.status(201).json(entity);
  } 
  catch (err) 
  {
    return next({
      status: 400,
      message: err.message,
    });
  }
};

exports.getEntity = async (req, res, next) => {
  try 
  {
    const { id } = req.params;
    const entity = await Entity.findById(id)
    if (!entity) throw new Error('No Entity found');

    return res.status(200).json(entity);
  } 
  catch (err) 
  {
    return next({
      status: 400,
      message: err.message,
    });
  }
};
