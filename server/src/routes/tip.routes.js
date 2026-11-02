const express = require('express');
const router = express.Router();
const tipController = require('../controllers/tip.controller');
const { verifyToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { validate, tipRules } = require('../middleware/validate');

router.get('/', tipController.getTips);
router.get('/:id', tipController.getTipById);
router.post('/', verifyToken, isAdmin, tipRules, validate, tipController.createTip);
router.put('/:id', verifyToken, isAdmin, tipController.updateTip);
router.delete('/:id', verifyToken, isAdmin, tipController.deleteTip);

module.exports = router;
