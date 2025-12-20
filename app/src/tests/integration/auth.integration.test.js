// Mock dos modelos ANTES de qualquer import
jest.mock('../../model', () => {
  const { sequelize } = require('../helpers/testDatabase');
  return sequelize;
});

jest.mock('../../model/user-model', () => {
  const { User } = require('../helpers/testDatabase');
  return User;
});

jest.mock('../../model/post-model', () => {
  const { Post } = require('../helpers/testDatabase');
  return Post;
});

const request = require('supertest');
const app = require('../../app');
const {
  setupTestDB,
  clearTestDB,
  createTestUser,
  User
} = require('../helpers/testHelpers');

describe('Authentication Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('POST /users/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Criar usuário de teste
      await createTestUser({
        email: 'professor@test.com',
        password: 'password123',
        role: 'professor'
      });

      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'professor@test.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('should fail login with invalid email', async () => {
      await createTestUser({
        email: 'professor@test.com',
        password: 'password123'
      });

      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'wrong@test.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
    });

    it('should fail login with invalid password', async () => {
      await createTestUser({
        email: 'professor@test.com',
        password: 'password123'
      });

      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'professor@test.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Senha incorreta');
    });
  });

  describe('Authentication Middleware', () => {
    it('should reject requests without token', async () => {
      const response = await request(app)
        .get('/posts');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token ausente');
    });

    it('should reject requests with invalid token', async () => {
      const response = await request(app)
        .get('/posts')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token inválido');
    });

    it('should accept requests with valid token', async () => {
      // Criar usuário e fazer login
      await createTestUser({
        email: 'professor@test.com',
        password: 'password123',
        role: 'professor'
      });

      const loginResponse = await request(app)
        .post('/users/login')
        .send({
          email: 'professor@test.com',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get('/posts')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });
  });
});
