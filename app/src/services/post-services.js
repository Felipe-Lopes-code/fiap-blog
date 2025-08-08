const Post = require('../model/post-model');
const { Op } = require("sequelize");
const User = require('../model/user-model');


const getAllPosts = async () => {
    return await Post.findAll({
    order: [['createdAt', 'DESC']]
  });
}

// GET - Todos os posts disponíveis ordenados pela data de criação (desc)
const getAvailablePosts = async () => {
  return await Post.findAll({
    where: { available: true },
    order: [['createdAt', 'DESC']]
  });
};

// GET - Posts por ID do autor
const getPostsByAuthorId = async (authorId) => {
  return await Post.findAll({ where: { authorId } });
};

// GET - Post por ID único do post (não do autor)
const getPostById = async (postId) => {
  return await Post.findByPk(postId);
};

// GET - Pesquisa de posts por termo no título ou conteúdo
const getSearchPost = async (searchTerm) => {
  try {
    if (!searchTerm) {
      return await Post.findAll({
        order: [['createdAt', 'DESC']],
        limit: 10
      });
    }

    const searchPattern = `%${searchTerm}%`;
    return await Post.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: searchPattern } },
          { content: { [Op.like]: searchPattern } }
        ],
        available: true // Garante que só retorna posts disponíveis
      },
      order: [['createdAt', 'DESC']]
    });
  } catch (error) {
    console.error('Erro na pesquisa:', error);
    throw new Error('Erro ao realizar a pesquisa: ' + error.message);
  }
};

// POST - Criação de novos posts
const createPost = async (data) => {
  try {
    // Validar campos obrigatórios
    if (!data.title || !data.content) {
      throw new Error('Título e conteúdo são obrigatórios');
    }

    // Validar se o autor existe
    const author = await User.findByPk(data.authorId);
    if (!author) {
      throw new Error('Autor não encontrado');
    }

    // Criar o post
    return await Post.create({
      title: data.title,
      content: data.content,
      author: author.name,
      authorId: author.id,
      available: true // por padrão o post está disponível
    });
  } catch (error) {
    throw new Error(error.message || 'Erro ao criar o post');
  }
};

// PUT - Atualização de um post existente
const updatePost = async (data, postId) => {
  return await Post.update(data, {
    where: { id: postId }
  });
};

// DELETE - Exclusão de post por ID
const deletePost = async (postId) => {
  return await Post.destroy({ where: { id: postId } });
};

module.exports = {
  getAvailablePosts,
  getPostsByAuthorId,
  getPostById,
  getSearchPost,
  createPost,
  updatePost,
  deletePost,
  getAllPosts
};