const express = require('express');
const  authController  = require('../controllers/authController.js');
const authMiddleware=require('../middleware/authMiddleware.js')
const router = express.Router();
const authorize = require('../middleware/permissionMiddleware');
 

router.post('/register',authController.registerUser);

router.post('/login',authController.loginUser);

router.post('/refresh',authController.refresh);

router.get('/', authMiddleware,authorize('read'),authController.readedUser);

router.put('/:id',authMiddleware,authorize('update'), authController.updateUser);


router.delete('/:id', authMiddleware,authorize('delete'),authController.deleteUser);

module.exports = router;
