const postService = require('../../../services/post-services');

jest.mock('../../../model/user-model', () => {
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user'
  };

  return {
    findByPk: jest.fn().mockResolvedValue(mockUser)
  };
});

jest.mock('../../../model/post-model', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post',
    content: 'Test Content',
    authorId: 1
  };

  return {
    findAll: jest.fn().mockResolvedValue([mockPost]),
    findOne: jest.fn().mockResolvedValue(mockPost),
    findByPk: jest.fn().mockResolvedValue(mockPost),
    create: jest.fn().mockResolvedValue(mockPost)
  };
});

const Post = require('../../../model/post-model');

describe('Post Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSearchPost', () => {
    it('should return posts that match the search term', async () => {
      const mockPosts = [
        { id: 1, title: 'Test Post', content: 'Test Content' }
      ];
      
      Post.findAll.mockResolvedValue(mockPosts);
      
      const result = await postService.getSearchPost('test');
      expect(result).toEqual(mockPosts);
    });
  });

  describe('createPost', () => {
    it('should create a post with valid data', async () => {
      const postData = {
        title: 'Test Post',
        content: 'Test Content',
        authorId: 1
      };

      const mockPost = { ...postData, id: 1 };
      Post.create.mockResolvedValue(mockPost);

      const result = await postService.createPost(postData);
      expect(result).toEqual(mockPost);
    });

    it('should throw error if required fields are missing', async () => {
      const postData = {
        title: 'Test Post'
      };

      await expect(postService.createPost(postData))
        .rejects
        .toThrow('Título e conteúdo são obrigatórios');
    });
  });
});
