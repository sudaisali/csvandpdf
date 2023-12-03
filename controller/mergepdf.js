const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

async function mergeFile(req, res){
    try {
      console.log('Request received'); 
      if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded.'); 
        return res.status(400).send('No files were uploaded.');
      }
      const pdfFiles = req.files.pdfs;
      console.log('PDF Files:', pdfFiles); 
      const outputPath = path.join(__dirname, '..', 'merged.pdf');
      console.log('Output Path:', outputPath); 
      await mergePDFs(pdfFiles, outputPath);
      res.status(200).send(`Merged PDF saved to ${outputPath}`);
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send(`Error: ${error.message}`);
    }
}

async function mergePDFs(pdfFiles, outputPath) {
  try {
    const mergedPdf = await PDFDocument.create();
   console.log(mergedPdf)
    for (const pdfFile of pdfFiles) {
      const pdfDoc = await PDFDocument.load(pdfFile.data);
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }
    const mergedPdfBytes = await mergedPdf.save();
    await fs.writeFile(outputPath, mergedPdfBytes);
  } catch (error) {
    throw new Error(`Error merging PDFs: ${error.message}`);
  }
}

module.exports = {
    mergeFile,
};
