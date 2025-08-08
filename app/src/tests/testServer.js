const express = require('express');
const asyncHandler = require('express-async-handler');
const { authenticate } = require('../middlewares/authMiddleware');
const { Post } = require('../model/post-model');
const { mockUser } = require('./testConfig');

const app = express();
app.use(express.json());

// Middleware para mock do usuário autenticado
app.use((req, res, next) => {
  req.user = mockUser;
  next();
});

// Mock das rotas de posts
const postRoutes = express.Router();

postRoutes.get('/', authenticate, asyncHandler(async (req, res) => {
  const posts = await Post.findAll();
  res.status(200).json(posts);
}));

postRoutes.post('/', asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
  }
  res.status(201).json({ id: 1, title, content });
}));

postRoutes.get('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  // Retorna 404 para IDs diferentes de 1 (simulando post não encontrado)
  if (id !== 1) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }
  const post = { id: 1, title: 'Test Post', content: 'Test Content' };
  res.status(200).json(post);
}));

postRoutes.put('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  
  // Verifica se o post existe
  if (id !== 1) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
  }
  
  res.status(200).json({ id: id, title, content });
}));

postRoutes.delete('/:id', asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  // Retorna 404 para IDs diferentes de 1 (simulando post não encontrado)
  if (id !== 1) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }
  res.status(204).send();
}));

// Mock das rotas de usuários
const userRoutes = express.Router();
userRoutes.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (email === 'test@example.com' && password === 'password') {
    res.json({ token: 'mock-token' });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
}));

// Configuração das rotas
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

module.exports = app;
// Rota de usuários não precisa de autenticação
app.use('/users', userRoutes);

// Rotas de posts precisam de autenticação
app.use('/posts', authenticate, postRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === 'ValidationError' || err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === 'NotFoundError' || err.status === 404) {
    return res.status(404).json({ error: 'Recurso não encontrado' });
  }
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
