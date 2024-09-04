const express = require('express');
const  authController  = require('../controllers/authController.js');
const authMiddleware=require('../middleware/authMiddleware.js')
const router = express.Router();
// router.use(authMiddleware)
const ensureSuperadmin=require('../middleware/ensureSuperadmin.js')
const authorize = require('../middleware/permissionMiddleware');



router.post('/login',authController.loginUser);
router.post('/refresh',authController.refresh);
router.post('/register',authMiddleware, ensureSuperadmin, authorize('create'),authController.registerUser);
router.get('/', authMiddleware,authorize('read'),authController.readedUser);
router.put('/update/:id',authMiddleware,authorize('read'), authController.updateUser);
router.delete('/delete/:id', authMiddleware,authorize('delete'),authController.deleteUser);

module.exports = router;
