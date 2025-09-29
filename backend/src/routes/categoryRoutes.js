const express = require('express');
const router = express.Router();
const knex = require('../database');

// Obtener todas las categorías de un usuario
router.get('/:userId', async (req, res) => {
  try {
    const categories = await knex('user_categories').where('user_id', req.params.userId);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' + err.message });
  }
});

// Crear una nueva categoría
router.post('/:userId', async (req, res) => {
  try {
    const { name, icon } = req.body;
    const [id] = await knex('user_categories').insert({ user_id: req.params.userId, name, icon });
    res.status(201).json({ id, name, icon });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// Actualizar una categoría
router.put('/:userId/:categoryId', async (req, res) => {
  try {
    const { name, icon } = req.body;
    await knex('user_categories')
      .where({ id: req.params.categoryId, user_id: req.params.userId })
      .update({ name, icon });
    res.json({ id: req.params.categoryId, name, icon });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

// Eliminar una categoría
router.delete('/:userId/:categoryId', async (req, res) => {
  try {
    await knex('user_categories')
      .where({ id: req.params.categoryId, user_id: req.params.userId })
      .del();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
});

module.exports = router;
