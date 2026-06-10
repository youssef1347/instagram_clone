const express = require('express');
const { getUserData, test } = require('../controllers/userController');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/me', authMiddleware, getUserData);
router.get('/test', authMiddleware, test);

module.exports = router;