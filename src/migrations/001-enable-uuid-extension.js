module.exports = {
    name: '001-enable-uuid-extension',
    up: async ({ sequelize }) => {
        await sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    }
};
