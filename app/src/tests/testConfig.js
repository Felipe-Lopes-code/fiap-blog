const jwt = require('jsonwebtoken');

// Configuração comum para todos os testes
process.env.JWT_SECRET = 'test-secret-key';

// Mock de usuário para testes
const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  role: 'user'
};

// Mock de post para testes
const mockPost = {
  id: 1,
  title: 'Test Post',
  content: 'Test Content',
  authorId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Função para gerar token JWT para testes
const generateToken = (user = mockUser) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Mock do User model
jest.mock('../model/user-model', () => ({
  findByPk: jest.fn().mockResolvedValue(mockUser),
  findOne: jest.fn().mockResolvedValue(mockUser)
}));

// Mock do Post model
jest.mock('../model/post-model', () => ({
  Post: {
    findAll: jest.fn().mockResolvedValue([mockPost]),
    findOne: jest.fn().mockResolvedValue(mockPost),
    findByPk: jest.fn().mockResolvedValue(mockPost),
    create: jest.fn().mockImplementation((data) => Promise.resolve({ ...mockPost, ...data })),
    update: jest.fn().mockResolvedValue([1]),
    destroy: jest.fn().mockResolvedValue(1)
  }
}));

// Exporta todas as configurações
module.exports = {
  mockUser,
  mockPost,
  generateToken,
  User: require('../model/user-model'),
  Post: require('../model/post-model').Post
};

// Limpar todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});

module.exports = {
  mockUser,
  mockPost,
  generateToken
};
