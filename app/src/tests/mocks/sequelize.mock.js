const { DataTypes } = require('sequelize');

// Mock dos modelos
const Post = {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  authorId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  }
};

const User = {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
};

// Mock do Sequelize
const mockSequelize = {
  define: jest.fn((modelName, attributes) => {
    const models = {
      Post: {
        findOne: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
        sync: jest.fn(),
      },
      User: {
        findOne: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
        hasMany: jest.fn(),
        belongsTo: jest.fn(),
        sync: jest.fn(),
      }
    };
    return models[modelName];
  }),
  authenticate: jest.fn().mockResolvedValue(),
  sync: jest.fn().mockResolvedValue(),
  transaction: jest.fn().mockImplementation(fn => fn()),
};

// Mock de dados
const mockData = {
  posts: [
    {
      id: 1,
      title: 'Test Post',
      content: 'Test Content',
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  users: [
    {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]
};

jest.mock('../model/index', () => mockSequelize);

module.exports = {
  mockSequelize,
  mockData,
  Post,
  User,
  DataTypes
};
