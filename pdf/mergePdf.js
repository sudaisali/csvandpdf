const { PDFDocument } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

async function mergePDFs(inputPath1, inputPath2, outputPath) {
  try {
   
    const pdfDoc1 = await PDFDocument.load(await fs.readFile(inputPath1));
    const pdfDoc2 = await PDFDocument.load(await fs.readFile(inputPath2));   //Load documents
    const mergedPdf = await PDFDocument.create();  //create new pdf and merge    
    const pages1 = await mergedPdf.copyPages(pdfDoc1, pdfDoc1.getPageIndices());    //Add pages from first documents
    pages1.forEach((page) => mergedPdf.addPage(page));
    const pages2 = await mergedPdf.copyPages(pdfDoc2, pdfDoc2.getPageIndices());    //Add pages from second document
    pages2.forEach((page) => mergedPdf.addPage(page));
    const mergedPdfBytes = await mergedPdf.save();       //save the merge pdf file
    await fs.writeFile(outputPath, mergedPdfBytes);

    console.log(`Merged PDF saved to ${outputPath}`);
  } catch (error) {
    console.error(`Error merging PDFs: ${error.message}`);
  }
}


const inputPath1 = path.join(__dirname, 'invoice1.pdf');
const inputPath2 = path.join(__dirname, 'invoice2.pdf');
const outputPath = path.join(__dirname, 'merged.pdf');

mergePDFs(inputPath1, inputPath2, outputPath);

