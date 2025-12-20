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
  createTestPost,
  getAuthToken,
  User,
  Post
} = require('../helpers/testHelpers');

describe('Posts Integration Tests', () => {
  let professorToken;
  let alunoToken;
  let professor;
  let aluno;

  beforeAll(async () => {
    await setupTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
    
    // Criar professor e aluno para os testes
    professor = await createTestUser({
      name: 'Professor Test',
      email: 'professor@test.com',
      password: 'password123',
      role: 'professor'
    });

    aluno = await createTestUser({
      name: 'Aluno Test',
      email: 'aluno@test.com',
      password: 'password123',
      role: 'aluno'
    });

    professorToken = await getAuthToken(app, {
      email: 'professor@test.com',
      password: 'password123'
    });

    alunoToken = await getAuthToken(app, {
      email: 'aluno@test.com',
      password: 'password123'
    });
  });

  describe('POST /posts', () => {
    it('should allow professor to create a post', async () => {
      const newPost = {
        title: 'New Post Title',
        content: 'This is the post content'
      };

      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${professorToken}`)
        .send(newPost);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newPost.title);
      expect(response.body.content).toBe(newPost.content);
      expect(response.body.authorId).toBe(professor.id);
      expect(response.body.author).toBe(professor.name);
    });

    it('should not allow aluno to create a post', async () => {
      const newPost = {
        title: 'New Post Title',
        content: 'This is the post content'
      };

      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${alunoToken}`)
        .send(newPost);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Apenas professores podem criar posts.');
    });

    it('should fail to create post without authentication', async () => {
      const newPost = {
        title: 'New Post Title',
        content: 'This is the post content'
      };

      const response = await request(app)
        .post('/posts')
        .send(newPost);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token ausente');
    });

    it('should fail to create post with missing fields', async () => {
      const invalidPost = {
        title: 'Only Title'
        // missing content
      };

      const response = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${professorToken}`)
        .send(invalidPost);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /posts', () => {
    it('should return all posts for professor', async () => {
      // Criar posts com diferentes disponibilidades
      await createTestPost({ title: 'Post 1', available: true }, professor);
      await createTestPost({ title: 'Post 2', available: false }, professor);
      await createTestPost({ title: 'Post 3', available: true }, professor);

      const response = await request(app)
        .get('/posts')
        .set('Authorization', `Bearer ${professorToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3);
    });

    it('should return only available posts for aluno', async () => {
      // Criar posts com diferentes disponibilidades
      await createTestPost({ title: 'Post 1', available: true }, professor);
      await createTestPost({ title: 'Post 2', available: false }, professor);
      await createTestPost({ title: 'Post 3', available: true }, professor);

      const response = await request(app)
        .get('/posts')
        .set('Authorization', `Bearer ${alunoToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body.every(post => post.available === true)).toBe(true);
    });

    it('should return posts ordered by creation date (newest first)', async () => {
      const post1 = await createTestPost({ title: 'Post 1' }, professor);
      await new Promise(resolve => setTimeout(resolve, 10)); // Pequeno delay
      const post2 = await createTestPost({ title: 'Post 2' }, professor);
      await new Promise(resolve => setTimeout(resolve, 10));
      const post3 = await createTestPost({ title: 'Post 3' }, professor);

      const response = await request(app)
        .get('/posts')
        .set('Authorization', `Bearer ${professorToken}`);

      expect(response.status).toBe(200);
      expect(response.body[0].title).toBe('Post 3'); // Mais recente primeiro
      expect(response.body[2].title).toBe('Post 1'); // Mais antigo por último
    });
  });

  describe('GET /posts/:id', () => {
    it('should return a specific post', async () => {
      const post = await createTestPost({
        title: 'Specific Post',
        content: 'Specific Content'
      }, professor);

      const response = await request(app)
        .get(`/posts/${post.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(post.id);
      expect(response.body.title).toBe(post.title);
      expect(response.body.content).toBe(post.content);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await request(app)
        .get('/posts/99999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Post não encontrado.');
    });
  });

  describe('GET /posts/author/:authorId', () => {
    it('should return posts by specific author', async () => {
      // Criar posts de diferentes autores
      await createTestPost({ title: 'Professor Post 1' }, professor);
      await createTestPost({ title: 'Professor Post 2' }, professor);
      await createTestPost({ title: 'Aluno Post' }, aluno);

      const response = await request(app)
        .get(`/posts/author/${professor.id}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body.every(post => post.authorId === professor.id)).toBe(true);
    });
  });

  describe('GET /posts/search', () => {
    beforeEach(async () => {
      await createTestPost({
        title: 'JavaScript Tutorial',
        content: 'Learn JavaScript programming',
        available: true
      }, professor);
      
      await createTestPost({
        title: 'Python Guide',
        content: 'Introduction to Python',
        available: true
      }, professor);
      
      await createTestPost({
        title: 'Java Basics',
        content: 'Getting started with Java programming',
        available: true
      }, professor);
    });

    it('should search posts by title', async () => {
      const response = await request(app)
        .get('/posts/search?q=JavaScript');

      expect(response.status).toBe(200);
      expect(response.body.results.length).toBe(1);
      expect(response.body.results[0].title).toContain('JavaScript');
      expect(response.body.count).toBe(1);
      expect(response.body.searchTerm).toBe('JavaScript');
    });

    it('should search posts by content', async () => {
      const response = await request(app)
        .get('/posts/search?q=programming');

      expect(response.status).toBe(200);
      expect(response.body.results.length).toBe(2);
      expect(response.body.count).toBe(2);
    });

    it('should return 400 when search term is missing', async () => {
      const response = await request(app)
        .get('/posts/search');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Termo de busca é obrigatório');
    });

    it('should return 404 when no posts match the search', async () => {
      const response = await request(app)
        .get('/posts/search?q=nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Nenhum post encontrado com o termo especificado');
    });
  });

  describe('PUT /posts/:id', () => {
    it('should allow professor to update their own post', async () => {
      const post = await createTestPost({
        title: 'Original Title',
        content: 'Original Content'
      }, professor);

      const updateData = {
        title: 'Updated Title',
        content: 'Updated Content'
      };

      const response = await request(app)
        .put(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${professorToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Post atualizado com sucesso.');

      // Verificar se foi atualizado no banco
      const updatedPost = await Post.findByPk(post.id);
      expect(updatedPost.title).toBe(updateData.title);
      expect(updatedPost.content).toBe(updateData.content);
    });

    it('should not allow aluno to update post', async () => {
      const post = await createTestPost({ title: 'Post' }, professor);

      const response = await request(app)
        .put(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${alunoToken}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Apenas professores podem editar posts.');
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should allow professor to delete post', async () => {
      const post = await createTestPost({ title: 'To Delete' }, professor);

      const response = await request(app)
        .delete(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${professorToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Post excluído com sucesso.');

      // Verificar se foi deletado do banco
      const deletedPost = await Post.findByPk(post.id);
      expect(deletedPost).toBeNull();
    });

    it('should not allow aluno to delete post', async () => {
      const post = await createTestPost({ title: 'Post' }, professor);

      const response = await request(app)
        .delete(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${alunoToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Apenas professores podem excluir posts.');
    });
  });
});
