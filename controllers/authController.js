const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

/**
 * Login de usuario
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // Validar campos requeridos
    if (!correo || !password) {
      return res.status(400).json({
        error: 'Datos incompletos',
        mensaje: 'El correo y la contraseña son requeridos'
      });
    }

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        mensaje: 'Correo o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    const passwordValida = await usuario.compararPassword(password);

    if (!passwordValida) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        mensaje: 'Correo o contraseña incorrectos'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Responder con token y datos del usuario
    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al procesar el login'
    });
  }
};

/**
 * Obtener información del usuario autenticado
 * GET /api/auth/me
 */
const me = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      usuario: usuario.toJSON()
    });
  } catch (error) {
    console.error('Error en me:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al obtener información del usuario'
    });
  }
};

module.exports = {
  login,
  me
};


