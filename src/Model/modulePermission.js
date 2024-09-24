const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const modulePermissionSchema = new mongoose.Schema({
  _id: {
    type: String,  
    default: uuidv4, 
  },
  moduleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Module', 
    required: true 
  },
  permissions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Permission' 
  }]
});

module.exports = mongoose.model('modulePermission', modulePermissionSchema);
