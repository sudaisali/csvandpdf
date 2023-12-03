const Queue = require('bull');
const fs = require('fs').promises;
const path = require('path');

const DownloadQueue = new Queue('downloadJobs');

async function downloadFile(fileName) {
  const uploadFolderPath = path.join(__dirname, '..', 'upload');
  const fileUrl = path.join(uploadFolderPath, `${fileName}.csv`);
  const downloadFolderPath = path.join(require('os').homedir(), 'Downloads');
  const localFilePath = path.join(downloadFolderPath, `${fileName}.csv`);

  console.log(`Downloading file: ${fileUrl}`);
  
  try {
    await fs.access(fileUrl, fs.constants.F_OK);
  } catch (err) {
    console.error(`File ${fileName} does not exist in the upload folder.`);
    return;
  }

  try {
    await fs.copyFile(fileUrl, localFilePath);
    console.log(`File ${fileName} has been successfully downloaded to the download folder.`);

    await fs.unlink(fileUrl);
    console.log('File deleted successfully');
  } catch (err) {
    console.error('Error copying or deleting the file:', err);
  }
}
DownloadQueue.process(async (job) => {
  try {
    await downloadFile(job.data.fileName);
 
  } catch (err) {
    console.error(err);
  
  }
});

DownloadQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});



module.exports = { DownloadQueue };
