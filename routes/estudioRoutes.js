const express = require('express');
const router = express.Router();
const estudioController = require('../controllers/estudioController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @route   PUT /api/estudios/:id
 * @desc    Actualizar estudio
 * @access  ADMIN, GESTOR
 */
router.put('/:id', 
  roleMiddleware('admin', 'gestor'), 
  estudioController.actualizar
);

/**
 * @route   DELETE /api/estudios/:id
 * @desc    Eliminar estudio
 * @access  Solo ADMIN
 */
router.delete('/:id', 
  roleMiddleware('admin'), 
  estudioController.eliminar
);

module.exports = router;


