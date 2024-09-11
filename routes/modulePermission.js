const express = require('express');
const { 
    assignPermissionsToModule,
    listPermissionsForModule ,
    removePermissionsFromModule
} = require('../controllers/permissionController.js');
const authMiddleware  = require('../middleware/authMiddleware.js');
const authorize =require('../middleware/permissionMiddleware.js')

// const router = require('./userRoutes');
const router = express.Router();
router.use(authMiddleware);

// Assign permissions to a module
router.post('/modules/:moduleId/permissions',authorize('update') ,assignPermissionsToModule);

// List permissions for a module
router.get('/modules/:moduleId/permissions',authorize('read'),listPermissionsForModule);
//remove permission from module
router.delete('/modules/:moduleId/permissions',authorize('update'),removePermissionsFromModule);



// router.get('/users/:userId/permissions/:requiredPermission', checkUserPermission);

module.exports = router;
