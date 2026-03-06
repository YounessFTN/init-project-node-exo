const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/lib/prisma', () => ({
  recipe: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const prisma = require('../src/lib/prisma');

describe('Recipes API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. GET /health
  test('GET /health returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  // 2. POST /recipes - valid creation
  test('POST /recipes creates a recipe and returns 201', async () => {
    const mockRecipe = {
      id: 1,
      title: 'Spaghetti Bolognese',
      description: 'Classic Italian pasta',
      ingredients: 'pasta, minced beef, tomato sauce, onion, garlic',
      steps: 'Brown the beef. Add sauce. Cook pasta. Combine.',
      duration: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    prisma.recipe.create.mockResolvedValue(mockRecipe);

    const res = await request(app)
      .post('/recipes')
      .send({
        title: 'Spaghetti Bolognese',
        description: 'Classic Italian pasta',
        ingredients: 'pasta, minced beef, tomato sauce, onion, garlic',
        steps: 'Brown the beef. Add sauce. Cook pasta. Combine.',
        duration: 45,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title', 'Spaghetti Bolognese');
  });

  // 3. POST /recipes - validation failure (missing fields)
  test('POST /recipes returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/recipes')
      .send({ title: 'Incomplete Recipe' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('Missing required fields');
  });

  // 4. GET /recipes/:id - found (200)
  test('GET /recipes/:id returns 200 with recipe when found', async () => {
    const mockRecipe = {
      id: 1,
      title: 'Spaghetti Bolognese',
      ingredients: 'pasta, minced beef',
      steps: 'Cook it all together',
      duration: 45,
    };
    prisma.recipe.findUnique.mockResolvedValue(mockRecipe);

    const res = await request(app).get('/recipes/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title', 'Spaghetti Bolognese');
  });

  // 5. GET /recipes/:id - not found (404)
  test('GET /recipes/:id returns 404 when recipe does not exist', async () => {
    prisma.recipe.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/recipes/999');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Recipe not found');
  });

  // 6. DELETE /recipes/:id - success
  test('DELETE /recipes/:id deletes the recipe and returns 200', async () => {
    prisma.recipe.findUnique.mockResolvedValue({ id: 1 });
    prisma.recipe.delete.mockResolvedValue({ id: 1 });

    const res = await request(app).delete('/recipes/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Recipe deleted successfully');
  });

  // 7. GET /recipes - list all
  test('GET /recipes returns 200 with array of recipes', async () => {
    prisma.recipe.findMany.mockResolvedValue([
      { id: 1, title: 'Pasta', ingredients: 'pasta', steps: 'cook', duration: 20 },
      { id: 2, title: 'Salad', ingredients: 'lettuce', steps: 'mix', duration: 5 },
    ]);

    const res = await request(app).get('/recipes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  // 8. DELETE /recipes/:id - not found
  test('DELETE /recipes/:id returns 404 when recipe does not exist', async () => {
    prisma.recipe.findUnique.mockResolvedValue(null);

    const res = await request(app).delete('/recipes/999');
    expect(res.status).toBe(404);
  });
});
