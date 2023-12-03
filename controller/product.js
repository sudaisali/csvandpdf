const Product = require('../models/product'); 
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function fetchAndLogProductData(req,res) {
  try {
    
    const products = await Product.findAll();
    const csvFilePath = 'Products.csv';
    const csvWriter = createCsvWriter({
      path:csvFilePath,
      header:[
        { id: 'productCode', title: 'Product Code' },
        { id: 'productName', title: 'Product Name' },
        { id: 'productLine', title: 'Product Line' },
        { id: 'productScale', title: 'Product Scale' },
        { id: 'productVendor', title: 'Product Vendor' },
        { id: 'productDescription', title: 'Product Description' },
        { id: 'quantityInStock', title: 'Quantity In Stock' },
        { id: 'buyPrice', title: 'Buy Price' },
        { id: 'MSRP', title: 'MSRP' },
      ]
    })



    await csvWriter.writeRecords(products)
    res.json(products);
  } catch (error) {
    console.error('Error fetching product data:', error);
  }
}





module.exports = fetchAndLogProductData
