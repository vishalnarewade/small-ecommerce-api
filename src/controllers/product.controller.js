const { Op, cast, col } = require('sequelize');
const Product = require("../models/product.model");
const Category = require("../models/category.model");

if (!Product.associations.productCategory) {
    Product.belongsTo(Category, {
        foreignKey: 'category_id',
        targetKey: 'unique_id',
        as: 'productCategory',
        constraints: false
    });
}

const getImagePath = (file, bodyImage) => {
    if (file) {
        return `/uploads/products/${file.filename}`;
    }

    if (typeof bodyImage === 'string' && bodyImage.trim()) {
        return bodyImage.trim();
    }

    return null;
};

const productController = {
    addProduct: async(req, res) => {
        try {
            const {
                title,
                price,
                body,
                category_id,
                images
            } = req.body;
            const imagePath = getImagePath(req.file, images);

            const product = await Product.create({
                title,
                price,
                body,
                category_id,
                images: imagePath
            });

            return res.status(201).json(product);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    getProducts: async (req, res) => {
        try {
            const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
            const size = Math.max(Number.parseInt(req.query.size, 10) || 10, 1);
            const search = String(req.query.search || '').trim();
            const sort = String(req.query.sort || 'id').trim().toLowerCase();
            const order = String(req.query.order || 'desc').trim().toUpperCase();
            const category = String(req.query.category || '').trim();
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

            const orderClause = sortField === 'price'
                ? [[cast(col('Product.price'), 'INTEGER'), sortDirection]]
                : [[sortField, sortDirection]];

            const { count, rows } = await Product.findAndCountAll({
                where,
                attributes: ['id', 'unique_id', 'title', 'price', 'body', 'category_id', 'images'],
                include: [
                    {
                        association: 'productCategory',
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
                category_id: row['productCategory.title'] || row.category_id
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
    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const product = await Product.findOne({
                where: {
                    unique_id : id,
                },
                attributes: ['id', 'unique_id', 'title', 'price', 'body', 'category_id', 'images'],
                raw: true
            });

            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    updateProduct: async(req, res) => {
        try {            
            const { id } = req.params;
            const imagePath = getImagePath(req.file, req.body.images);
            
            const [updated] = await Product.update({
                title: req.body.title,
                price: req.body.price,
                body: req.body.body,
                category_id: req.body.category_id,
                images: imagePath
            }, 
            {
                where: { 
                    unique_id: id,
                }
            });

            if (!updated) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            return res.status(200).json(true);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await Product.destroy({ where : { unique_id: id } });

            if (!deleted) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = productController;
