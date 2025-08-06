const Post = require('../model/post-model');
const { Op } = require("sequelize");


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
  return await Post.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${searchTerm}%` } },
        { content: { [Op.iLike]: `%${searchTerm}%` } }
      ]
    }
  });
};

// POST - Criação de novos posts
const createPost = async (data) => {
  return await Post.create(data);
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