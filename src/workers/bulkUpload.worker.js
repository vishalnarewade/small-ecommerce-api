const { where } = require("sequelize");
const Categories = require("../models/category.model");
const Product = require("../models/product.model");

const BATCH_SIZE = 1000;

const processProducts = async(products) => {
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
        const batch = products.slice(i, i + BATCH_SIZE);
        const finalProduct = [];

        for (const element of batch) {
            let category = await Categories.findOne({
                where: {
                    title: element.category
                },
                attributes: ['unique_id'],
                raw: true
            })

            if (!category) {
                category = await Categories.create({
                    title: element.category
                })
            }            

            finalProduct.push({
                title: element.title,
                price: element.price,
                category_id: category.unique_id,
                images: element.images
            })
        }

        await Product.bulkCreate(finalProduct)
    }
}

module.exports = processProducts;