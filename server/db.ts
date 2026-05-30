import Database from 'better-sqlite3'

// This opens (or creates if missing) a file called addresses.db
// in your project folder. THIS is your database.
const db = new Database('addresses.db')

// Create the table if it doesn't exist yet.
// Runs every startup, but the "IF NOT EXISTS" makes it safe.
db.exec(`
  CREATE TABLE IF NOT EXISTS addresses (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    country    TEXT NOT NULL,
    fields     TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`)

export default db