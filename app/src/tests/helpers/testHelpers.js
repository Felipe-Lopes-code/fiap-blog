const request = require('supertest');
const bcrypt = require('bcrypt');
const { User, Post, setupTestDB, clearTestDB } = require('./testDatabase');

const createTestUser = async (userData = {}) => {
  const defaultData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'professor'
  };

  const data = { ...defaultData, ...userData };
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await User.create({
    ...data,
    password: hashedPassword
  });
};

const createTestPost = async (postData = {}, user) => {
  const defaultData = {
    title: 'Test Post',
    content: 'Test Content',
    author: user?.name || 'Test Author',
    authorId: user?.id || 1,
    available: true
  };

  return await Post.create({ ...defaultData, ...postData });
};

const getAuthToken = async (app, credentials = {}) => {
  const defaultCredentials = {
    email: 'test@example.com',
    password: 'password123'
  };

  const response = await request(app)
    .post('/users/login')
    .send({ ...defaultCredentials, ...credentials });

  return response.body.token;
};

module.exports = {
  setupTestDB,
  clearTestDB,
  createTestUser,
  createTestPost,
  getAuthToken,
  User,
  Post
};
