// schema.js
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'drivers.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Drivers table
  CREATE TABLE IF NOT EXISTS drivers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    status TEXT CHECK(status IN ('available', 'delivering', 'offline')) DEFAULT 'offline',
    last_location TEXT, -- JSON string containing lat/lng
    last_update DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    vehicle_info TEXT, -- JSON string containing vehicle details
    active BOOLEAN DEFAULT true
  );

  -- Driver metrics table
  CREATE TABLE IF NOT EXISTS driver_metrics (
    id TEXT PRIMARY KEY,
    driver_id TEXT NOT NULL,
    battery_level INTEGER,
    signal_strength INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
  );

  -- Deliveries table
  CREATE TABLE IF NOT EXISTS deliveries (
    id TEXT PRIMARY KEY,
    driver_id TEXT,
    order_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('assigned', 'picked_up', 'delivering', 'completed')) DEFAULT 'assigned',
    pickup_location TEXT NOT NULL, -- JSON string
    drop_location TEXT NOT NULL, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
  );
`);

export default db;