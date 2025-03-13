// driverService.js
import db from './schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-dev-secret';

export const driverService = {
  // Create a new driver
  createDriver: (driverData) => {
    const { email, password, name, phone, vehicleInfo } = driverData;
    const passwordHash = bcrypt.hashSync(password, 10);
    const id = randomUUID();

    const stmt = db.prepare(`
      INSERT INTO drivers (id, email, password_hash, name, phone, vehicle_info)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, email, passwordHash, name, phone, JSON.stringify(vehicleInfo));
    return id;
  },

  // Authenticate a driver
  authenticateDriver: (email, password) => {
    const driver = db.prepare('SELECT * FROM drivers WHERE email = ?').get(email);
    
    if (!driver || !bcrypt.compareSync(password, driver.password_hash)) {
      return null;
    }

    const token = jwt.sign(
      { id: driver.id, role: 'driver' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { token, driver: { ...driver, password_hash: undefined } };
  },

  // Update driver status
  updateStatus: (driverId, status) => {
    const stmt = db.prepare(`
      UPDATE drivers 
      SET status = ?, last_update = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(status, driverId);
  },

  // Update driver location
  updateLocation: (driverId, location) => {
    const stmt = db.prepare(`
      UPDATE drivers
      SET last_location = ?, last_update = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(JSON.stringify(location), driverId);
  },

  // Get all active drivers
  getActiveDrivers: () => {
    return db.prepare(`
      SELECT id, name, status, last_location, last_update, vehicle_info
      FROM drivers
      WHERE active = true
      AND status != 'offline'
    `).all();
  },

  // Record driver metrics
  recordMetrics: (driverId, metrics) => {
    const stmt = db.prepare(`
      INSERT INTO driver_metrics (id, driver_id, battery_level, signal_strength)
      VALUES (?, ?, ?, ?)
    `);
    return stmt.run(randomUUID(), driverId, metrics.batteryLevel, metrics.signalStrength);
  },

  // Get driver's recent metrics
  getDriverMetrics: (driverId, limit = 100) => {
    return db.prepare(`
      SELECT battery_level, signal_strength, timestamp
      FROM driver_metrics
      WHERE driver_id = ?
      ORDER BY timestamp DESC
      LIMIT ?
    `).all(driverId, limit);
  },

  // Assign delivery to driver
  assignDelivery: (driverId, orderId, pickupLocation, dropLocation) => {
    const deliveryId = randomUUID();
    const stmt = db.prepare(`
      INSERT INTO deliveries (id, driver_id, order_id, pickup_location, drop_location)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      deliveryId,
      driverId,
      orderId,
      JSON.stringify(pickupLocation),
      JSON.stringify(dropLocation)
    );

    // Update driver status
    this.updateStatus(driverId, 'delivering');
    
    return deliveryId;
  },

  // Update delivery status
  updateDeliveryStatus: (deliveryId, status) => {
    const stmt = db.prepare(`
      UPDATE deliveries
      SET status = ?,
          completed_at = CASE WHEN ? = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
      WHERE id = ?
    `);
    return stmt.run(status, status, deliveryId);
  },

  // Get active deliveries for driver
  getDriverDeliveries: (driverId) => {
    return db.prepare(`
      SELECT *
      FROM deliveries
      WHERE driver_id = ?
      AND status != 'completed'
      ORDER BY created_at DESC
    `).all(driverId);
  }
};

export default driverService;