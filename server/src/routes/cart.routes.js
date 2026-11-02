const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', cartController.getCart);
router.post('/items', cartController.addToCart);
router.put('/items/:id', cartController.updateQuantity);
router.delete('/items/:id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;
