const express = require('express');
const  authController  = require('../controllers/authController.js');
const authMiddleware=require('../middleware/authMiddleware.js')
const router = express.Router();
// router.use(authMiddleware)
const logger=require('../middleware/logger.js')



router.post('/login',/* logger,*/authController.loginUser);
router.post('/refresh', authController.refresh);
router.post('/register',/*logger,*/ authController.registerUser);
router.get('/', authMiddleware,authController.readedUser);
router.put('/update',authMiddleware, authController.updateUser);
router.delete('/delete', authMiddleware,authController.deleteUser);

module.exports = router;
