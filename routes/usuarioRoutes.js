const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @route   POST /api/usuarios/register
 * @desc    Registrar nuevo usuario
 * @access  Privado - Solo ADMIN
 */
router.post('/register', 
  authMiddleware, 
  roleMiddleware('admin'), 
  usuarioController.registrar
);

/**
 * @route   GET /api/usuarios
 * @desc    Obtener todos los usuarios
 * @access  Privado - ADMIN y USER
 */
router.get('/', 
  authMiddleware, 
  roleMiddleware('admin', 'user', 'gestor'), 
  usuarioController.obtenerTodos
);

/**
 * @route   GET /api/usuarios/:id
 * @desc    Obtener usuario por ID
 * @access  Privado - ADMIN y USER
 */
router.get('/:id', 
  authMiddleware, 
  roleMiddleware('admin', 'user', 'gestor'), 
  usuarioController.obtenerPorId
);

/**
 * @route   PUT /api/usuarios/:id
 * @desc    Actualizar usuario
 * @access  Privado - Solo ADMIN
 */
router.put('/:id', 
  authMiddleware, 
  roleMiddleware('admin'), 
  usuarioController.actualizar
);

/**
 * @route   DELETE /api/usuarios/:id
 * @desc    Eliminar usuario
 * @access  Privado - Solo ADMIN
 */
router.delete('/:id', 
  authMiddleware, 
  roleMiddleware('admin'), 
  usuarioController.eliminar
);

module.exports = router;


