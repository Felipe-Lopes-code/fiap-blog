const postService = require('../services/post-services');

// GET /posts - Lista todos os posts ordenados por data de criação
const getAvailablePosts = async (req, res) => {
  try {
    if (req.user.role == "professor") {
      const posts = await postService.getAllPosts();
      res.status(200).json(posts);   
    } else if (req.user.role == "aluno") {
      const posts = await postService.getAvailablePosts();
      res.status(200).json(posts);   
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os posts disponíveis' });
  }
};

// GET /posts/author/:authorId - Lista posts de um autor específico
const getPostsByAuthorId = async (req, res) => {
  const { authorId } = req.params;
  try {
    const posts = await postService.getPostsByAuthorId(authorId);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os posts do autor' });
  }
};

// GET /posts/:id - Buscar um post por ID
const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postService.getPostById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o post' });
  }
};

// GET /posts/search?q=palavra - Buscar por termo no título ou conteúdo
const getSearchPost = async (req, res) => {
  const { q } = req.query;
  try {
    const results = await postService.getSearchPost(q || '');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar postagens' });
  }
};

// POST /posts - Criar um novo post
const createPost = async (req, res) => {
  try {
    if (req.user.role == "professor") {
      const { title, content, author, authorId } = req.body;
      const newPost = await postService.createPost({ title, content, author, authorId });
      res.status(201).json(newPost);
    } else if (req.user.role == "aluno") {
      res.status(401).json({ error: 'Apenas professores podem criar posts' });   
    }
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar o post' });
  }
};

// PUT /posts/:id - Atualizar um post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    if (req.user.role == "professor") {
      await postService.updatePost(data, id);
      res.status(200).json({ message: 'Post atualizado com sucesso' });
    } else if (req.user.role == "aluno") {
      res.status(401).json({ error: 'Apenas professores podem editar posts' });   
    }
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar o post' });
  }
};

// DELETE /posts/:id - Excluir um post
const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role == "professor") {
      await postService.deletePost(id);
      res.status(200).json({ message: 'Post excluído com sucesso' });
    } else if (req.user.role == "aluno") {
      res.status(401).json({ error: 'Apenas professores podem excluir posts' });   
    }
  } catch (error) {
    res.status(400).json({ error: 'Erro ao excluir o post' });
  }
};

module.exports = {
  getAvailablePosts,
  getPostsByAuthorId,
  getPostById,
  getSearchPost,
  createPost,
  updatePost,
  deletePost
}
