const { DataTypes } = require('sequelize');
const {sequelize} = require('../utils/database')

const OrderDetails = sequelize.define('OrderDetails', {
  orderNumber: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  productCode: {
    type: DataTypes.STRING(15),
    primaryKey: true,
    allowNull: false
  },
  quantityOrdered: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  priceEach: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  orderLineNumber: {
    type: DataTypes.SMALLINT,
    allowNull: false
  }
}, {
  tableName: 'orderdetails',
  timestamps: false
});

OrderDetails.associate = (models) => {
  OrderDetails.belongsTo(models.Orders, {
    foreignKey: 'orderNumber'
  });
};

module.exports = OrderDetails;
