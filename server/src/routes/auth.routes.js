const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate, registerRules, loginRules } = require('../middleware/validate');

router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
