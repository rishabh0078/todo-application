const { body } = require('express-validator')

const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Enter a valid email address'),
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
]

const loginValidator = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
]

module.exports = { registerValidator, loginValidator }
