const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env.test
dotenv.config({ path: '.env.test' });

// Configura o timeout do Jest para testes de integração
jest.setTimeout(30000);

// Configurações globais para testes
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-integration-tests';

// Limpa todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});

