const express = require('express');
const {  createPermission,
    listPermissions,
    getPermission,
    updatePermission,
    deletePermission,
   
} = require('../controllers/permissionController');
const authMiddleware  = require('../middleware/authMiddleware');
const authorize =require('../middleware/permissionMiddleware.js')

const router = express.Router();
router.use(authMiddleware);

router.post('/',authorize('create'),  createPermission);
router.get('/',authorize('read'), listPermissions);
router.get('/:id',authorize('read'), getPermission);
router.put('/:id',authorize('update'),  updatePermission);
router.delete('/:id',authorize('delete'),  deletePermission);



module.exports = router;
