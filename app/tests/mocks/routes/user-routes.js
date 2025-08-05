const express = require('express');
const router = express.Router();
const { login } = require('../../src/middlewares/authMiddleware');

router.post('/login', login);

module.exports = router;
