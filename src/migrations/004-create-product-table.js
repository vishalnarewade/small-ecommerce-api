module.exports = {
    name: '004-create-product-table',
    up: async ({ queryInterface, Sequelize }) => {
        await queryInterface.createTable('product', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            unique_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                defaultValue: Sequelize.literal('uuid_generate_v4()')
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            price: {
                type: Sequelize.STRING,
                allowNull: false
            },
            category_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'category',
                    key: 'unique_id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },
            images: {
                type: Sequelize.STRING,
                allowNull: true
            },
            body: {
                type: Sequelize.STRING,
                allowNull: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    }
};
