const Customers = require('../models/customer');
const Order = require('../models/orders');
const OrderDetail = require('../models/orderdetails');
const Payments = require('../models/payments');
const Employees = require('../models/employee');
const Office = require('../models/office');
const fs = require('fs');
const PDFDocument = require('pdfkit');


async function getInvoice(req, res) {
  const orderNumber = req.params.orderNumber;

  try {
    const orderDetails = await Order.findOne({
      where: { orderNumber: orderNumber },
      include: [
        {
          model: OrderDetail,
          attributes: ['productCode', 'quantityOrdered', 'priceEach', 'orderLineNumber'],
        },
        {
          model: Customers,
          attributes: ['customerNumber', 'customerName', 'contactFirstName', 'contactLastName', 'creditLimit'],
          include: [
            {
              model: Employees,
              attributes: ['employeeNumber', 'firstName', 'lastName', 'jobTitle'],
              include: [
                {
                  model: Office,
                  attributes: ['officeCode', 'city', 'phone', 'addressLine1', 'addressLine2', 'state', 'country', 'postalCode', 'territory'],
                },
              ],
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



    // Create a PDF document
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${orderNumber}.pdf`);
    // Pipe the PDF content directly to the response stream
    doc.pipe(res);
    // Add content to the PDF
    
    const imagePath = 'img/logo.png'; 
    doc.image(imagePath, { width: 120, align: 'center' });
    doc.fontSize(20).text(`Invoice for Order ${orderNumber}`, { align: 'center' });
    let yPos = 150;
    // Column 1: Customer Details
    doc.font('Helvetica-Bold').fontSize(8).text(`Customer Number: ${orderDetails.Customer.customerNumber}`, 20, yPos);
    doc.text(`First Name: ${orderDetails.Customer.contactFirstName}`, 20, yPos + 20);
    doc.text(`Last Name: ${orderDetails.Customer.contactLastName}`, 20, yPos + 40);
    doc.text(`Credit Limit: ${orderDetails.Customer.creditLimit}`, 20, yPos + 60);

    // Column 2: Order Details
    let yPosOrderDetails = yPos;
    doc.font('Helvetica-Bold').fontSize(8).text(`Order Number: ${orderDetails.orderNumber}`, 200, yPosOrderDetails);
    doc.text(`Order Date: ${orderDetails.orderDate}`, 200, yPosOrderDetails + 20);
    doc.text(`Order Shipping Date: ${orderDetails.shippedDate}`, 200, yPosOrderDetails + 40);

    // Column 3: Employee Details (Assuming you have employee details in your orderDetails)
    let yPosEmployeeDetails = yPos;
    doc.font('Helvetica-Bold').fontSize(8).text(`Employee Number: ${orderDetails.Customer.Employee.employeeNumber}`, 350, yPosEmployeeDetails);
    doc.text(`Employee First Name: ${orderDetails.Customer.Employee.firstName}`, 350, yPosEmployeeDetails + 20);
    doc.text(`Employee Last Name: ${orderDetails.Customer.Employee.lastName}`, 350, yPosEmployeeDetails + 40);
    doc.text(`Employee Job Title: ${orderDetails.Customer.Employee.jobTitle}`, 350, yPosEmployeeDetails + 60);
    doc.text(`EmployeeOffice: ${orderDetails.Customer.Employee.Office.city}`, 350, yPosEmployeeDetails + 80);


    let yPosTable = 280; // Adjust the starting y-coordinate for the table as needed
    // Table Header
    doc.font('Helvetica-Bold').fontSize(12).text('Product Code', 50, yPosTable - 20);
    doc.text('Quantity', 150, yPosTable - 20);
    doc.text('Price', 250, yPosTable - 20);
    doc.text('T-Price', 300, yPosTable - 20);
    doc.text('  Line Number', 350, yPosTable - 20);

    
    yPosTable += -5;

    // Table Rows
    orderDetails.OrderDetails.forEach(orderDetail => {
      doc.fontSize(12).text(orderDetail.productCode, 50, yPosTable);
      doc.text(orderDetail.quantityOrdered.toString(), 150, yPosTable);
      doc.text(`${orderDetail.priceEach}`, 250, yPosTable); //  space between table headings and columns


      // Calculate and display total price
      const totalPrice = orderDetail.quantityOrdered * parseFloat(orderDetail.priceEach.replace('$', ''));
      doc.text(` ${totalPrice.toFixed(2)}`, 300, yPosTable);

      doc.text(orderDetail.orderLineNumber.toString(), 400, yPosTable);

      yPosTable += 20;
    });

    // Calculate and display the total amount
    const totalAmount = orderDetails.OrderDetails.reduce((sum, orderDetail) => {
      const totalPrice = orderDetail.quantityOrdered * parseFloat(orderDetail.priceEach.replace('$', ''));
      return sum + totalPrice;
    }, 0);

    doc.font('Helvetica-Bold').fontSize(12).text('Total Amount:', 250, yPosTable + 20);
    doc.text(`RS-${totalAmount.toFixed(2)}`, 350, yPosTable + 20);
    doc.font('Helvetica-Bold').fontSize(12).text('Payment Date:', 250, yPosTable + 40);
    doc.text(` ${orderDetails.Payment.paymentDate}`, 350, yPosTable + 40);

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getInvoice }