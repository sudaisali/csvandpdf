const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database'); 
const Office = require('../models/office')
const Employee = sequelize.define('Employee', {
  employeeNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  extension: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  officeCode: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'Office',
      key: 'officeCode'
    }
  },
  reportsTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Employee',
      key: 'employeeNumber'
    }
  },
  jobTitle: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'employees',
  timestamps: false 
});


// Employee.hasMany(Employee, {
//   foreignKey: 'reportsTo',
//   as: 'subordinates'
// });

// Employee.belongsTo(Employee, {
//   foreignKey: 'reportsTo',
//   as: 'supervisor'
// });

Employee.belongsTo(Office, {
  foreignKey: 'officeCode',
});

module.exports = Employee;
