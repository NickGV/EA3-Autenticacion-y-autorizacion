const { GrupoFamiliar, Funcionario } = require('../models');

/**
 * Obtener todos los familiares de un funcionario
 * GET /api/funcionarios/:id_funcionario/familiares
 */
const obtenerPorFuncionario = async (req, res) => {
  try {
    const { id_funcionario } = req.params;

    const familiares = await GrupoFamiliar.findAll({
      where: { id_funcionario }
    });

    res.json({
      total: familiares.length,
      familiares
    });
  } catch (error) {
    console.error('Error al obtener familiares:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al obtener familiares'
    });
  }
};

/**
 * Crear familiar
 * POST /api/funcionarios/:id_funcionario/familiares
 */
const crear = async (req, res) => {
  try {
    const { id_funcionario } = req.params;
    const { nombre, parentesco, edad, telefono } = req.body;

    // Verificar que el funcionario existe
    const funcionario = await Funcionario.findByPk(id_funcionario);
    if (!funcionario) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Funcionario no encontrado'
      });
    }

    // Validar campos requeridos
    if (!nombre || !parentesco) {
      return res.status(400).json({
        error: 'Datos incompletos',
        mensaje: 'Nombre y parentesco son requeridos'
      });
    }

    const nuevoFamiliar = await GrupoFamiliar.create({
      id_funcionario,
      nombre,
      parentesco,
      edad,
      telefono
    });

    res.status(201).json({
      mensaje: 'Familiar agregado exitosamente',
      familiar: nuevoFamiliar
    });

  } catch (error) {
    console.error('Error al crear familiar:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        mensaje: error.errors.map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al crear familiar'
    });
  }
};

/**
 * Actualizar familiar
 * PUT /api/familiares/:id
 */
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizacion = req.body;

    const familiar = await GrupoFamiliar.findByPk(id);

    if (!familiar) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Familiar no encontrado'
      });
    }

    await familiar.update(datosActualizacion);

    res.json({
      mensaje: 'Familiar actualizado exitosamente',
      familiar
    });

  } catch (error) {
    console.error('Error al actualizar familiar:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        mensaje: error.errors.map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al actualizar familiar'
    });
  }
};

/**
 * Eliminar familiar
 * DELETE /api/familiares/:id
 */
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const familiar = await GrupoFamiliar.findByPk(id);

    if (!familiar) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Familiar no encontrado'
      });
    }

    await familiar.destroy();

    res.json({
      mensaje: 'Familiar eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar familiar:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al eliminar familiar'
    });
  }
};

module.exports = {
  obtenerPorFuncionario,
  crear,
  actualizar,
  eliminar
};

