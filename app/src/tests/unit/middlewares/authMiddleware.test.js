const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authenticate, login } = require('../../../middlewares/authMiddleware');
const { User } = require('../../../model/user-model');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../../../model/user-model', () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn()
  }
}));

describe('Authentication Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {},
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully log in a user with correct credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
      };

      req.body = {
        email: 'test@example.com',
        password: 'correctPassword',
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('correctPassword', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' });
    });

    it('should return 401 when user is not found', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });

    it('should return 401 when password is incorrect', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      req.body = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Senha incorreta' });
    });
  });

  describe('authenticate', () => {
    it('should authenticate valid token and proceed to next middleware', async () => {
      const mockUser = {
        id: 1,
        role: 'user',
      };

      req.headers.authorization = 'Bearer validToken';
      jwt.verify.mockReturnValue({ id: 1, role: 'user' });
      User.findByPk.mockResolvedValue(mockUser);

      await authenticate(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
      expect(User.findByPk).toHaveBeenCalledWith(1);
      expect(req.user).toBe(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 when token is missing', async () => {
      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Token ausente' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when token is invalid', async () => {
      req.headers.authorization = 'Bearer invalidToken';
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when user is not found', async () => {
      req.headers.authorization = 'Bearer validToken';
      jwt.verify.mockReturnValue({ id: 999 });
      User.findByPk.mockResolvedValue(null);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Usuário inválido' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
