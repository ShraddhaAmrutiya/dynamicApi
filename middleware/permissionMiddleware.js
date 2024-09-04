
const User = require('../Model/UserSchema');
const GroupPermission = require('../Model/groupPermission');
const rolePermissions = require('../rolePermissions');

// const permissionMiddleware = (requiredPermission) => {
//     return (req, res, next) => {
//         const userRole = req.user.role; // Assuming user role is part of the JWT payload

//         if (!userRole || !rolePermissions[userRole].includes(requiredPermission)) {
//             return res.status(403).json({ message: 'Access denied' });
//         }
//         next();
//     };
// };


const permissionMiddleware = (requiredPermission) => async (req, res, next) => {
    try {
      const userRole = req.user.role; 
      console.log('User Role:', userRole); 
  
      // Check if the user is a superadmin
      if (userRole === 'superadmin') {
        return next(); // Superadmin has access to everything
      }
  
      // Role-based permissions check
      if (rolePermissions[userRole] && rolePermissions[userRole].includes(requiredPermission)) {
        return next(); 
      }
  
      // Group-based permissions check
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
  





