const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userPermission = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  permissions: [{ type: String, ref: 'Permission' }]
});

module.exports = mongoose.model("UserPermission", userPermission);
