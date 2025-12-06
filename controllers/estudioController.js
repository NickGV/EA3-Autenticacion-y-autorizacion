const { Estudio, Funcionario } = require('../models');

/**
 * Obtener todos los estudios de un funcionario
 * GET /api/funcionarios/:id_funcionario/estudios
 */
const obtenerPorFuncionario = async (req, res) => {
  try {
    const { id_funcionario } = req.params;

    const estudios = await Estudio.findAll({
      where: { id_funcionario }
    });

    res.json({
      total: estudios.length,
      estudios
    });
  } catch (error) {
    console.error('Error al obtener estudios:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al obtener estudios'
    });
  }
};

/**
 * Crear estudio
 * POST /api/funcionarios/:id_funcionario/estudios
 */
const crear = async (req, res) => {
  try {
    const { id_funcionario } = req.params;
    const { universidad, nivel_estudio, titulo } = req.body;

    // Verificar que el funcionario existe
    const funcionario = await Funcionario.findByPk(id_funcionario);
    if (!funcionario) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Funcionario no encontrado'
      });
    }

    // Validar campos requeridos
    if (!universidad || !nivel_estudio || !titulo) {
      return res.status(400).json({
        error: 'Datos incompletos',
        mensaje: 'Universidad, nivel de estudio y título son requeridos'
      });
    }

    const nuevoEstudio = await Estudio.create({
      id_funcionario,
      universidad,
      nivel_estudio,
      titulo
    });

    res.status(201).json({
      mensaje: 'Estudio agregado exitosamente',
      estudio: nuevoEstudio
    });

  } catch (error) {
    console.error('Error al crear estudio:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        mensaje: error.errors.map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al crear estudio'
    });
  }
};

/**
 * Actualizar estudio
 * PUT /api/estudios/:id
 */
const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizacion = req.body;

    const estudio = await Estudio.findByPk(id);

    if (!estudio) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Estudio no encontrado'
      });
    }

    await estudio.update(datosActualizacion);

    res.json({
      mensaje: 'Estudio actualizado exitosamente',
      estudio
    });

  } catch (error) {
    console.error('Error al actualizar estudio:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: 'Error de validación',
        mensaje: error.errors.map(e => e.message).join(', ')
      });
    }

    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al actualizar estudio'
    });
  }
};

/**
 * Eliminar estudio
 * DELETE /api/estudios/:id
 */
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const estudio = await Estudio.findByPk(id);

    if (!estudio) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: 'Estudio no encontrado'
      });
    }

    await estudio.destroy();

    res.json({
      mensaje: 'Estudio eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar estudio:', error);
    res.status(500).json({
      error: 'Error del servidor',
      mensaje: 'Error al eliminar estudio'
    });
  }
};

module.exports = {
  obtenerPorFuncionario,
  crear,
  actualizar,
  eliminar
};


