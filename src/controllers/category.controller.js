const Category = require("../models/category.model");

const categoryController = {
    addCategory: async(req, res) => {
        try {
            const { title } = req.body
            const category = await Category.create({ title });
            return res.status(201).json(true);
        } catch (error) {
            console.log(error);
            
            return res.status(500).json({ error: error.message });
        }       
    },
    getCategories: async (req, res) => {
        try {
            const category = await Category.findAll({
                attributes: ['id', 'unique_id', 'title'],
                order: [['id', 'DESC']],
                raw: true
            });
            return res.status(200).json(category);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    getCategoryById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const updatedCategory = await Category.findOne({
                where: {
                    unique_id : id,
                },
                attributes: ['id', 'title'],
                raw: true
            });

            return res.status(200).json(updatedCategory);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    updateCategory: async(req, res) => {
        try {            
            const { id } = req.params;
            
            const [updated] = await Category.update({
                title: req.body.title
            }, 
            {
                where: { 
                    unique_id: id,
                }
            });

            if (!updated) {
                return res.status(404).json({
                    message: 'Category not found'
                });
            }

            return res.status(200).json(true);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await Category.destroy({ where : { unique_id: id } });

            if (!deleted) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = categoryController;