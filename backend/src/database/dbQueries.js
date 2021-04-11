const Transaction = require("../models/transactions.model");
const User = require("../models/users.model");
const Entity = require("../models/entities.model");
const mongoose = require("mongoose");

function giveModel(modelName) {
  if (modelName === "user") return User;
  else if (modelName === "entity") return Entity;
  else return Transaction;
}

// Enabling the lean option tells Mongoose to skip instantiating a full
// Mongoose document and just give you the POJO. This makes queries faster
// and less memory intensive (memory only affects how much memory the node.js
// process uses and not in terms of how much data is sent over the network)

exports.find = async (modelName, matchQuery, sortBy, isLean) => {
  const model = giveModel(modelName);
  if (isLean)
    return model
      .find(matchQuery)
      .lean()
      .sort(sortBy);
  else return model.find(matchQuery).sort(sortBy);
};

exports.findOneDocument = async (modelName, matchQuery, isLean) => {
  const model = giveModel(modelName);
  if (isLean) return model.findOne(matchQuery).lean();
  else return model.findOne(matchQuery);
};

exports.findById = async (modelName, id, isLean) => {
  const model = giveModel(modelName);
  if (isLean) return model.findById(id).lean();
  else return model.findById(id);
};

exports.getPopulatedData = async (modelName, id, query, isLean) => {
  const model = giveModel(modelName);
  if (isLean)
    return model
      .findById(id)
      .populate(query)
      .lean();
  else return model.findById(id).populate(query);
};

exports.findByIdAndUpdate = async (
  modelName,
  id,
  updateData,
  isNew,
  isLean
) => {
  const model = giveModel(modelName);
  if (isLean)
    return model.findByIdAndUpdate(id, updateData, { new: isNew }).lean();
  else return model.findByIdAndUpdate(id, updateData, { new: isNew });
};

exports.deleteAll = async (modelName, deleteQuery) => {
  const model = giveModel(modelName);
  return model.deleteMany(deleteQuery);
};

exports.updateData = async updatedDocument => {
  return updatedDocument.save();
};

exports.createData = async (modelName, data) => {
  const model = giveModel(modelName);
  return model.create(data);
};

exports.aggregateData = async (modelName, pipelines) => {
  const model = giveModel(modelName);
  return model.aggregate(pipelines);
};

exports.getCollectionName = modelName => {
  return giveModel(modelName).collection.name;
};

exports.getObjectId = id => {
  return mongoose.Types.ObjectId(id);
};
