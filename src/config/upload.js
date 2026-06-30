const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDirectory = path.join(process.cwd(), 'uploads', 'products');

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extension)
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .toLowerCase();

        cb(null, `${Date.now()}-${baseName}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
        cb(new Error('Only image files are allowed'));
        return;
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const bulkUploadDirectory = path.join(process.cwd(), 'uploads', 'bulk');

fs.mkdirSync(bulkUploadDirectory, { recursive: true });

const bulkStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, bulkUploadDirectory);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname) || '.xlsx';
        const baseName = path.basename(file.originalname, extension)
            .replace(/[^a-zA-Z0-9-_]/g, '-')
            .toLowerCase();

        cb(null, `${Date.now()}-${baseName}${extension}`);
    }
});

const bulkFileFilter = (req, file, cb) => {
    const validMimeTypes = new Set([
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ]);
    const extension = path.extname(file.originalname).toLowerCase();
    const isExcelFile = validMimeTypes.has(file.mimetype) || extension === '.xlsx' || extension === '.xls';

    if (!isExcelFile) {
        cb(new Error('Only Excel files are allowed'));
        return;
    }

    cb(null, true);
};

const bulkUpload = multer({
    storage: bulkStorage,
    fileFilter: bulkFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = {
    upload,
    bulkUpload
};
