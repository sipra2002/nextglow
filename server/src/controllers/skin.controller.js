const prisma = require('../config/db');
const { calculateSkinType, skinSuggestions } = require('../utils/skinScoring');

const formatProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    skinTypes: typeof p.skinTypes === 'string'
      ? p.skinTypes.split(',').map((s) => s.trim()).filter(Boolean)
      : (Array.isArray(p.skinTypes) ? p.skinTypes : []),
  };
};

exports.analyzeSkin = async (req, res, next) => {
  try {
    const { answers } = req.body;
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ success: false, message: 'Questionnaire answers are required' });
    }

    const skinType = calculateSkinType(answers);
    const suggestions = skinSuggestions[skinType] || skinSuggestions.NORMAL;

    let saved = false;
    if (req.user && req.user.id) {
      await prisma.skinProfile.upsert({
        where: { userId: req.user.id },
        update: {
          skinType,
          answers: JSON.stringify(answers),
        },
        create: {
          userId: req.user.id,
          skinType,
          answers: JSON.stringify(answers),
        },
      });
      saved = true;
    }

    // Fetch matching recommended products
    const allProducts = await prisma.product.findMany({
      include: { category: true },
      take: 20,
    });

    const recommendedProducts = allProducts
      .map(formatProduct)
      .filter((p) => p.skinTypes.includes(skinType) || p.skinTypes.includes('ALL'))
      .slice(0, 6);

    res.status(200).json({
      success: true,
      data: {
        skinType,
        suggestions,
        recommendedProducts,
        saved,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMySkinProfile = async (req, res, next) => {
  try {
    const profile = await prisma.skinProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No skin profile found. Take the quiz to discover your skin type!',
      });
    }

    const suggestions = skinSuggestions[profile.skinType] || skinSuggestions.NORMAL;

    const allProducts = await prisma.product.findMany({
      include: { category: true },
      take: 20,
    });

    const recommendedProducts = allProducts
      .map(formatProduct)
      .filter((p) => p.skinTypes.includes(profile.skinType) || p.skinTypes.includes('ALL'))
      .slice(0, 6);

    res.status(200).json({
      success: true,
      data: {
        skinType: profile.skinType,
        updatedAt: profile.updatedAt,
        answers: JSON.parse(profile.answers || '{}'),
        suggestions,
        recommendedProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};
