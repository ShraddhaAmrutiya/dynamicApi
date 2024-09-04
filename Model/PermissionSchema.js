const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const permissionSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true, unique: true,  index: true, },
  description: { type: String },
});

module.exports = mongoose.model("Permission", permissionSchema);
