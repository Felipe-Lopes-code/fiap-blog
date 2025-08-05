const User = require('../model/user-model');

// GET - Todos os Users disponíveis ordenados pela data de criação (desc)
const getUsers = async () => {
  return await User.findAll({ order: [['createdAt', 'DESC']] });
};
// PUT - Atualização de um User existente
const updateUser = async (data, userId) => {
  return await User.update(data, {
    where: { id: userId }
  });
};
// User - Criação de novos Users
const createUser = async (data) => {
  return await User.create(data);
};
// DELETE - Exclusão de User por ID
const deleteUser = async (userId) => {
  return await User.destroy({ where: { id: userId } });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
