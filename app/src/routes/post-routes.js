const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controllers');
const { authenticate } = require('../middlewares/authMiddleware')

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API para gerenciamento de posts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - authorId
 *       properties:
 *         title:
 *           type: string
 *           description: Título do post
 *         content:
 *           type: string
 *           description: Conteúdo do post
 *         author:
 *           type: string
 *           description: Nome do autor
 *         authorId:
 *           type: integer
 *           description: ID do autor
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lista todos os posts disponíveis
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de posts ordenados por data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: Não autorizado
 *   post:
 *     summary: Cria um novo post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post criado com sucesso
 *       401:
 *         description: Não autorizado
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Obtém um post específico
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do post
 *     responses:
 *       200:
 *         description: Detalhes do post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post não encontrado
 *   put:
 *     summary: Atualiza um post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post atualizado com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Post não encontrado
 *   delete:
 *     summary: Remove um post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do post
 *     responses:
 *       200:
 *         description: Post removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Post não encontrado
 */

/**
 * @swagger
 * /posts/author/{authorId}:
 *   get:
 *     summary: Lista posts de um autor específico
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: authorId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do autor
 *     responses:
 *       200:
 *         description: Lista de posts do autor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: Autor não encontrado
 */

/**
 * @swagger
 * /posts/search:
 *   get:
 *     summary: Pesquisa posts por título ou conteúdo
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Termo de pesquisa (mínimo 2 caracteres)
 *     responses:
 *       200:
 *         description: Resultados da pesquisa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 count:
 *                   type: integer
 *                   description: Número de resultados encontrados
 *                 searchTerm:
 *                   type: string
 *                   description: Termo usado na busca
 *       400:
 *         description: Termo de busca não fornecido ou inválido
 *       404:
 *         description: Nenhum resultado encontrado
 *       500:
 *         description: Erro interno do servidor
 */


// GET - Todos os posts disponíveis ordenados pela data de criação (desc)
router.get('/', authenticate, postController.getAvailablePosts);

// GET - Pesquisa (ex: //search?q=termo)
router.get('/search', postController.getSearchPost);

// GET - Posts por authorId (query param ou rota separada, ex: //author/:authorId)
router.get('/author/:authorId', postController.getPostsByAuthorId);

// GET - Post por ID (deve ser a última rota com parâmetro)
router.get('/:id', postController.getPostById);

// POST - Criar novo post
router.post('/', authenticate, postController.createPost);

// PUT - Atualizar post
router.put('/:id', authenticate, postController.updatePost);

// DELETE - Remover post
router.delete('/:id', authenticate, postController.deletePost);

module.exports = router;