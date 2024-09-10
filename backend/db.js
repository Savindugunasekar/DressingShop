const { Pool } = require('pg');

const db = new Pool({
    user: 'savinduadmin',           // Your Azure PostgreSQL username
    password: '#Azure1234', // Your Azure PostgreSQL password
    host: 'savindudb.postgres.database.azure.com', // Your Azure PostgreSQL server address
    port: 5432,                     // Default port for PostgreSQL
    database: 'ecomtest',        // Your database name
    ssl: {
        rejectUnauthorized: false   // This ensures SSL is used (recommended for Azure)
    }
});

module.exports = db;
