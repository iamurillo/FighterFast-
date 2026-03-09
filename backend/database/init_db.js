const { Client, Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createDatabaseIfNotExists() {
    // Connect to default 'postgres' database to check/create the target database
    const defaultClient = new Client({
        connectionString: 'postgres://postgres:postgres@localhost:5432/postgres'
    });

    try {
        await defaultClient.connect();
        const res = await defaultClient.query("SELECT datname FROM pg_database WHERE datname = 'fighterfast'");
        if (res.rowCount === 0) {
            console.log("Database 'fighterfast' not found. Creating it...");
            await defaultClient.query('CREATE DATABASE fighterfast');
            console.log("Database 'fighterfast' created.");
        } else {
            console.log("Database 'fighterfast' already exists.");
        }
    } catch (error) {
        console.error("Error creating database (it might already exist or you need different credentials):", error.message);
    } finally {
        await defaultClient.end();
    }
}

async function initDB() {
    console.log("Starting database initialization...");
    console.log("Target Database URL:", process.env.DATABASE_URL);

    await createDatabaseIfNotExists();

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log("Executing schema...");
        await pool.query(schema);

        console.log("Schema created successfully! ✅");
    } catch (err) {
        console.error("Error executing schema:", err.message);
    } finally {
        await pool.end();
    }
}

initDB();
