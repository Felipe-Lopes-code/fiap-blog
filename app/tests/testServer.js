const express = require('express');
const postRoutes = require('../../src/routes/post-routes');
const userRoutes = require('../../src/routes/user-routes');
const { authenticate } = require('../../src/middlewares/authMiddleware');

// Cria uma instância do Express para testes
const app = express();

// Configuração dos middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração das rotas
// Rota de usuários não precisa de autenticação
app.use('/users', userRoutes);

// Rotas de posts precisam de autenticação
app.use('/posts', authenticate, postRoutes);

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err);
  
  // Erros específicos do Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  // Erros de validação customizados
  if (err.status === 400) {
    return res.status(400).json({ error: err.message });
  }
  
  // Erros de não encontrado
  if (err.status === 404) {
    return res.status(404).json({ error: 'Recurso não encontrado' });
  }
  
  // Erro interno do servidor
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
