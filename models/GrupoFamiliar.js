const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GrupoFamiliar = sequelize.define('GrupoFamiliar', {
  id_familiar: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_funcionario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'funcionario',
      key: 'id_funcionario'
    }
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre es requerido'
      }
    }
  },
  parentesco: {
    type: DataTypes.STRING(30),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El parentesco es requerido'
      }
    }
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'La edad debe ser mayor o igual a 0'
      },
      max: {
        args: [120],
        msg: 'La edad debe ser menor a 120'
      }
    }
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  }
}, {
  tableName: 'grupo_familiar',
  timestamps: false
});

module.exports = GrupoFamiliar;

