const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone_number } = req.body;

    // Verificar si el usuario ya existe
    const userCheck = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      });
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar usuario
    const sql = `
      INSERT INTO users (email, password, full_name, phone_number, auth_provider, personal_data_consent) 
      VALUES ($1, $2, $3, $4, 'local', true) 
      RETURNING id, email, full_name, phone_number, created_at
    `;

    const values = [email, hashedPassword, full_name, phone_number];
    const result = await query(sql, values);
    const user = result.rows[0];

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone_number: user.phone_number
        },
        token
      }
    });

  } catch (error) {
    console.error('❌ Error en register:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone_number: user.phone_number
        },
        token
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener perfil de usuario
exports.getProfile = async (req, res) => {
  try {
    // En producción, req.user vendría del middleware de autenticación
    const userId = req.user?.id || 1; // Temporal para MVP
    
    const result = await query(
      'SELECT id, email, full_name, phone_number, created_at FROM users WHERE id = $1', 
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('❌ Error en getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo perfil',
      error: error.message
    });
  }
};
