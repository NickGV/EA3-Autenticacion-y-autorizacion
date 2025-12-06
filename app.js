const express = require('express');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const grupoFamiliarRoutes = require('./routes/grupoFamiliarRoutes');
const estudioRoutes = require('./routes/estudioRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/familiares', grupoFamiliarRoutes);
app.use('/api/estudios', estudioRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Gestión de Talento Humano',
    version: '1.0.0',
    descripcion: 'Sistema con autenticación JWT y autorización por roles',
    endpoints: {
      autenticacion: {
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      usuarios: {
        listar: 'GET /api/usuarios',
        registrar: 'POST /api/usuarios/register'
      },
      funcionarios: {
        listar: 'GET /api/funcionarios',
        crear: 'POST /api/funcionarios',
        obtener: 'GET /api/funcionarios/:id',
        actualizar: 'PUT /api/funcionarios/:id',
        eliminar: 'DELETE /api/funcionarios/:id'
      },
      familiares: {
        listar: 'GET /api/funcionarios/:id/familiares',
        crear: 'POST /api/funcionarios/:id/familiares',
        actualizar: 'PUT /api/familiares/:id',
        eliminar: 'DELETE /api/familiares/:id'
      },
      estudios: {
        listar: 'GET /api/funcionarios/:id/estudios',
        crear: 'POST /api/funcionarios/:id/estudios',
        actualizar: 'PUT /api/estudios/:id',
        eliminar: 'DELETE /api/estudios/:id'
      }
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: err.message
  });
});

// Iniciar servidor
const startServer = async () => {
  await testConnection();
  
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();


