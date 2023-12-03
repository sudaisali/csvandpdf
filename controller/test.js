const Customers = require('../models/customer'); 
const Order = require('../models/orders'); 
const Product = require('../models/product');
const OrderDetail = require('../models/orderdetails');
const Payments = require('../models/payments');
const ProductLine = require('../models/productline');
const Employees = require('../models/employee');
const Office = require('../models/office');



async function getInvoice(req, res) {
  const orderNumber = req.params.orderNumber;

  try {
    const orderDetails = await Order.findOne({
      where: { orderNumber: orderNumber },
      include: [
        {
          model: OrderDetail,
          attributes: ['productCode', 'quantityOrdered', 'priceEach' , 'orderLineNumber'],
        },
        {
          model: Customers,
          attributes: ['customerNumber', 'customerName', 'contactFirstName', 'contactLastName', 'creditlimit'],
          include: [
            {
              model: Employees, // Assuming you have an Employees model
              attributes: ['employeeNumber', 'firstName', 'lastName', 'jobTitle'],
            },
          ],
        },
        {
          model: Payments,
          attributes: ['checkNumber', 'paymentDate', 'amount'],
        },
      ],
    });

    if (!orderDetails) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(orderDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {getInvoice}



doc.fontSize(18).text(`Invoice for Order ${orderNumber}`, { align: 'center' });

// Add order details to the PDF
doc.moveDown();
doc.fontSize(14).text('Order Details:', { underline: true });
doc.moveDown();

orderDetails.OrderDetails.forEach((orderDetail, index) => {
  doc.fontSize(12).text(`Product Code: ${orderDetail.productCode}`);
  doc.text(`Quantity Ordered: ${orderDetail.quantityOrdered}`);
  doc.text(`Price Each: $${orderDetail.priceEach.toFixed(2)}`);
  doc.text(`Order Line Number: ${orderDetail.orderLineNumber}`);
  doc.moveDown();
  
  // Add additional formatting or information as needed
});