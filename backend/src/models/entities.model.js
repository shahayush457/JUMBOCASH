const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const entity = new Schema({
  userId: {
    type: Schema.Types.ObjectID,
    ref: 'User',
    required: true,
    description: "Id of the user who created the entity"
  },
  name: {
    type: String,
    required: true,
    description: "Name of the entity"
  },
  address: {
    type: String,
    required: true,
    description: "Address of the entity"
  },
  contactNo: {
    type: String,
    required: true,
    description: "Contact number of the entity"
  },
  entityType: {
    type: String,
    required: true,
    enum: ["vendor", "customer"],
    description: "Type of entity"
  }
});

const entities = mongoose.model("Entity", entity);
module.exports = entities;
