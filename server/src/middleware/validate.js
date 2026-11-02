const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

const registerRules = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[A-Za-z]/)
    .withMessage('Password must contain at least one letter'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const productRules = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Product description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a valid positive number'),
  body('imageUrl').isURL().withMessage('Please provide a valid image URL'),
  body('categoryId').isInt().withMessage('Valid category ID is required'),
];

const tipRules = [
  body('title').trim().notEmpty().withMessage('Tip title is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  productRules,
  tipRules,
};
