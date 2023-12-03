const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database');
const Employee = require('./employee') 

const Customer = sequelize.define('Customer', {
  customerNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  customerName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  contactLastName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  contactFirstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  addressLine1: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  addressLine2: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  postalCode: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  salesRepEmployeeNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Employee',
      key: 'employeeNumber'
    }
  },
  creditLimit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'customers',
  timestamps: false 
});


Customer.belongsTo(Employee, {
  foreignKey: 'salesRepEmployeeNumber',
});

module.exports = Customer;
