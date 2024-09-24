const express = require('express');
const router = express.Router();
const {assignPermissionsToGroup,
    listPermissionsForGroup,
    removePermissionFromGroup} = require('../controllers/groupPermissionController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/permissionMiddleware');
router.use(authMiddleware)
router.post('/:groupId/permissions',authorize('update'),assignPermissionsToGroup);

router.get('/:groupId/permissions',authorize('read'), listPermissionsForGroup);

router.delete('/:groupId/permissions/:permissionId',authorize('update'), removePermissionFromGroup);

module.exports = router;
