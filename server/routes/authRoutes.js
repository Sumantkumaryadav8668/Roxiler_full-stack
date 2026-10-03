const express = require('express');
const router = express.Router();
const { signup, login, logout, changePassword } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/change-password', verifyToken, changePassword);

module.exports = router;
