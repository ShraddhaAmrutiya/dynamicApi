const express = require('express');
const {  createPermission,
    listPermissions,
    getPermission,
    updatePermission,
    deletePermission,
    assignPermissionsToModule,
    listPermissionsForModule ,
    // checkUserPermission 
} = require('../controllers/permissionController');
const authMiddleware  = require('../middleware/authMiddleware');
const authorize =require('../middleware/permissionMiddleware.js')

// const router = require('./userRoutes');
const router = express.Router();
router.use(authMiddleware);

router.post('/',authorize('create'),  createPermission);
router.get('/',authorize('read'), listPermissions);
router.get('/:id',authorize('read'), getPermission);
router.put('/:id',authorize('update'),  updatePermission);
router.delete('/:id',authorize('delete'),  deletePermission);


// Assign permissions to a module
router.post('/modules/:moduleId/permissions',authorize('update') ,assignPermissionsToModule);

// List permissions for a module
router.get('/modules/:moduleId/permissions',authorize('read'),listPermissionsForModule);



// router.get('/users/:userId/permissions/:requiredPermission', checkUserPermission);

module.exports = router;
