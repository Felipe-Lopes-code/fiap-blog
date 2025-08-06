jest.mock('../../src/controllers/post-controllers', () => ({
  getAllPosts: jest.fn().mockImplementation((req, res) => {
    const posts = [
      { id: 1, title: 'Post 1', content: 'Content 1' },
      { id: 2, title: 'Post 2', content: 'Content 2' }
    ];
    res.status(200).json(posts);
  }),

  createPost: jest.fn().mockImplementation((req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    }
    const newPost = { id: 1, title, content };
    res.status(201).json(newPost);
  }),

  getPostById: jest.fn().mockImplementation((req, res) => {
    const post = { id: req.params.id, title: 'Test Post', content: 'Test Content' };
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    res.status(200).json(post);
  }),

  updatePost: jest.fn().mockImplementation((req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    }
    const updatedPost = { id: req.params.id, title, content };
    res.status(200).json(updatedPost);
  }),

  deletePost: jest.fn().mockImplementation((req, res) => {
    res.status(204).send();
  })
}));
