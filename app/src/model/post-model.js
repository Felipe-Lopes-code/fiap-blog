const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./user-model');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  available: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author_id: { 
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    }
  }
}, {
  timestamps: true
});

module.exports = Post;