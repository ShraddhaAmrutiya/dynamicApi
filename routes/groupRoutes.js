
const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/permissionMiddleware');
router.use(authMiddleware);

router.post('/',authorize('create') ,groupController.createGroup);

router.get('/',authorize('read'), groupController.listGroups);

router.get('/:id',  authorize('read'),groupController.getGroup);

router.put('/:id',authorize('update'), groupController.updateGroup);

router.delete('/:id',authorize('delete'),  groupController.deleteGroup);

router.delete('/',authorize('delete') , groupController.deleteAllGroups);

module.exports = router;
