const request = require('supertest');
const app = require('./_testServer');
const { mockUser, generateToken } = require('./testConfig');

describe('Test Server Setup', () => {
  let token;

  beforeEach(() => {
    token = generateToken();
  });

  it('should handle JSON requests', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', content: 'Test' });
    
    expect(response.status).not.toBe(415); // 415 é o código para unsupported media type
  });

  it('should have authentication working for /posts', async () => {

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
    // Configuração do token e ambiente
    process.env.JWT_SECRET = 'test-secret-key';
    const mockTestUser = { id: 1, role: 'user' };
    const token = generateToken(mockTestUser);

    // Mock das respostas
    jest.spyOn(Post, 'findAll').mockResolvedValue([]);

    const response = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
  });

  it('should handle database errors correctly', async () => {
    // Configuração do token e ambiente
    process.env.JWT_SECRET = 'test-secret-key';
    const token = generateToken(mockUser);
    
    // Mock para simular erro no banco de dados
    jest.spyOn(Post, 'findAll').mockRejectedValue(new Error('Database error'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const response = await request(app)
      .get('/posts')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Token inválido');
  });
});
