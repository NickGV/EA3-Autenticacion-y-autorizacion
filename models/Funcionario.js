const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Funcionario = sequelize.define('Funcionario', {
  id_funcionario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo_identificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tipo de identificación es requerido'
      },
      isIn: {
        args: [['CC', 'TI', 'CE', 'PA']],
        msg: 'El tipo de identificación debe ser: CC, TI, CE o PA'
      }
    }
  },
  numero_identificacion: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: {
      msg: 'El número de identificación ya está registrado'
    },
    validate: {
      notEmpty: {
        msg: 'El número de identificación es requerido'
      }
    }
  },
  nombres: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Los nombres son requeridos'
      }
    }
  },
  apellidos: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Los apellidos son requeridos'
      }
    }
  },
  estado_civil: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      isIn: {
        args: [['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Libre']],
        msg: 'Estado civil inválido'
      }
    }
  },
  sexo: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    validate: {
      isIn: {
        args: [['M', 'F']],
        msg: 'El sexo debe ser M o F'
      }
    }
  },
  direccion: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  fecha_nacimiento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Debe ser una fecha válida'
      }
    }
  }
}, {
  tableName: 'funcionario',
  timestamps: false
});

module.exports = Funcionario;

