const { Sequelize } = require('sequelize');

// Criar conexão SQLite em memória para testes
const sequelize = new Sequelize('sqlite::memory:', {
  logging: false,
  dialect: 'sqlite'
});

// Redefinir os modelos para usar o banco de teste
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  role: { 
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true
});

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
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
  authorId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    }
  }
}, {
  timestamps: true
});

// Configurar relacionamentos
Post.belongsTo(User, { foreignKey: 'authorId' });
User.hasMany(Post, { foreignKey: 'authorId' });

const setupTestDB = async () => {
  await sequelize.sync({ force: true });
};

const teardownTestDB = async () => {
  await sequelize.close();
};

const clearTestDB = async () => {
  await Post.destroy({ where: {}, truncate: true });
  await User.destroy({ where: {}, truncate: true });
};

module.exports = {
  sequelize,
  User,
  Post,
  setupTestDB,
  teardownTestDB,
  clearTestDB
};
