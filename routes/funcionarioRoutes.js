const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');
const grupoFamiliarController = require('../controllers/grupoFamiliarController');
const estudioController = require('../controllers/estudioController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// === RUTAS DE FUNCIONARIOS ===

/**
 * @route   GET /api/funcionarios
 * @desc    Obtener todos los funcionarios
 * @access  ADMIN, USER, GESTOR
 */
router.get('/', 
  roleMiddleware('admin', 'user', 'gestor'), 
  funcionarioController.obtenerTodos
);

/**
 * @route   GET /api/funcionarios/:id
 * @desc    Obtener funcionario por ID
 * @access  ADMIN, USER, GESTOR
 */
router.get('/:id', 
  roleMiddleware('admin', 'user', 'gestor'), 
  funcionarioController.obtenerPorId
);

/**
 * @route   POST /api/funcionarios
 * @desc    Crear funcionario
 * @access  ADMIN, GESTOR
 */
router.post('/', 
  roleMiddleware('admin', 'gestor'), 
  funcionarioController.crear
);

/**
 * @route   PUT /api/funcionarios/:id
 * @desc    Actualizar funcionario
 * @access  ADMIN, GESTOR
 */
router.put('/:id', 
  roleMiddleware('admin', 'gestor'), 
  funcionarioController.actualizar
);

/**
 * @route   DELETE /api/funcionarios/:id
 * @desc    Eliminar funcionario
 * @access  Solo ADMIN
 */
router.delete('/:id', 
  roleMiddleware('admin'), 
  funcionarioController.eliminar
);

// === RUTAS DE GRUPO FAMILIAR ===

/**
 * @route   GET /api/funcionarios/:id_funcionario/familiares
 * @desc    Obtener familiares de un funcionario
 * @access  ADMIN, USER, GESTOR
 */
router.get('/:id_funcionario/familiares', 
  roleMiddleware('admin', 'user', 'gestor'), 
  grupoFamiliarController.obtenerPorFuncionario
);

/**
 * @route   POST /api/funcionarios/:id_funcionario/familiares
 * @desc    Agregar familiar a un funcionario
 * @access  ADMIN, GESTOR
 */
router.post('/:id_funcionario/familiares', 
  roleMiddleware('admin', 'gestor'), 
  grupoFamiliarController.crear
);

// === RUTAS DE ESTUDIOS ===

/**
 * @route   GET /api/funcionarios/:id_funcionario/estudios
 * @desc    Obtener estudios de un funcionario
 * @access  ADMIN, USER, GESTOR
 */
router.get('/:id_funcionario/estudios', 
  roleMiddleware('admin', 'user', 'gestor'), 
  estudioController.obtenerPorFuncionario
);

/**
 * @route   POST /api/funcionarios/:id_funcionario/estudios
 * @desc    Agregar estudio a un funcionario
 * @access  ADMIN, GESTOR
 */
router.post('/:id_funcionario/estudios', 
  roleMiddleware('admin', 'gestor'), 
  estudioController.crear
);

module.exports = router;

