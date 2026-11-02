const prisma = require('../config/db');

exports.getTips = async (req, res, next) => {
  try {
    const { category, popular } = req.query;

    const where = {};
    if (category && category !== 'All') {
      where.category = { equals: category };
    }
    if (popular === 'true') {
      where.popular = true;
    }

    const tips = await prisma.beautyTip.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, count: tips.length, data: tips });
  } catch (err) {
    next(err);
  }
};

exports.getTipById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid tip ID' });
    }

    const tip = await prisma.beautyTip.findUnique({ where: { id } });
    if (!tip) {
      return res.status(404).json({ success: false, message: 'Beauty tip not found' });
    }

    res.status(200).json({ success: true, data: tip });
  } catch (err) {
    next(err);
  }
};

exports.createTip = async (req, res, next) => {
  try {
    const { title, category, content, imageUrl, popular } = req.body;

    const tip = await prisma.beautyTip.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        content: content.trim(),
        imageUrl: imageUrl ? imageUrl.trim() : null,
        popular: Boolean(popular),
      },
    });

    res.status(201).json({ success: true, message: 'Beauty tip created', data: tip });
  } catch (err) {
    next(err);
  }
};

exports.updateTip = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, category, content, imageUrl, popular } = req.body;

    const existing = await prisma.beautyTip.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Beauty tip not found' });
    }

    const updated = await prisma.beautyTip.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(category !== undefined && { category: category.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl ? imageUrl.trim() : null }),
        ...(popular !== undefined && { popular: Boolean(popular) }),
      },
    });

    res.status(200).json({ success: true, message: 'Beauty tip updated', data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteTip = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.beautyTip.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Beauty tip not found' });
    }

    await prisma.beautyTip.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Beauty tip deleted successfully' });
  } catch (err) {
    next(err);
  }
};
