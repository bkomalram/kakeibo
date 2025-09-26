const express = require('express');
const router = express.Router();
const database = require('../database');
const {validateCreateExpense ,  validateUpdateExpense, validateId} = require('../utils/expenseValidators');


// Create Expense
router.post('/', validateCreateExpense, async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const newExpense = req.body;
    database.raw(`INSERT INTO expenses (id, user_id, amount, description) VALUES(NULL, "${newExpense.user_id}", "${newExpense.amount}", "${newExpense.description}") RETURNING id`)
    .then(([rows]) => rows[0])
    .then((row) => res.status(201).json({message : "Expense Created. ExpenseId:" + row.id}))
    .catch(next);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all Expenses
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    database.raw(`SELECT id, user_id, amount, description FROM expenses WHERE user_id = ${userId}`)
    .then(([rows]) => res.json({ message: rows }))
    .catch(next);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single Expense
router.get('/:userId/:id', validateId, async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const expenseId = req.params.id;
    const userId = req.params.userId;
    database.raw(`SELECT id, user_id, amount, description FROM expenses WHERE id = ${expenseId} AND user_id = ${userId}`)
    .then(([rows]) => rows[0])
    .then((row) => row ? res.json({ message: row }) : res.status(404).json({ message: 'Expense not found' }))
    .catch(next);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Expense
router.put('/:userId/:id', validateUpdateExpense, async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const expenseId = req.params.id;
    const expense = req.body;
    database.raw(`SELECT * FROM expenses WHERE id = ${expenseId} AND user_id = ${userId}`)
    .then(([rows]) => rows[0])
    .then((row) => row ? 
        database.raw(`UPDATE expenses SET user_id="${expense.user_id}", amount="${expense.amount}", description="${expense.description}" WHERE id = ${expenseId} AND user_id = ${userId}`)
        .then(([rows]) => rows[0])
        .then((row) => res.json({ message: 'Expense updated.' }))
    : res.status(404).json({ message: 'Expense not found' }))
    .catch(next);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Expense
router.delete('/:userId/:id', validateId, async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const expenseId = req.params.id;
    database.raw(`SELECT * FROM expenses WHERE id = ${expenseId}`)
    .then(([rows]) => rows[0])
    .then((row) => row ? 
        database.raw(`UPDATE expenses SET active = false WHERE id = ${expenseId}`)
        .then(([rows]) => rows[0])
        .then((row) => res.json({ message: 'Expense deleted.' }))
    : res.status(404).json({ message: 'Expense not found' }))
    .catch(next);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
