const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,{
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 10,
            min: 0,
            acquire: 3000,
            idle: 10000,
        }
    }
)

const connectDB = async() => {
    try {
        await sequelize.authenticate();
        console.log("✅ Database Connected Successfully");
    } catch (error) {
         console.error("❌ Database Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = {
    sequelize,
    connectDB
}