const Usuario = require('../models/Usuario');

/**
 * Registrar nuevo usuario
 * POST /api/usuarios/register
 */
const registrar = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    // Validar campos requeridos
    if (!nombre || !correo || !password) {
      return res.status(400).json({
        error: 'Datos incompletos',
        mensaje: 'Nombre, correo y contraseña son requeridos'
      });
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).json({
        error: 'Correo duplicado',
        mensaje: 'El correo ya está registrado'
      });
    }

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      password,
      rol: rol || 'user'
    });

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario.toJSON()
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        mensaje: error.errors.map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al registrar usuario'
    });
  }
};

/**
 * Obtener todos los usuarios
 * GET /api/usuarios
 */
const obtenerTodos = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] }
    });

    res.json({
      total: usuarios.length,
      usuarios
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al obtener usuarios'
    });
  }
};

/**
 * Obtener usuario por ID
 * GET /api/usuarios/:id
 */
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({ usuario });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al obtener usuario'
    });
  }
};

/**
 * Actualizar usuario
 * PUT /api/usuarios/:id
 */
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, password, rol } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Usuario no encontrado'
      });
    }

    // Verificar si el nuevo correo ya existe (si se está actualizando)
    if (correo && correo !== usuario.correo) {
      const correoExistente = await Usuario.findOne({ where: { correo } });
      if (correoExistente) {
        return res.status(400).json({
          error: 'Correo duplicado',
          mensaje: 'El correo ya está registrado por otro usuario'
        });
      }
    }

    // Actualizar campos
    await usuario.update({
      nombre: nombre || usuario.nombre,
      correo: correo || usuario.correo,
      password: password || usuario.password,
      rol: rol || usuario.rol
    });

    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: usuario.toJSON()
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        mensaje: error.errors.map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al actualizar usuario'
    });
  }
};

/**
 * Eliminar usuario
 * DELETE /api/usuarios/:id
 */
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Usuario no encontrado'
      });
    }

    // Evitar que un admin se elimine a sí mismo
    if (req.usuario.id === parseInt(id)) {
      return res.status(400).json({
        error: 'Operación no permitida',
        mensaje: 'No puedes eliminarte a ti mismo'
      });
    }

    await usuario.destroy();

    res.json({
      mensaje: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al eliminar usuario'
    });
  }
};

module.exports = {
  registrar,
  obtenerTodos,
  obtenerPorId,
  actualizar,
  eliminar
};


