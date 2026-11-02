const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/', categoryController.getCategories);
router.post('/', verifyToken, isAdmin, categoryController.createCategory);

module.exports = router;
