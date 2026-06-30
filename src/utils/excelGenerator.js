const ExcelJS = require('exceljs');

const generateProductsExcel = async (products, categoryLookup, filters) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
        { header: 'Product ID', key: 'id', width: 14 },
        { header: 'Unique ID', key: 'unique_id', width: 38 },
        { header: 'Title', key: 'title', width: 28 },
        { header: 'Price', key: 'price', width: 14 },
        { header: 'Category', key: 'category', width: 24 },
        { header: 'Image Path', key: 'images', width: 42 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    products.forEach((product) => {
        worksheet.addRow({
            id: product.id,
            unique_id: product.unique_id,
            title: product.title,
            price: product.price,
            category: categoryLookup[product.category_id] || product.category_id,
            images: product.images || ''
        });
    });

    const filtersSheet = workbook.addWorksheet('Filters');
    filtersSheet.columns = [
        { header: 'Filter', key: 'filter', width: 18 },
        { header: 'Value', key: 'value', width: 40 }
    ];
    filtersSheet.getRow(1).font = { bold: true };
    filtersSheet.addRows([
        { filter: 'Search', value: filters.search || 'All' },
        { filter: 'Category', value: filters.category || 'All' },
        { filter: 'Price From', value: filters.priceForm || '0' },
        { filter: 'Price To', value: filters.priceTo || 'Any' },
        { filter: 'Exported Rows', value: String(products.length) }
    ]);

    return workbook.xlsx.writeBuffer();
};

module.exports = generateProductsExcel;
