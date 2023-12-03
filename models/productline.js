const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database');
const {Product} = require("../models/product") 

const ProductLine = sequelize.define('ProductLine', {
  productLine: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false
  },
  textDescription: {
    type: DataTypes.STRING(4000),
    allowNull: true
  },
  htmlDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.BLOB('medium'),
    allowNull: true
  }
}, {
  tableName: 'productlines',
  timestamps: false 
});

// Define associations if needed
// ProductLine.hasMany(Product, {
//   foreignKey: 'productLine',
//   as: 'products'
// });

module.exports = ProductLine;
