const { sequelize } = require('../config/database');
const Usuario = require('./Usuario');
const Funcionario = require('./Funcionario');
const GrupoFamiliar = require('./GrupoFamiliar');
const Estudio = require('./Estudio');

// Definir relaciones entre modelos
// Un funcionario tiene muchos familiares
Funcionario.hasMany(GrupoFamiliar, {
  foreignKey: 'id_funcionario',
  as: 'familiares',
  onDelete: 'CASCADE'
});
GrupoFamiliar.belongsTo(Funcionario, {
  foreignKey: 'id_funcionario',
  as: 'funcionario'
});

// Un funcionario tiene muchos estudios
Funcionario.hasMany(Estudio, {
  foreignKey: 'id_funcionario',
  as: 'estudios',
  onDelete: 'CASCADE'
});
Estudio.belongsTo(Funcionario, {
  foreignKey: 'id_funcionario',
  as: 'funcionario'
});

module.exports = {
  sequelize,
  Usuario,
  Funcionario,
  GrupoFamiliar,
  Estudio
};


