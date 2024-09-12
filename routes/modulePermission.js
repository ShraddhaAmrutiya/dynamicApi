const express = require('express');
const { 
    assignPermissionsToModule,
    listPermissionsForModule ,
    removePermissionsFromModule
} = require('../controllers/permissionController.js');
const authMiddleware  = require('../middleware/authMiddleware.js');
const authorize =require('../middleware/permissionMiddleware.js')

const router = express.Router();
router.use(authMiddleware);

router.post('/modules/:moduleId/permissions',authorize('update') ,assignPermissionsToModule);

router.get('/modules/:moduleId/permissions',authorize('read'),listPermissionsForModule);

router.delete('/modules/:moduleId/permissions',authorize('update'),removePermissionsFromModule);




module.exports = router;
