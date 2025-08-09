const userService = require('../services/user-services');

// GET /users - Lista todos os usuários ordenados por data de criação
const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// POST /users - Cria um novo usuário
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validação básica
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        error: 'Campos obrigatórios: name, email, password e role' 
      });
    }

    const newUser = await userService.createUser({ name, email, password, role });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    if (error.message === 'Email já cadastrado') {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    res.status(400).json({ error: error.message || 'Erro ao criar usuário' });
  }
};

// PUT /users/:id - Atualiza um usuário existente
const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    await userService.updateUser(data, id);
    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar usuário' });
  }
};

// DELETE /users/:id - Exclui um usuário
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await userService.deleteUser(id);
    res.status(200).json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao excluir usuário' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};

