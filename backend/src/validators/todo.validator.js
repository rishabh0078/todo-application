const { body } = require('express-validator')

const createTodoValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['Urgent', 'Non-Urgent'])
    .withMessage('Category must be Urgent or Non-Urgent'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('user')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
]

const updateTodoValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('category')
    .optional()
    .isIn(['Urgent', 'Non-Urgent'])
    .withMessage('Category must be Urgent or Non-Urgent'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be true or false'),
  body('user')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
]

module.exports = { createTodoValidator, updateTodoValidator }
