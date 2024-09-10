const express = require('express');
const  authController  = require('../controllers/authController.js');
const authMiddleware=require('../middleware/authMiddleware.js')
const router = express.Router();
// router.use(authMiddleware)
// const ensureSuperadmin=require('../middleware/ensureSuperadmin.js')
const authorize = require('../middleware/permissionMiddleware');

//register auth 
// router.post('/register',authMiddleware, authorize('create'),authController.registerUser);
router.post('/register',authController.registerUser);
//login
router.post('/login',authController.loginUser);

//genrate refresh token
router.post('/refresh',authController.refresh);

//get all user
router.get('/', authMiddleware,authorize('read'),authController.readedUser);

//update user by id
router.put('/update/:id',authMiddleware,authorize('update'), authController.updateUser);

//delete user
router.delete('/delete/:id', authMiddleware,authorize('delete'),authController.deleteUser);

module.exports = router;
