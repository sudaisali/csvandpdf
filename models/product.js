const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database'); 
const  ProductLine = require('../models/productline')
const OrderDetail = require('../models/orderdetails')

const Product = sequelize.define('Product', {
  productCode: {
    type: DataTypes.STRING(15),
    primaryKey: true,
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING(70),
    allowNull: false
  },
  productLine: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: 'ProductLine',
      key: 'productLine'
    }
  },
  productScale: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  productVendor: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  productDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  quantityInStock: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  buyPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  MSRP: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'products',
  timestamps: false 
});


Product.belongsTo(ProductLine, {
  foreignKey: 'productLine',
  as: 'productLineInfo'
});

Product.hasMany(OrderDetail, {
  foreignKey: 'productCode',
  as: 'orderDetails'
});


module.exports = Product;
