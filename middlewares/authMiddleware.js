const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

/**
 * Middleware para verificar el token JWT
 * Extrae el token del header Authorization y valida su autenticidad
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Acceso denegado',
        mensaje: 'No se proporcionó token de autenticación'
      });
    }

    // Verificar formato "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Acceso denegado',
        mensaje: 'Formato de token inválido. Use: Bearer <token>'
      });
    }

    const token = parts[1];

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({
        error: 'Acceso denegado',
        mensaje: 'Usuario no encontrado'
      });
    }

    // Agregar usuario al request para uso posterior
    req.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Acceso denegado',
        mensaje: 'El token ha expirado'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Acceso denegado',
        mensaje: 'Token inválido'
      });
    }

    console.error('Error en authMiddleware:', error);
    return res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al verificar autenticación'
    });
  }
};

module.exports = authMiddleware;


