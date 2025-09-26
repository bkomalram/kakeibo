const express = require('express');
const router = express.Router();
const database = require('../database');
const { validationResult } = require('express-validator');
const { validateCreateUser, validateUpdateUser, validateId, validateLogin } = require('../utils/userValidators');


// User Routes 
// Create User
router.post('/', validateCreateUser, async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const newUser = req.body;
    database.raw(`INSERT INTO users (id, name, email, password, role) VALUES(NULL,"${newUser.name}", "${newUser.email}", "${btoa(newUser.password)}", "${newUser.role}") RETURNING id`)
    .then(([rows]) => rows[0])
    .then((row) => res.status(201).json({message : "User Created. UserId:" + row.id}))
    .catch(next);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all Users
router.get('/', async (req, res, next) => {
  try {
    database.raw('SELECT id, name, role FROM users')
    .then(([rows]) => res.json({ message: rows }))
    .catch(next);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single User
router.get('/:id', validateId, async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const userId = req.params.id;
    database.raw(`SELECT id, name, role FROM users WHERE id = ${userId}`)
    .then(([rows]) => rows[0])
    .then((row) => row ? res.json({ message: row }) : res.status(404).json({ message: 'User not found' }))
    .catch(next);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update User
router.put('/:id', validateUpdateUser, async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const userId = req.params.id;
    const user = req.body;
    database.raw(`SELECT * FROM users WHERE id = ${userId}`)
    .then(([rows]) => rows[0])
    .then((row) => row ? 
        database.raw(`UPDATE users SET name="${user.name}", password="${btoa(user.password)}", role="${user.role}" WHERE id = ${userId}`)
        .then(([rows]) => rows[0])
        .then((row) => res.json({ message: 'User updated.' }))
    : res.status(404).json({ message: 'User not found' }))
    .catch(next);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete User
router.delete('/:id', validateId, async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const userId = req.params.id;
    database.raw(`SELECT * FROM users WHERE id = ${userId}`)
    .then(([rows]) => rows[0])
    .then((row) => row ? 
        database.raw(`UPDATE users SET active = false WHERE id = ${userId}`)
        .then(([rows]) => rows[0])
        .then((row) => res.json({ message: 'User deleted.' }))
    : res.status(404).json({ message: 'User not found' }))
    .catch(next);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Log In
router.post('/login', validateLogin, async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const newUser = req.body;
    database.raw(`SELECT id, name, email, role FROM users WHERE email = "${newUser.email}" AND password = "${btoa(newUser.password)}"`)
    .then(([rows]) => rows[0])
    .then((row) => row ? res.json(row) : res.status(404).json({ message: 'Wrong email or password' }))
    .catch(next);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
