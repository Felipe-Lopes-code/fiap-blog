const bcrypt = require('bcrypt');
const User = require('../model/user-model');

// GET - Todos os Users disponíveis ordenados pela data de criação (desc)
const getUsers = async () => {
  return await User.findAll({ order: [['createdAt', 'DESC']] });
};

// PUT - Atualização de um User existente
const updateUser = async (data, userId) => {
  let updateData = { ...data };
  
  // Se uma nova senha foi fornecida, faz o hash dela
  if (data.password) {
    const saltRounds = 10;
    updateData.password = await bcrypt.hash(data.password, saltRounds);
  }

  return await User.update(updateData, {
    where: { id: userId }
  });
};

// User - Criação de novos Users
const createUser = async (data) => {
  try {
    // Validação dos campos obrigatórios
    if (!data.name || !data.email || !data.password || !data.role) {
      throw new Error('Campos obrigatórios: name, email, password e role');
    }

    // Hash da senha antes de salvar
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    
    // Criar o usuário com a senha hash
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role
    });

    // Retornar o usuário criado sem a senha
    const { password, ...userWithoutPassword } = user.get();
    return userWithoutPassword;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Email já cadastrado');
    }
    throw error;
  }
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
