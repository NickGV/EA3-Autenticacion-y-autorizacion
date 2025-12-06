const { Funcionario, GrupoFamiliar, Estudio } = require('../models');

/**
 * Obtener todos los funcionarios
 * GET /api/funcionarios
 */
const obtenerTodos = async (req, res) => {
  try {
    const funcionarios = await Funcionario.findAll({
      include: [
        { model: GrupoFamiliar, as: 'familiares' },
        { model: Estudio, as: 'estudios' }
      ]
    });

    res.json({
      total: funcionarios.length,
      funcionarios
    });
  } catch (error) {
    console.error('Error al obtener funcionarios:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al obtener funcionarios'
    });
  }
};

/**
 * Obtener funcionario por ID
 * GET /api/funcionarios/:id
 */
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const funcionario = await Funcionario.findByPk(id, {
      include: [
        { model: GrupoFamiliar, as: 'familiares' },
        { model: Estudio, as: 'estudios' }
      ]
    });

    if (!funcionario) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Funcionario no encontrado'
      });
    }

    res.json({ funcionario });
  } catch (error) {
    console.error('Error al obtener funcionario:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al obtener funcionario'
    });
  }
};

/**
 * Crear nuevo funcionario
 * POST /api/funcionarios
 */
const crear = async (req, res) => {
  try {
    const {
      tipo_identificacion,
      numero_identificacion,
      nombres,
      apellidos,
      estado_civil,
      sexo,
      direccion,
      telefono,
      fecha_nacimiento
    } = req.body;

    // Validar campos requeridos
    if (!tipo_identificacion || !numero_identificacion || !nombres || !apellidos || !sexo) {
      return res.status(400).json({
        error: 'Datos incompletos',
        mensaje: 'Tipo de identificación, número, nombres, apellidos y sexo son requeridos'
      });
    }

    // Verificar si el número de identificación ya existe
    const funcionarioExistente = await Funcionario.findOne({
      where: { numero_identificacion }
    });

    if (funcionarioExistente) {
      return res.status(400).json({
        error: 'Identificación duplicada',
        mensaje: 'El número de identificación ya está registrado'
      });
    }

    const nuevoFuncionario = await Funcionario.create({
      tipo_identificacion,
      numero_identificacion,
      nombres,
      apellidos,
      estado_civil,
      sexo,
      direccion,
      telefono,
      fecha_nacimiento
    });

    res.status(201).json({
      mensaje: 'Funcionario creado exitosamente',
      funcionario: nuevoFuncionario
    });

  } catch (error) {
    console.error('Error al crear funcionario:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        mensaje: error.errors.map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al crear funcionario'
    });
  }
};

/**
 * Actualizar funcionario
 * PUT /api/funcionarios/:id
 */
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizacion = req.body;

    const funcionario = await Funcionario.findByPk(id);

    if (!funcionario) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Funcionario no encontrado'
      });
    }

    // Verificar si el nuevo número de identificación ya existe
    if (datosActualizacion.numero_identificacion && 
        datosActualizacion.numero_identificacion !== funcionario.numero_identificacion) {
      const identificacionExistente = await Funcionario.findOne({
        where: { numero_identificacion: datosActualizacion.numero_identificacion }
      });

      if (identificacionExistente) {
        return res.status(400).json({
          error: 'Identificación duplicada',
          mensaje: 'El número de identificación ya está registrado por otro funcionario'
        });
      }
    }

    await funcionario.update(datosActualizacion);

    res.json({
      mensaje: 'Funcionario actualizado exitosamente',
      funcionario
    });

  } catch (error) {
    console.error('Error al actualizar funcionario:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        mensaje: error.errors.map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al actualizar funcionario'
    });
  }
};

/**
 * Eliminar funcionario
 * DELETE /api/funcionarios/:id
 */
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const funcionario = await Funcionario.findByPk(id);

    if (!funcionario) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Funcionario no encontrado'
      });
    }

    await funcionario.destroy();

    res.json({
      mensaje: 'Funcionario eliminado exitosamente (incluye familiares y estudios por CASCADE)'
    });

  } catch (error) {
    console.error('Error al eliminar funcionario:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al eliminar funcionario'
    });
  }
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar
};

