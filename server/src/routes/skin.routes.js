const express = require('express');
const router = express.Router();
const skinController = require('../controllers/skin.controller');
const { verifyToken, optionalAuth } = require('../middleware/auth');

router.post('/analyze', optionalAuth, skinController.analyzeSkin);
router.get('/me', verifyToken, skinController.getMySkinProfile);

module.exports = router;
