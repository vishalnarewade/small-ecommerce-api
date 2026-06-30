module.exports = {
    name: '003-create-category-table',
    up: async ({ queryInterface, Sequelize }) => {
        await queryInterface.createTable('category', {
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
