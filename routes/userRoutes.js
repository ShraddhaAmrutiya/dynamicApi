const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/permissionMiddleware');
router.use(authMiddleware);



//add user to group
router.post('/:userId/groups', authorize('update'), userController.addUserToGroup);

//remove user from group
router.delete('/:userId/groups/:groupId', authorize('update') ,userController.removeUserFromGroup);

module.exports = router;
