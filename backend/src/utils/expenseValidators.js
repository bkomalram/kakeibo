const { body, param, query } = require('express-validator');

// Expense Validation
const validateCreateExpense = [
    body('user_id').notEmpty().withMessage('user_id parameter is required').isInt().withMessage('user_id parameter must be a number'),
    body('amount').notEmpty().withMessage('amount parameter is required').isFloat({ gt: 0 }).withMessage('amount parameter must be a positive number'),
    body('description').notEmpty().withMessage('description parameter is required').isString().withMessage('description parameter must be a string'),
    body('category').notEmpty().withMessage('category parameter is required').isString().withMessage('category parameter must be a string'),
    body('date').notEmpty().withMessage('date parameter is required').isISO8601().withMessage('date parameter must be a valid date')
];

const validateUpdateExpense = [
    param('id').notEmpty().withMessage('ID path parameter is required').isInt().withMessage('ID path parameter must be a number'),
    body('user_id').notEmpty().withMessage('user_id parameter is required').isInt().withMessage('user_id parameter must be a number'),
    body('amount').notEmpty().withMessage('amount parameter is required').isFloat({ gt: 0 }).withMessage('amount parameter must be a positive number'),
    body('description').notEmpty().withMessage('description parameter is required').isString().withMessage('description parameter must be a string'),
    body('category').notEmpty().withMessage('category parameter is required').isString().withMessage('category parameter must be a string'),
    body('date').notEmpty().withMessage('date parameter is required').isISO8601().withMessage('date parameter must be a valid date')
];

  const validateId = [
    param('id').notEmpty().withMessage('ID path parameter is required').isInt().withMessage('ID path parameter must be a number')
  ];

  const validateDate = [
    query('from').isString().withMessage('from path parameter must be a string').notEmpty().withMessage('from query parameter is required'),
    query('to').isString().withMessage('to path parameter must be a string').notEmpty().withMessage('to query parameter is required')
  ];

module.exports = {
    validateCreateExpense,
    validateUpdateExpense,
    validateId,
    validateDate
};