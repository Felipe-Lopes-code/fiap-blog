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
const bcrypt = require('bcrypt');

// User - Criação de novos Users
const createUser = async (data) => {
  // Hash da senha antes de salvar
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  
  return await User.create({
    ...data,
    password: hashedPassword
  });
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
