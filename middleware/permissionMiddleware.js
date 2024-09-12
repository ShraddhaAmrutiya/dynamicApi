
const User = require('../Model/UserSchema');
const GroupPermission = require('../Model/groupPermission');
const rolePermissions = require('../rolePermissions');



const permissionMiddleware = (requiredPermission) => async (req, res, next) => {
    try {
      const userRole = req.user.role; 
      
      if (rolePermissions[userRole] && rolePermissions[userRole].includes(requiredPermission)) {
        return next(); 
      }
  
      const user = req.user;
      const groupPermissions = await GroupPermission.find({ groupId: { $in: user.groups } });
      const userPermissions = groupPermissions.flatMap(group => group.permissions);
  
      if (userPermissions.includes(requiredPermission)) {
        return next(); 
      }

      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  module.exports = permissionMiddleware;
  





