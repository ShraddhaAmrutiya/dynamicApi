
const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/permissionMiddleware');
router.use(authMiddleware);
// const ensureSuperadmin=require('../middleware/ensureSuperadmin.js')

//create group 
router.post('/',authorize('create') ,groupController.createGroup);

//get group/read
router.get('/',authorize('read'), groupController.listGroups);

//get group by id
router.get('/:id',  authorize('read'),groupController.getGroup);

//update group by id
router.put('/:id',authorize('update'), groupController.updateGroup);

//delete group by id
router.delete('/:id',authorize('delete'),  groupController.deleteGroup);

//delete group
router.delete('/',authorize('delete') , groupController.deleteAllGroups);

module.exports = router;
