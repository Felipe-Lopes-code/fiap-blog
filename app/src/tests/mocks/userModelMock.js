const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashedPassword',
  role: 'user'
};

const findOne = jest.fn();
const findByPk = jest.fn();

module.exports = {
  findOne,
  findByPk,
  mockUser
};
