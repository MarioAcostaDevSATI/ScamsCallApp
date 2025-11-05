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

// Agregar esta ruta para registro público
router.post('/register', async (req, res) => {
  try {
    const { email, password, userType, fullName } = req.body;
    
    // Validar tipo de usuario
    const allowedTypes = ['citizen', 'agent'];
    if (!allowedTypes.includes(userType)) {
      return res.status(400).json({ 
        error: 'Tipo de usuario inválido' 
      });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'El usuario ya existe' 
      });
    }
    
    // Crear nuevo usuario
    const newUser = new User({
      email,
      password: await bcrypt.hash(password, 10),
      role: userType,
      fullName,
      isActive: true
    });
    
    await newUser.save();
    
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      user: { id: newUser._id, email: newUser.email, role: newUser.role }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

