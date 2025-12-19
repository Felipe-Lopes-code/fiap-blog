require('dotenv').config();
const express = require('express');
const postRoutes = require('./routes/post-routes');
const userRoutes = require('./routes/user-routes');
const swaggerSpec = require('./doc/app-swagger');
const swaggerUi = require('swagger-ui-express');

const app = express();

app.use(express.json());

// Rota de posts
app.use('/posts', postRoutes);

// Rota de usuários
app.use('/users', userRoutes);

// Rota para documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'list'
  }
}));

module.exports = app;
