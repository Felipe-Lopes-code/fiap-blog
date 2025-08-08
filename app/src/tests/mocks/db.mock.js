const { DataTypes } = require('sequelize');

// Mock dos modelos para testes
const mockModels = {
  Post: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  }
};

// Configuração do sequelize mock
const sequelize = {
  define: jest.fn((modelName, attributes) => {
    return mockModels[modelName];
  }),
  authenticate: jest.fn().mockResolvedValue(),
  sync: jest.fn().mockResolvedValue(),
  models: mockModels
};

// Dados de exemplo para testes
const mockPostData = {
  id: 1,
  title: 'Test Post',
  content: 'Test Content',
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

const mockUserData = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date()
};

module.exports = {
  sequelize,
  DataTypes,
  mockModels,
  mockPostData,
  mockUserData
};
