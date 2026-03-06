const express = require('express');
const recipesRouter = require('./routes/recipes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/recipes', recipesRouter);

app.use(errorHandler);

module.exports = app;
