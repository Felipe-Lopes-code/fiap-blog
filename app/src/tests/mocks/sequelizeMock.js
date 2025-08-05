const { DataTypes } = require('sequelize');

// Mock de um usuário para testes
const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  role: 'user'
};

// Mock do modelo User
const User = {
  findOne: jest.fn().mockResolvedValue(mockUser),
  findByPk: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue([1]),
  destroy: jest.fn().mockResolvedValue(1)
};

// Mock do Sequelize
const sequelize = {
  define: jest.fn().mockReturnValue(User),
  authenticate: jest.fn().mockResolvedValue(),
  sync: jest.fn().mockResolvedValue(),
  DataTypes
};

// Mock do módulo inteiro
module.exports = {
  sequelize,
  User,
  DataTypes
};
