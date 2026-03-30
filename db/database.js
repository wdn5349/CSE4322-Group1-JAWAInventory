/*
 * Creates and manages the connection to the SQLite database.
 * On startup, it reads the schema.sql file and executes it to ensure all tables are created.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// The .db file will be created here if it doesn't exist yet
const DB_PATH = path.join(__dirname, "inventory.db");

// The schema file that defines all the tables
const SCHEMA_PATH = path.join(__dirname, "schema.sql");

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }
  console.log("Connected to SQLite database at", DB_PATH);
});

// Enable foreign key enforcement
db.run("PRAGMA foreign_keys = ON");

// Read and run the schema file on startup.
const schema = fs.readFileSync(SCHEMA_PATH, "utf8");
db.exec(schema, (err) => {
  if (err) {
    console.error("Failed to initialise schema:", err.message);
    process.exit(1);
  }
  console.log("Database schema ready.");
});

module.exports = db;
