const dotenv = require('dotenv');
const { sequelize } = require('../model');

// Carrega as variáveis de ambiente do arquivo .env.test
dotenv.config({ path: '.env.test' });

// Configura o timeout do Jest para testes de integração
jest.setTimeout(10000);

// Suprime logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Configurações globais para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Mock do Sequelize e seus modelos
jest.mock('../model', () => require('./mocks/sequelizeMock'));
jest.mock('../model/user-model', () => {
  const { User } = require('./mocks/sequelizeMock');
  return { User };
});

// Mock do Sequelize para testes
jest.mock('../model/index', () => ({
  sequelize: {
    define: jest.fn(),
    authenticate: jest.fn().mockResolvedValue(),
  },
}));

// Desativa os logs durante os testes
console.log = jest.fn();
console.error = jest.fn();

// Limpa todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});

// Fecha todas as conexões após todos os testes
afterAll(async () => {
  // Adicione aqui qualquer limpeza necessária após os testes
});
