const express = require('express');
const router = express.Router();
const knex = require('../config');
const userModel = require('../models/user')(knex);

// Crear usuario
router.post('/', async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  const users = await userModel.findAll();
  res.json(users);
});

// Obtener usuario por id
router.get('/:id', async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const user = await userModel.update(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  await userModel.remove(req.params.id);
  res.status(204).end();
});

module.exports = router;
