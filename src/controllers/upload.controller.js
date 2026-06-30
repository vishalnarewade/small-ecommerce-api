const fs = require('fs');
const ExcelJS = require('exceljs');
const Product = require('../models/product.model');
const validateExcel = require('../utils/excel-validator');
const processProducts = require('../workers/bulkUpload.worker');

const SAMPLE_HEADERS = [
    { header: 'title', key: 'title', width: 30 },
    { header: 'price', key: 'price', width: 15 },
    { header: 'category', key: 'category_id', width: 40 },
    { header: 'images', key: 'images', width: 50 }
];

const downloadSample = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = SAMPLE_HEADERS;
    worksheet.addRow({
        title: 'Product Name',
        price: '199',
        category_id: 'Category Name',
        images: 'optional-image-url'
    });
    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=\"product-bulk-sample.xlsx\"'
    );

    await workbook.xlsx.write(res);
    res.end();
};

const uploadProducts = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Excel file is required' });
        }

        const result = await validateExcel(req.file.path);

        fs.unlinkSync(req.file.path);

        process.nextTick(async() => {
            try {
                await processProducts(result.validRows);
            } catch (error) {
                console.log(error);
            }
        })

        return res.status(202).json({
            success: true,
            message: "Upload Started",
            totalRecords: result.validRows.length
        });
    } catch (error) {
         if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    downloadSample,
    uploadProducts
};
