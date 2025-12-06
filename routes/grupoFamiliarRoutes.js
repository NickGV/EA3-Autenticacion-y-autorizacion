const express = require('express');
const router = express.Router();
const grupoFamiliarController = require('../controllers/grupoFamiliarController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

/**
 * @route   PUT /api/familiares/:id
 * @desc    Actualizar familiar
 * @access  ADMIN, GESTOR
 */
router.put('/:id', 
  roleMiddleware('admin', 'gestor'), 
  grupoFamiliarController.actualizar
);

/**
 * @route   DELETE /api/familiares/:id
 * @desc    Eliminar familiar
 * @access  Solo ADMIN
 */
router.delete('/:id', 
  roleMiddleware('admin'), 
  grupoFamiliarController.eliminar
);

module.exports = router;

