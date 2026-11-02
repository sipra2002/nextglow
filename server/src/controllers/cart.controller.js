const prisma = require('../config/db');

// Helper to get or create cart for user
const getOrCreateUserCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { category: true },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    });
  }

  return cart;
};

const calculateCartSummary = (cart) => {
  let subtotal = 0;
  let totalItems = 0;

  const items = cart.items.map((item) => {
    const lineTotal = item.product.price * item.quantity;
    subtotal += lineTotal;
    totalItems += item.quantity;

    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      lineTotal,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
        category: item.product.category.name,
        stock: item.product.stock,
      },
    };
  });

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99; // Free shipping above ₹999
  const grandTotal = subtotal + shipping;

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    totalItems,
    subtotal: Math.round(subtotal * 100) / 100,
    shipping,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateUserCart(req.user.id);
    const summary = calculateCartSummary(cart);
    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const pId = parseInt(productId, 10);
    const qty = parseInt(quantity, 10) || 1;

    if (isNaN(pId) || qty < 1) {
      return res.status(400).json({ success: false, message: 'Valid product ID and positive quantity are required' });
    }

    const product = await prisma.product.findUnique({ where: { id: pId } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cart = await getOrCreateUserCart(req.user.id);

    // Upsert cart item
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: pId,
        },
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + qty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: pId,
          quantity: qty,
        },
      });
    }

    const updatedCart = await getOrCreateUserCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: calculateCartSummary(updatedCart),
    });
  } catch (err) {
    next(err);
  }
};

exports.updateQuantity = async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.id, 10);
    const { quantity } = req.body;
    const qty = parseInt(quantity, 10);

    if (isNaN(itemId) || isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: 'Valid item ID and quantity >= 1 are required' });
    }

    const cart = await getOrCreateUserCart(req.user.id);

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: qty },
    });

    const updatedCart = await getOrCreateUserCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: calculateCartSummary(updatedCart),
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.id, 10);
    if (isNaN(itemId)) {
      return res.status(400).json({ success: false, message: 'Invalid cart item ID' });
    }

    const cart = await getOrCreateUserCart(req.user.id);

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    const updatedCart = await getOrCreateUserCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: calculateCartSummary(updatedCart),
    });
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateUserCart(req.user.id);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    const updatedCart = await getOrCreateUserCart(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: calculateCartSummary(updatedCart),
    });
  } catch (err) {
    next(err);
  }
};
