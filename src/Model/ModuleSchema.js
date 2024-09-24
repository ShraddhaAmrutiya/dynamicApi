const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const moduleSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
  name: { type: String, required: true, unique: true , index: true, },
  description: { type: String },
  createdBy:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Module", moduleSchema);
