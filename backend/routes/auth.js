const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Iniciar sesión
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/profile
// @desc    Obtener perfil de usuario
// @access  Private
router.get('/profile', authenticateToken, authController.getProfile);

// @route   GET /api/auth/verify
// @desc    Verificar token
// @access  Private
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token válido',
    data: {
      user: req.user
    }
  });
});

module.exports = router;
