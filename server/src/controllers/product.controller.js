const prisma = require('../config/db');

// Helper to format product with array of skinTypes
const formatProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    skinTypes: typeof p.skinTypes === 'string'
      ? p.skinTypes.split(',').map((s) => s.trim()).filter(Boolean)
      : (Array.isArray(p.skinTypes) ? p.skinTypes : []),
  };
};

exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, skinType, featured } = req.query;

    const where = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    if (category && category !== 'All') {
      where.category = {
        name: { equals: category },
      };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let formatted = products.map(formatProduct);

    // Filter by skinType in-memory if specified
    if (skinType && skinType !== 'All') {
      formatted = formatted.filter((p) =>
        p.skinTypes.includes(skinType.toUpperCase()) || p.skinTypes.includes('ALL')
      );
    }

    res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: formatProduct(product) });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, imageUrl, skinTypes, stock, featured, categoryId } = req.body;

    const skinTypesStr = Array.isArray(skinTypes)
      ? skinTypes.join(',')
      : (typeof skinTypes === 'string' ? skinTypes : 'NORMAL');

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        imageUrl: imageUrl.trim(),
        skinTypes: skinTypesStr,
        stock: stock !== undefined ? parseInt(stock, 10) : 100,
        featured: Boolean(featured),
        categoryId: parseInt(categoryId, 10),
      },
      include: { category: true },
    });

    res.status(201).json({ success: true, message: 'Product created', data: formatProduct(product) });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, description, price, imageUrl, skinTypes, stock, featured, categoryId } = req.body;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
    if (stock !== undefined) updateData.stock = parseInt(stock, 10);
    if (featured !== undefined) updateData.featured = Boolean(featured);
    if (categoryId !== undefined) updateData.categoryId = parseInt(categoryId, 10);
    if (skinTypes !== undefined) {
      updateData.skinTypes = Array.isArray(skinTypes) ? skinTypes.join(',') : String(skinTypes);
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    res.status(200).json({ success: true, message: 'Product updated', data: formatProduct(updated) });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await prisma.product.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
