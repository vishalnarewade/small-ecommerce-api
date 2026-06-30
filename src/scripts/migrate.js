require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/db');

const migrationsDir = path.join(__dirname, '..', 'migrations');

const ensureMigrationsTable = async () => {
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

const getExecutedMigrationNames = async () => {
    const [rows] = await sequelize.query(
        'SELECT name FROM schema_migrations ORDER BY id ASC;'
    );

    return new Set(rows.map((row) => row.name));
};

const getMigrationFiles = () =>
    fs.readdirSync(migrationsDir)
        .filter((file) => file.endsWith('.js'))
        .sort();

const run = async () => {
    try {
        await sequelize.authenticate();
        await ensureMigrationsTable();

        const executed = await getExecutedMigrationNames();
        const queryInterface = sequelize.getQueryInterface();
        const Sequelize = require('sequelize');

        for (const file of getMigrationFiles()) {
            const migration = require(path.join(migrationsDir, file));
            const migrationName = migration.name || file;

            if (executed.has(migrationName)) {
                console.log(`Skipping ${migrationName}`);
                continue;
            }

            console.log(`Running ${migrationName}`);
            await migration.up({ sequelize, queryInterface, Sequelize });
            await sequelize.query(
                'INSERT INTO schema_migrations (name) VALUES (:name);',
                { replacements: { name: migrationName } }
            );
        }

        console.log('Migrations completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed');
        console.error(error);
        process.exit(1);
    }
};

run();
