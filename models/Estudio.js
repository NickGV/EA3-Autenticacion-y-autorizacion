const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Estudio = sequelize.define('Estudio', {
  id_estudio: {
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
  universidad: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La universidad es requerida'
      }
    }
  },
  nivel_estudio: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nivel de estudio es requerido'
      },
      isIn: {
        args: [['Técnico', 'Tecnológico', 'Pregrado', 'Especialización', 'Maestría', 'Doctorado']],
        msg: 'Nivel de estudio inválido'
      }
    }
  },
  titulo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El título es requerido'
      }
    }
  }
}, {
  tableName: 'estudio',
  timestamps: false
});

module.exports = Estudio;


