require('dotenv').config();
const app = require('./app');
const sequelize = require('./model');

// Sync com banco de dados
sequelize.sync({ alter: true }).then(() => {
  console.log('Banco sincronizado');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
