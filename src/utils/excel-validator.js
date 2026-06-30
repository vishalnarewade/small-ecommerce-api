const ExcelJS = require('exceljs');

async function validateExcel(filePath) {

    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(filePath);

    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
        throw new Error('Worksheet not found.');
    }

    const validRows = [];
    const invalidRows = [];

    worksheet.eachRow((row, index) => {
        if (index === 1) return;

        const title = String(row.getCell(1).value || '').trim();
        const price = Number(row.getCell(2).value);
        const category = String(row.getCell(3).value || '').trim();
        const image = String(row.getCell(4).value || '').trim();
        const errors = [];
        
        if (!title)
            errors.push('Title is required');
        if (!price || isNaN(price))
            errors.push('Price must be numeric');
        if (price <= 0)
            errors.push('Price must be greater than zero');
        if (!category)
            errors.push('Category is required');
        if (errors.length) {
            invalidRows.push({
                row: index,
                title,
                price,
                category,
                image,
                errors
            });
        } else {
            validRows.push({
                title,
                price,
                category,
                images: image || null
            });
        }
    });
    return {
        total: validRows.length + invalidRows.length,
        validRows,
        invalidRows
    };
}

module.exports = validateExcel;