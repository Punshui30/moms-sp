// server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { driverService } from './db/driverService.js';
import { config } from './config.js';

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') : "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const JWT_SECRET = config.jwtSecret;

// Authentication middleware for Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error: Token missing'));
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid token'));
  }
});

// Authentication endpoints
app.post('/api/drivers/auth', express.json(), (req, res) => {
  const { email, password } = req.body;
  const result = driverService.authenticateDriver(email, password);
  
  if (!result) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json(result);
});

app.post('/api/drivers/register', express.json(), (req, res) => {
  try {
    const driverId = driverService.createDriver(req.body);
    res.json({ success: true, driverId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}, User type: ${socket.user.role}`);
  
  // Store driver connection if the user is a driver
  if (socket.user.role === 'driver') {
    driverService.updateStatus(socket.user.id, 'available');
  }

  // Handle driver location updates
  socket.on('updateLocation', (data) => {
    if (socket.user.role !== 'driver') return;
    
    const { latitude, longitude } = data;
    driverService.updateLocation(socket.user.id, { latitude, longitude });
    
    // Notify admin and customers
    io.to('admin').emit('driverLocationUpdated', {
      driverId: socket.user.id,
      location: { latitude, longitude }
    });
    
    // Get active deliveries and notify customers
    const activeDeliveries = driverService.getDriverDeliveries(socket.user.id);
    activeDeliveries.forEach(delivery => {
      io.to(`customer-${delivery.order_id}`).emit('deliveryLocationUpdated', {
        deliveryId: delivery.id,
        location: { latitude, longitude }
      });
    });
  });

  // Handle driver device status (battery, signal)
  socket.on('updateDeviceStatus', (data) => {
    if (socket.user.role !== 'driver') return;
    
    driverService.recordMetrics(socket.user.id, data);
    
    // Notify admin about low battery or poor signal
    if (data.batteryLevel < 20 || data.signalStrength < 25) {
      io.to('admin').emit('driverDeviceAlert', {
        driverId: socket.user.id,
        ...data
      });
    }
  });

  // Handle delivery status updates
  socket.on('updateDeliveryStatus', (data) => {
    if (socket.user.role !== 'driver') return;
    
    const { deliveryId, status, notes } = data;
    
    driverService.updateDeliveryStatus(deliveryId, status);
    
    // Notify the customer and admin
    const delivery = driverService.getDeliveryDetails(deliveryId);
    io.to(`customer-${delivery.customerId}`).emit('deliveryStatusUpdated', {
      deliveryId,
      status,
      timestamp: new Date()
    });
    
    io.to(`admin`).emit('deliveryStatusUpdated', {
      deliveryId,
      driverId: socket.user.id,
      status,
      notes,
      timestamp: new Date()
    });
  });

  // Handle messaging
  socket.on('sendMessage', (data) => {
    const { recipientId, content } = data;
    const message = {
      senderId: socket.user.id,
      senderType: socket.user.role,
      recipientId,
      content,
      timestamp: new Date()
    };
    
    // Save message to database
    saveMessage(message);
    
    // Determine appropriate room for recipient
    const recipientRoom = socket.user.role === 'driver' 
      ? (recipientId === 'admin' ? 'admin' : `customer-${recipientId}`)
      : `driver-${recipientId}`;
    
    // Send to recipient
    io.to(recipientRoom).emit('newMessage', message);
  });

  // Join appropriate rooms based on user role
  if (socket.user.role === 'admin') {
    socket.join('admin');
  } else if (socket.user.role === 'driver') {
    socket.join(`driver-${socket.user.id}`);
  } else if (socket.user.role === 'customer') {
    socket.join(`customer-${socket.user.id}`);
  }

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    if (socket.user.role === 'driver') {
      driverService.updateStatus(socket.user.id, 'offline');
      
      // Let admin know driver has gone offline
      io.to('admin').emit('driverStatusChanged', {
        driverId: socket.user.id,
        status: 'offline'
      });
    }
  });
});

// These are placeholder functions that you would implement with your database
function findActiveDeliveriesForDriver(driverId) {
  // Query your database to get active deliveries for this driver
  return []; 
}

function updateDeliveryStatus(deliveryId, status, notes) {
  // Update delivery status in your database
  console.log(`Updating delivery ${deliveryId} to status: ${status}, notes: ${notes}`);
}

function getDeliveryDetails(deliveryId) {
  // Get delivery details from your database
  return { customerId: 'customer-id' };
}

function saveMessage(message) {
  // Save message to your database
  console.log(`Saving message: ${JSON.stringify(message)}`);
}

// Basic route for health check
app.get('/', (req, res) => {
  res.send('Socket.IO server is running');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});