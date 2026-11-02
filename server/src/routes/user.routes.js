const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/me', verifyToken, userController.getProfile);
router.put('/me', verifyToken, userController.updateProfile);
router.get('/', verifyToken, isAdmin, userController.getAllUsers);

module.exports = router;
