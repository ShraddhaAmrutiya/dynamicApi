const express = require('express');
const router = express.Router();
const {assignPermissionsToGroup,
    listPermissionsForGroup,
    removePermissionFromGroup} = require('../controllers/groupPermissionController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/permissionMiddleware');
router.use(authMiddleware)
// Assign permissions to a group(by:modulePermissionid)
router.post('/:groupId/permissions',authorize('update'),assignPermissionsToGroup);

// List permissions for a group
router.get('/:groupId/permissions',authorize('read'), listPermissionsForGroup);

// Remove a specific permission from a group
router.delete('/:groupId/permissions/:permissionId',authorize('update'), removePermissionFromGroup);

module.exports = router;
