const { Op, where: sqlWhere, cast, col } = require("sequelize");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const generateProductsExcel = require("../utils/excelGenerator");

if (!Product.associations.reportCategory) {
    Product.belongsTo(Category, {
        foreignKey: 'category_id',
        targetKey: 'unique_id',
        as: 'reportCategory',
        constraints: false
    });
}

const buildReportQuery = (query = {}) => {
    const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
    const size = Math.max(Number.parseInt(query.size, 10) || 10, 1);
    const search = String(query.search || '').trim();
    const sort = String(query.sort || 'id').trim().toLowerCase();
    const order = String(query.order || 'desc').trim().toUpperCase();
    const priceForm = String(query.priceForm || query.priceFrom || '').trim();
    const priceTo = query.priceTo || null;
    const category = String(query.category || '').trim();
    const offset = (page - 1) * size;
    const allowedSortFields = ['id', 'title', 'price'];
    const allowedOrderFields = ['ASC', 'DESC'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'id';
    const sortDirection = allowedOrderFields.includes(order) ? order : 'DESC';
    const where = {};

    if (search) {
        where.title = {
            [Op.iLike]: `%${search}%`
        };
    }

    if (category) {
        where.category_id = category;
    }

    const minPrice = Number(priceForm || 0);
    const maxPrice = priceTo !== null ? Number(priceTo) : null;

    if (maxPrice !== null && Number.isFinite(maxPrice)) {
        where[Op.and] = [
            sqlWhere(cast(col('Product.price'), 'INTEGER'), {
                [Op.between]: [minPrice, maxPrice]
            })
        ];
    }

    const orderClause = sortField === 'price'
        ? [[cast(col('Product.price'), 'INTEGER'), sortDirection]]
        : [[sortField, sortDirection]];

    return {
        page,
        size,
        offset,
        orderClause,
        where,
        filters: {
            search,
            category,
            priceForm: priceForm || '0',
            priceTo
        }
    };
};

const reportController = {
    getProducts: async (req, res) => {
        try {
            const { page, size, offset, orderClause, where } = buildReportQuery(req.query);

            const { count, rows } = await Product.findAndCountAll({
                where,
                attributes: ['id', 'unique_id', 'title', 'price', 'body', 'category_id', 'images'],
                include: [
                    {
                        association: 'reportCategory',
                        attributes: ['title'],
                        required: false
                    }
                ],
                order: orderClause,
                limit: size,
                offset,
                raw: true
            });

            const items = rows.map((row) => ({
                ...row,
                category_id: row['reportCategory.title'] || row.category_id
            }));

            return res.status(200).json({
                items,
                totalCount: count,
                page,
                size,
                totalPages: Math.ceil(count / size)
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    getSummary: async (req, res) => {
        try {
            const counts = await Promise.all([
                Product.count(),
                Category.count(),
                Product.max('price'),
                Product.min('price'),
            ])
            
            return res.status(200).json(counts);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    getExportExcel: async (req, res) => {
        try {
            const { orderClause, where, filters } = buildReportQuery(req.query);
            const [products, categories] = await Promise.all([
                Product.findAll({
                    where,
                    attributes: ['id', 'unique_id', 'title', 'price', 'body', 'category_id', 'images'],
                    order: orderClause,
                    raw: true
                }),
                Category.findAll({
                    attributes: ['unique_id', 'title'],
                    raw: true
                })
            ]);

            const categoryLookup = categories.reduce((lookup, item) => {
                lookup[item.unique_id] = item.title;
                return lookup;
            }, {});

            const workbookBuffer = await generateProductsExcel(products, categoryLookup, filters);

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename="filtered-products-report.xlsx"');
            return res.status(200).send(workbookBuffer);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = reportController;
