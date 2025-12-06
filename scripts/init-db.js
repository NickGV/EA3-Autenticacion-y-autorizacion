/**
 * Script para inicializar la base de datos
 * Ejecutar con: npm run init-db
 */

require('dotenv').config();
const { sequelize, Usuario, Funcionario, GrupoFamiliar, Estudio } = require('../models');

const initDatabase = async () => {
  try {
    console.log('Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente.');

    console.log('Sincronizando modelos...');
    // force: true elimina y recrea las tablas (usar con cuidado)
    // alter: true actualiza las tablas sin eliminar datos
    // Si las tablas ya existen, usar alter: true para no perder datos
    await sequelize.sync({ alter: true });
    console.log('Modelos sincronizados correctamente.');
    console.log('Tablas: usuarios, funcionario, grupo_familiar, estudio');

    // Verificar si ya existe un usuario admin
    const adminExistente = await Usuario.findOne({ 
      where: { rol: 'admin' } 
    });

    if (!adminExistente) {
      console.log('Creando usuario administrador por defecto...');
      
      const admin = await Usuario.create({
        nombre: 'Administrador',
        correo: 'admin@sistema.com',
        password: 'admin123',
        rol: 'admin'
      });

      console.log('Usuario administrador creado:');
      console.log('  - Correo: admin@sistema.com');
      console.log('  - Contraseña: admin123');
      console.log('  - Rol: admin');
      console.log('\n¡IMPORTANTE! Cambia la contraseña del administrador después del primer login.');
    } else {
      console.log('Ya existe un usuario administrador en el sistema.');
    }

    // Verificar datos de ejemplo en funcionarios
    const totalFuncionarios = await Funcionario.count();
    console.log(`\n✓ Funcionarios en la base de datos: ${totalFuncionarios}`);
    
    if (totalFuncionarios === 0) {
      console.log('Nota: No hay funcionarios. Usa las inserciones del script SQL original o la API para agregar.');
    }

    console.log('\n¡Base de datos inicializada correctamente!');
    console.log('\n=== Credenciales de acceso ===');
    console.log('Admin: admin@sistema.com / admin123');
    process.exit(0);

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
};

initDatabase();


