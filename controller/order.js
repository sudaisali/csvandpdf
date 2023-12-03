const { Op } = require('sequelize');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 
const Order = require('../models/orders');
const {DownloadQueue} = require('../utils/worker')



async function getOrders(req, res) {
  try {
    const { startDate, endDate } = req.body;
    
    console.log(startDate)
    console.log(endDate)
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Missing startDate or endDate in the request body' });
    }

    const orders = await Order.findAll({
      where: {
        orderDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    if (orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for the given date range' });
    }

   
    const uploadFolderPath = path.join(__dirname, '..','upload');
    await fs.mkdir(uploadFolderPath, { recursive: true });
    const fileName = `${uuidv4()}.csv`;
    const csvFilePath = path.join(uploadFolderPath, fileName);
    const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: [
        { id: 'orderNumber', title: 'Order Number' },
        { id: 'orderDate', title: 'Order Date' },
        { id: 'requiredDate', title: 'Required Date' },
        { id: 'shippedDate', title: 'Shipped Date' },
        { id: 'status', title: 'Status' },
        { id: 'comments', title: 'Comments' },
        { id: 'customerNumber', title: 'Customer Number' },
      ],
    });
    await csvWriter.writeRecords(orders);
    
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching or downloading orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function downloadSheet(req, res) {
    try {
        const fileName = req.params.id;
        await DownloadQueue.add({ fileName });
        // downloadData(fileName)
        // const uploadFolderPath = path.join(__dirname, '..', 'upload');
        // const folderExists = await fs.access(uploadFolderPath).then(() => true).catch(() => false);

        // if (!folderExists) {
        //     return res.status(404).json({ error: `Folder '${uploadFolderPath}' not found` });
        // }

        // const csvFilePath = path.join(uploadFolderPath, `${fileName}.csv`);
        // const fileExists = await fs.access(csvFilePath).then(() => true).catch(() => false);

        // if (!fileExists) {
        //     return res.status(404).json({ error: `CSV file not found in folder '${uploadFolderPath}'` });
        // }
        // res.setHeader('Content-Type', 'text/csv');
        // res.setHeader('Content-Disposition', `attachment; filename=${fileName}.csv`);
        // res.status(200).sendFile(csvFilePath, {}, async (err) => {
        //     if (err) {
        //         console.error('Error sending file:', err);
        //         res.status(500).json({ error: 'Internal Server Error' });
        //     } else {
        //         try {
        //             await fs.unlink(csvFilePath);
        //             console.log(`File '${csvFilePath}' deleted successfully.`);
        //         } catch (unlinkError) {
        //             console.error('Error deleting file:', unlinkError);
        //             res.status(500).json({ error: 'Internal Server Error' });
        //         }
        //     }
        // });
        res.json({
          message:"File downloaded successfully"
        })
    } catch (error) {
        console.error('Error downloading sheet:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}



module.exports = {getOrders , downloadSheet}