const bcrypt = require('bcrypt');

module.exports = {
    name: '005-seed-default-user',
    up: async ({ queryInterface, sequelize, Sequelize }) => {
        const email = process.env.SEED_USER_EMAIL || 'admin@example.com';
        const password = process.env.SEED_USER_PASSWORD || 'password123';
        const status = process.env.SEED_USER_STATUS || 'active';
        const passwordHash = await bcrypt.hash(password, 10);

        await queryInterface.bulkInsert('users', [
            {
                email,
                password_hash: passwordHash,
                status,
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {
            ignoreDuplicates: true
        });

        if (sequelize.getDialect() === 'postgres') {
            await sequelize.query(
                `INSERT INTO users (email, password_hash, status, created_at, updated_at)
                 VALUES (:email, :passwordHash, :status, NOW(), NOW())
                 ON CONFLICT (email) DO NOTHING;`,
                {
                    replacements: { email, passwordHash, status },
                    type: Sequelize.QueryTypes.INSERT
                }
            );
        }
    }
};
