const { Sequelize, DataTypes } = require('sequelize');

const sequelize = {
  define: jest.fn((modelName, attributes, options) => {
    return {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };
  }),
  authenticate: jest.fn().mockResolvedValue(),
  sync: jest.fn().mockResolvedValue(),
};

module.exports = sequelize;
module.exports.DataTypes = DataTypes;
