const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db')

const Product = sequelize.define(
    "Product",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true
        },
        unique_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        images: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        body: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        },
    },
    {
        tableName: 'product',
        timestamps: false,
    }
)

module.exports = Product;
