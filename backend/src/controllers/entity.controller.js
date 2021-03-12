const { validationResult } = require("express-validator");
const Entity = require("../models/entities.model");
const User = require("../models/users.model");
const log = require("../common/logger");

// to get all entites added by current user
exports.userEntities = async (req, res, next) => {
  const { id } = req.decoded;
  try {
    // Enabling the lean option tells Mongoose to skip instantiating a full
    // Mongoose document and just give you the POJO. This makes queries faster
    // and less memory intensive (memory only affects how much memory the node.js
    // process uses and not in terms of how much data is sent over the network)
    const user = await User.findById(id)
      .lean()
      .populate("entities");
    return res.status(200).json(user.entities);
  } catch (err) {
    return next({
      status: 400,
      message: [{ msg: err.message }]
    });
  }
};

exports.createEntity = async (req, res, next) => {
  const { id: userId } = req.decoded;
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

    const user = await User.findById(userId);
    const entity = await Entity.create({
      userId,
      ...req.body
    });
    user.entities.push(entity._id);
    await user.save();
    return res.status(201).json(entity);
  } catch (err) {
    return next({
      status: 400,
      message: [{ msg: err.message }]
    });
  }
};

exports.getEntityById = async (req, res, next) => {
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

    const { id } = req.params;

    // enabling lean because I am not modifying the entity document
    // further in this function.
    const entity = await Entity.findById(id).lean();

    if (!entity) {
      next({
        status: 404,
        message: [{ msg: "Entity not found" }]
      });
      return;
    }

    return res.status(200).json(entity);
  } catch (err) {
    return next({
      status: 400,
      message: [{ msg: err.message }]
    });
  }
};

exports.updateEntity = async (req, res, next) => {
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

    // user id is not allowed to update
    if (req.body.userId) {
      return next({
        status: 405,
        message: [{ msg: "User id is not allowed to update" }]
      });
    }

    // enabling lean because I am not modifying the updatedEntity document
    // further in this function.
    const updatedEntity = await Entity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();

    if (!updatedEntity) {
      next({
        status: 404,
        message: [{ msg: "Entity not found" }]
      });
      return;
    }

    res.status(200).json(updatedEntity);
  } catch (error) {
    next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};

exports.getFilteredEntity = async (req, res, next) => {
  // Retrieve user id from the decoded JWT
  const { id: userId } = req.decoded;
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

    let filter = {},
      sort = {};

    // Add filter queries applied by the user
    filter.entityType = {
      $in: req.query.eType
    };

    // Add sorting queries applied by the user
    sort[req.query.sortBy] = req.query.orderBy; // default sortBy = name, orderBy = 1

    // Paging
    const limit = req.query.limit; // default limit = 10
    const skip = req.query.pageNo * limit - limit; // default pageNo = 1

    // enabling lean because I am not modifying the entity document
    // further in this function.
    const user = await User.findById(userId)
      .lean()
      .populate({
        path: "entities",
        match: filter,
        options: {
          limit: limit,
          skip: skip,
          sort: sort
        }
      });

    log.info(user.entities);
    res.status(200).json(user.entities);
  } catch (error) {
    next({
      status: 400,
      message: [{ msg: error.message }]
    });
  }
};
