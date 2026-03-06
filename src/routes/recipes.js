const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// GET /recipes
router.get('/', async (_req, res, next) => {
  try {
    const recipes = await prisma.recipe.findMany();
    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

// GET /recipes/:id
router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// POST /recipes
router.post('/', async (req, res, next) => {
  try {
    const { title, ingredients, steps, duration, description } = req.body;
    if (!title || !ingredients || !steps || !duration) {
      return res.status(400).json({
        error: 'Missing required fields: title, ingredients, steps, duration',
      });
    }
    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        steps,
        duration: parseInt(duration),
        description: description || null,
      },
    });
    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
});

// PUT /recipes/:id
router.put('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.recipe.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    const { title, ingredients, steps, duration, description } = req.body;
    const recipe = await prisma.recipe.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        ingredients,
        steps,
        duration: duration ? parseInt(duration) : undefined,
        description,
      },
    });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// DELETE /recipes/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const existing = await prisma.recipe.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    await prisma.recipe.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
