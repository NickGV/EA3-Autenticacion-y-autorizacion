/**
 * Middleware para verificar roles de usuario
 * Debe usarse DESPUÉS del authMiddleware
 * @param  {...string} rolesPermitidos - Roles que tienen acceso al recurso
 * @returns {Function} Middleware de Express
 */
const roleMiddleware = (...rolesPermitidos) => {
  return (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.usuario) {
        return res.status(401).json({
          error: 'Acceso denegado',
          mensaje: 'Usuario no autenticado'
        });
      }

      const { rol } = req.usuario;

      // Verificar si el rol del usuario está en la lista de roles permitidos
      if (!rolesPermitidos.includes(rol)) {
        return res.status(403).json({
          error: 'Acceso prohibido',
          mensaje: `No tienes permisos para acceder a este recurso. Roles permitidos: ${rolesPermitidos.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Error en roleMiddleware:', error);
      return res.status(500).json({
        error: 'Error del servidor',
        mensaje: 'Error al verificar permisos'
      });
    }
  };
};

module.exports = roleMiddleware;


