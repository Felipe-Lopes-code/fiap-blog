const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API FIAP Tech Challenge',
      version: '1.0.0',
      description: `Documentação da API do Tech Challenge FIAP.
      
## Cobertura de Testes

### Autenticação
- ✓ Login com credenciais válidas
- ✓ Validação de usuário inexistente
- ✓ Validação de senha incorreta
- ✓ Autenticação via token JWT
- ✓ Validação de tokens ausentes/inválidos

### Posts
- ✓ Busca por termo no título/conteúdo
- ✓ Criação com validação de campos
- ✓ Validação de autor existente

Todos os endpoints são validados através de testes unitários e de integração.`,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/post-routes.js'),
    path.join(__dirname, '../routes/user-routes.js')
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;