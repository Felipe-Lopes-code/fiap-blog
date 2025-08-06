const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./testServer');
const { User } = require('../model/user-model');

describe('Test Server Setup', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-key';
  });

  it('should handle JSON requests', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${jwt.sign({ id: 1 }, process.env.JWT_SECRET)}`)
      .send({ title: 'Test', content: 'Test' });
    
    expect(response.status).not.toBe(415); // 415 é o código para unsupported media type
  });

  it('should have authentication working for /posts', async () => {
    const mockUser = { id: 1, role: 'user' };
    const token = jwt.sign(mockUser, process.env.JWT_SECRET);
    User.findByPk.mockResolvedValueOnce(mockUser);

    const response = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it('should return 401 for unauthorized requests to /posts', async () => {
    const response = await request(app).get('/posts');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Token ausente');
  });

  it('should accept requests with valid authentication', async () => {
    const mockUser = { id: 1, role: 'user' };
    const token = jwt.sign(mockUser, process.env.JWT_SECRET);
    User.findByPk.mockResolvedValueOnce(mockUser);

    const response = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
  });

  it('should handle database errors correctly', async () => {
    const mockUser = { id: 1, role: 'user' };
    const token = jwt.sign(mockUser, process.env.JWT_SECRET);
    
    // Mock para simular erro no banco de dados
    User.findByPk.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Token inválido');
  });
});
