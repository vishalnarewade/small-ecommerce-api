const { bulkUpload, upload } = require('../config/upload');

const uploadProductImage = upload.single('images');
const uploadBulkExcel = bulkUpload.single('file');

module.exports = {
    uploadProductImage,
    uploadBulkExcel
};
