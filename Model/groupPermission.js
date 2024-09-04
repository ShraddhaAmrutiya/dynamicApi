const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const groupPermissionSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  groupId: { type: mongoose.Schema.Types.String, ref: 'Group', required: true },
  permissionId: [{ type: mongoose.Schema.Types.String, ref: 'Permission' }]
});


module.exports = mongoose.model('GroupPermission', groupPermissionSchema);
