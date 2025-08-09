const express = require('express');
const asyncHandler = require('express-async-handler');
const { authenticate } = require('../middlewares/authMiddleware');
const { mockUser } = require('./testConfig');

// Mock do modelo Post
const Post = {
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn()
};

// Mock do modelo User
const User = {
  findOne: jest.fn().mockResolvedValue(mockUser),
  findByPk: jest.fn().mockResolvedValue(mockUser)
};

// Mock do módulo jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockReturnValue({ id: 1, role: 'user' }),
  sign: jest.fn().mockReturnValue('mock-token')
}));

// Mock do módulo bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true)
}));

const app = express();
app.use(express.json());

// Mock das rotas de posts
const postRoutes = express.Router();

postRoutes.get('/', authenticate, asyncHandler(async (req, res) => {
  const posts = await Post.findAll();
  res.status(200).json(posts);
}));

postRoutes.post('/', authenticate, asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
  }
  const post = await Post.create({ title, content, authorId: req.user.id });
  res.status(201).json(post);
}));

postRoutes.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const post = await Post.findByPk(id);
  if (!post) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }
  res.status(200).json(post);
}));

postRoutes.put('/:id', authenticate, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const post = await Post.findByPk(id);
  if (!post) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }
  if (post.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Não autorizado' });
  }
  const [updated] = await Post.update(req.body, { where: { id } });
  res.status(200).json({ updated: !!updated });
}));

postRoutes.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const post = await Post.findByPk(id);
  if (!post) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }
  if (post.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Não autorizado' });
  }
  await Post.destroy({ where: { id } });
  res.status(204).end();
}));

app.use('/posts', postRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
