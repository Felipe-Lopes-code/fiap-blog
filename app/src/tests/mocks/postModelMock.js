// Mock post data
const mockPost = {
  id: 1,
  title: 'Test Post',
  content: 'Test Content',
  authorId: 1
};

// Create mock functions
const findAll = jest.fn().mockResolvedValue([mockPost]);
const findOne = jest.fn().mockResolvedValue(mockPost);
const findByPk = jest.fn().mockResolvedValue(mockPost);
const create = jest.fn().mockResolvedValue(mockPost);
const update = jest.fn().mockResolvedValue([1]);
const destroy = jest.fn().mockResolvedValue(1);

// Export the functions directly since they'll be assigned to the module.exports object
module.exports = {
  findAll,
  findOne,
  findByPk,
  create,
  update,
  destroy
};
