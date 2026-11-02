const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { validate, productRules } = require('../middleware/validate');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', verifyToken, isAdmin, productRules, validate, productController.createProduct);
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

module.exports = router;
