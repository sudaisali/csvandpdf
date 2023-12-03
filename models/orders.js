const {DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database')

const Orders = sequelize.define('Orders', {
  orderNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  requiredDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  shippedDate: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  status: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  comments: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  customerNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'orders',
  timestamps: false
});

Orders.associate = (models) => {
  Orders.hasMany(models.OrderDetails, {
    foreignKey: 'orderNumber'
  });
  Orders.belongsTo(models.customers, {
    foreignKey: 'customerNumber',
  });
  Orders.belongsTo(models.payment, {
    foreignKey: 'customerNumber',
  });
};


module.exports = Orders;
