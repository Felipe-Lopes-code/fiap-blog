const jwt = require('jsonwebtoken');
const User = require('../model/user-model');
const bcrypt = require('bcrypt');
require('dotenv').config();

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não está configurado');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    if (err.message === 'JWT_SECRET não está configurado') {
      return res.status(500).json({ error: err.message });
    }
    console.error('Erro de login:', err);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    return res.status(401).json({ error: 'Senha incorreta' });
  }
};


const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token ausente' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ error: 'Usuário inválido' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = {
    authenticate,
    login
}