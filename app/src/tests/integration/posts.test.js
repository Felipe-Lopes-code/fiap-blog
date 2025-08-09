const request = require('supertest');
const app = require('../_testServer');
const { Post } = require('../../model/post-model');
const { mockUser, mockPost, generateToken } = require('../testConfig');

describe('Posts Integration Tests', () => {
  let authToken;
  let server;

  beforeAll((done) => {
    authToken = generateToken();
    server = app.listen(0, () => {
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    // Configuração do token de autenticação
    authToken = generateToken(mockUser);
    process.env.JWT_SECRET = 'test-secret-key';

    // Mock das funções do modelo Post
    jest.spyOn(Post, 'findAll').mockResolvedValue([mockPost]);
    jest.spyOn(Post, 'findOne').mockResolvedValue(mockPost);
    jest.spyOn(Post, 'findByPk').mockResolvedValue(mockPost);
    jest.spyOn(Post, 'create').mockImplementation((data) => Promise.resolve({ ...mockPost, ...data }));
    jest.spyOn(Post, 'update').mockResolvedValue([1]);
    jest.spyOn(Post, 'destroy').mockResolvedValue(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /posts', () => {
    it('should return all posts', async () => {
      const mockPosts = [
        { id: 1, title: 'Post 1', content: 'Content 1' },
        { id: 2, title: 'Post 2', content: 'Content 2' }
      ];

      Post.findAll.mockResolvedValue(mockPosts);

      const response = await request(app)
        .get('/posts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPosts);
    });
  });

  describe('POST /posts', () => {
    it('should create a new post', async () => {
      const newPost = {
        title: 'New Post',
        content: 'New Content'
      };

      Post.create.mockResolvedValue({ id: 1, ...newPost });

      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newPost);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newPost.title);
    });

    it('should return 400 for invalid post data', async () => {
      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /posts/:id', () => {
    it('should return a specific post', async () => {
      const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test Content'
      };

      Post.findByPk.mockResolvedValue(mockPost);

      const response = await request(app)
        .get('/posts/1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPost);
    });

    it('should return 404 for non-existent post', async () => {
      Post.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get('/posts/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /posts/:id', () => {
    it('should update a post', async () => {
      const updatedPost = {
        title: 'Updated Title',
        content: 'Updated Content'
      };

      Post.findByPk.mockResolvedValue({ id: 1, ...updatedPost });
      Post.update.mockResolvedValue([1]);

      const response = await request(app)
        .put('/posts/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedPost);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: 1, ...updatedPost });
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete a post', async () => {
      Post.findByPk.mockResolvedValue({ id: 1 });
      Post.destroy.mockResolvedValue(1);

      const response = await request(app)
        .delete('/posts/1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent post', async () => {
      Post.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .delete('/posts/999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
