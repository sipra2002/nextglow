const prisma = require('../config/db');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const category = await prisma.category.create({
      data: { name: name.trim() },
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};
