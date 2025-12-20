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
  getAuthToken,
  User
} = require('../helpers/testHelpers');

describe('Users Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('POST /users', () => {
    it('should create a new user with valid data', async () => {
      const newUser = {
        name: 'New User',
        email: 'newuser@test.com',
        password: 'password123',
        role: 'aluno'
      };

      const response = await request(app)
        .post('/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newUser.name);
      expect(response.body.email).toBe(newUser.email);
      expect(response.body).not.toHaveProperty('password'); // Não deve retornar a senha
    });

    it('should fail to create user with missing fields', async () => {
      const invalidUser = {
        name: 'New User',
        email: 'newuser@test.com'
        // faltando password e role
      };

      const response = await request(app)
        .post('/users')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should fail to create user with duplicate email', async () => {
      const userData = {
        name: 'User One',
        email: 'duplicate@test.com',
        password: 'password123',
        role: 'aluno'
      };

      // Criar primeiro usuário
      await createTestUser(userData);

      // Tentar criar segundo usuário com mesmo email
      const response = await request(app)
        .post('/users')
        .send(userData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'Email já cadastrado');
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      // Criar múltiplos usuários
      await createTestUser({ email: 'user1@test.com', name: 'User 1' });
      await createTestUser({ email: 'user2@test.com', name: 'User 2' });
      await createTestUser({ email: 'user3@test.com', name: 'User 3' });

      const response = await request(app)
        .get('/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('should return empty array when no users exist', async () => {
      const response = await request(app)
        .get('/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user successfully', async () => {
      const user = await createTestUser({
        name: 'Original Name',
        email: 'original@test.com'
      });

      const updateData = {
        name: 'Updated Name',
        email: 'updated@test.com'
      };

      const response = await request(app)
        .put(`/users/${user.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Usuário atualizado com sucesso');

      // Verificar se foi atualizado no banco
      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.name).toBe(updateData.name);
      expect(updatedUser.email).toBe(updateData.email);
    });

    it('should update user password with hash', async () => {
      const user = await createTestUser({
        email: 'user@test.com',
        password: 'oldpassword'
      });

      const response = await request(app)
        .put(`/users/${user.id}`)
        .send({ password: 'newpassword123' });

      expect(response.status).toBe(200);

      // Verificar se a senha foi hasheada
      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.password).not.toBe('newpassword123');
      expect(updatedUser.password.length).toBeGreaterThan(20); // Hash deve ser longo
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user successfully', async () => {
      const user = await createTestUser({
        email: 'todelete@test.com'
      });

      const response = await request(app)
        .delete(`/users/${user.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Usuário excluído com sucesso');

      // Verificar se foi deletado do banco
      const deletedUser = await User.findByPk(user.id);
      expect(deletedUser).toBeNull();
    });

    it('should handle deletion of non-existent user', async () => {
      const response = await request(app)
        .delete('/users/99999');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
