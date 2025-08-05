require('dotenv').config();
const express = require('express');
const postRoutes = require('./routes/post-routes');
const userRoutes = require('./routes/user-routes');
const swaggerSpec = require('./doc/app-swagger');
const swaggerUi = require('swagger-ui-express');
const sequelize = require('./model');
const app = express();

app.use(express.json());

// Rota de posts
app.use('/posts', postRoutes);

// Rota de usuários
app.use('/users', userRoutes);

// Rota para documentação do Swagger
// Configuração do Swagger antes das rotas
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'list'
  }
}));

// // Sync com banco de dados
// sequelize.sync({ alter: true }).then(() => {
//   console.log('Banco sincronizado');
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
