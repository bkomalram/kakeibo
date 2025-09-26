const { body, param, query } = require('express-validator');

// Login Validation
const validateLogin = [
    body('username').notEmpty().withMessage('username parameter is required').isString().withMessage('username parameter must be a string'),
    body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];
// User Validation
const validateCreateUser = [
    body('username').notEmpty().withMessage('username parameter is required').isString().withMessage('username parameter must be a string'),
    body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('role').notEmpty().withMessage('Role parameter missing')
    .isString().withMessage('Role parameter must be a string')
    .matches(/^(OPERADOR|FACTURADOR|ADMINISTRADOR)$/).withMessage('Role must be either OPERADOR, FACTURADOR or ADMINISTRADOR')
  ];

  const validateUpdateUser = [
    param('id').notEmpty().withMessage('ID path parameter is required').isInt().withMessage('ID path parameter must be a number'),
    body('username').notEmpty().withMessage('username parameter is required').isString().withMessage('username parameter must be a string'),
    body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('role').notEmpty().withMessage('Role parameter missing')
    .isString().withMessage('Role parameter must be a string')
    .matches(/^(OPERADOR|FACTURADOR|ADMINISTRADOR)$/).withMessage('Role must be either \'OPERADOR\', \'FACTURADOR\' or \'ADMINISTRADOR\'')
  ];

  const validateId = [
    param('id').notEmpty().withMessage('ID path parameter is required').isInt().withMessage('ID path parameter must be a number')
  ];

  const validateDate = [
    query('from').isString().withMessage('from path parameter must be a string').notEmpty().withMessage('from query parameter is required'),
    query('to').isString().withMessage('to path parameter must be a string').notEmpty().withMessage('to query parameter is required')
  ];

module.exports = {
    validateLogin,
    validateCreateUser,
    validateUpdateUser,
    validateId,
    validateDate
};