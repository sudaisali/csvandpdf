const express = require('express')
const router = express.Router()
const fetchAndLogProductData = require('../controller/product')
const {getOrders , downloadSheet} = require('../controller/order')
const {getInvoice} = require('../controller/invoice')
const os = require('os');
const path = require('path');
const {mergeFile} = require('../controller/mergepdf')





router.get('/details',fetchAndLogProductData)
router.get('/order/details',getOrders)
router.get('/order/details/:id',downloadSheet )
router.get('/order/invoice/:orderNumber',getInvoice )
router.post('/mergePdf',mergeFile)

// router.post('/merge-pdfs', async (req, res) => {
//     try {
//       console.log('Request received'); // Add this line for debugging
  
//       if (!req.files || Object.keys(req.files).length === 0) {
//         console.log('No files were uploaded.'); // Add this line for debugging
//         return res.status(400).send('No files were uploaded.');
//       }
  
//       const pdfFiles = req.files.pdfs;
//       console.log('PDF Files:', pdfFiles); // Add this line for debugging
  
//       const outputPath = path.join(__dirname, '..', 'merged.pdf');
//       console.log('Output Path:', outputPath); // Add this line for debugging
  
//       await mergePDFs(pdfFiles, outputPath);
  
//       res.status(200).send(`Merged PDF saved to ${outputPath}`);
//     } catch (error) {
        
//       console.error('Error:', error.message); // Add this line for debugging
//       res.status(500).send(`Error: ${error.message}`);
//     }
//   });
  

module.exports = {router}