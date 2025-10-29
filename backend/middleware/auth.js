const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Middleware de autenticación JWT
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Verificar que el usuario aún existe
    const result = await query('SELECT id, email, full_name FROM users WHERE id = $1', [decoded.id]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido - usuario no existe'
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('❌ Error en autenticación:', error);
    return res.status(403).json({
      success: false,
      message: 'Token expirado o inválido'
    });
  }
};

// Middleware de autenticación opcional (para rutas públicas)
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const result = await query('SELECT id, email, full_name FROM users WHERE id = $1', [decoded.id]);
      
      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    } catch (error) {
      // Si el token es inválido, continuamos sin usuario
      console.log('Token opcional inválido, continuando sin autenticación');
    }
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};
