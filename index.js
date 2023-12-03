const express = require('express')
const {sequelize} = require('./utils/database')
const fetchAndLogProductData = require('./controller/product')
const productrouter = require('./routes/product')
const Orders = require('./models/orders');
const OrderDetails = require('./models/orderdetails');
const Customers = require('./models/customer');
const payments = require('./models/payments');
const fileUpload = require('express-fileupload');




const app = express()
app.use(express.json())
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use('/api/products' , productrouter.router)


sequelize.authenticate()
.then(()=>{
    console.log("Connection Established")
})
.catch((error)=>{
    console.log(error)
})

Orders.hasMany(OrderDetails, {
    foreignKey: 'orderNumber'
  });
OrderDetails.belongsTo(Orders, {
    foreignKey: 'orderNumber'
  });
  Orders.belongsTo(Customers, {
    foreignKey: 'customerNumber',
  });
  Orders.belongsTo(payments, {
    foreignKey: 'customerNumber',
  });

sequelize.sync().then(() => {
    console.log('Database synced successfully');
  }).catch((error) => {
    console.error('Error syncing the database:', error);
  });



app.listen(3000,()=>{
    console.log("Server is starting")
})