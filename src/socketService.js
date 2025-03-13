// socketService.js
import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

import { config } from './config';

const SERVER_URL = config.socketUrl;

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.locationWatchId = null;
    this.deviceStatusInterval = null;
  }

  // Connect to the Socket.IO server
  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    // Initialize connection with auth token
    this.socket = io(SERVER_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    // Set up event listeners
    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      this.connected = true;
      
      // Start sending location and device updates
      this.startLocationUpdates();
      this.startDeviceStatusUpdates();
    });

    this.socket.on('connect_error', (error) => {
      console.warn('Socket connection error:', error.message);
      this.connected = false;
      // Attempt to reconnect with exponential backoff
      setTimeout(() => {
        if (!this.connected) {
          this.connect(token);
        }
      }, Math.min(1000 * Math.pow(2, this.socket.reconnectionAttempts), 10000));
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server:', reason);
      this.connected = false;
      this.stopLocationUpdates();
      this.stopDeviceStatusUpdates();
    });

    return this.socket;
  }

  // Disconnect from the Socket.IO server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.stopLocationUpdates();
      this.stopDeviceStatusUpdates();
    }
  }

  // Start sending location updates
  startLocationUpdates() {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      return;
    }

    // Get current position immediately
    navigator.geolocation.getCurrentPosition(
      this.handlePositionUpdate.bind(this),
      (error) => console.error('Error getting location:', error),
      { enableHighAccuracy: true }
    );

    // Set up continuous location tracking
    this.locationWatchId = navigator.geolocation.watchPosition(
      this.handlePositionUpdate.bind(this),
      (error) => console.error('Error watching location:', error),
      { 
        enableHighAccuracy: true, 
        maximumAge: 10000, 
        timeout: 5000 
      }
    );
  }

  // Handle position updates
  handlePositionUpdate(position) {
    if (!this.connected || !this.socket) return;

    this.socket.emit('updateLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date()
    });
  }

  // Stop location tracking
  stopLocationUpdates() {
    if (this.locationWatchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.locationWatchId);
      this.locationWatchId = null;
    }
  }

  // Start sending device status updates
  startDeviceStatusUpdates() {
    // Initial update
    this.updateDeviceStatus();
    
    // Schedule periodic updates
    this.deviceStatusInterval = setInterval(() => {
      this.updateDeviceStatus();
    }, 60000); // Every minute
  }

  // Update device status (battery, signal, etc.)
  async updateDeviceStatus() {
    if (!this.connected || !this.socket) return;

    try {
      // Get battery info if available
      let batteryLevel = 100;
      if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        batteryLevel = Math.round(battery.level * 100);
      }

      // Estimate network info
      // Note: navigator.connection is not available in all browsers
      let signalStrength = 100;
      if (navigator.connection) {
        const connection = navigator.connection;
        // Rough estimate based on connection type
        if (connection.type === 'cellular') {
          if (connection.effectiveType === '4g') signalStrength = 80;
          else if (connection.effectiveType === '3g') signalStrength = 60;
          else if (connection.effectiveType === '2g') signalStrength = 40;
          else signalStrength = 20;
        }
      }

      this.socket.emit('updateDeviceStatus', {
        batteryLevel,
        signalStrength,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error updating device status:', error);
    }
  }

  // Stop device status updates
  stopDeviceStatusUpdates() {
    if (this.deviceStatusInterval) {
      clearInterval(this.deviceStatusInterval);
      this.deviceStatusInterval = null;
    }
  }

  // Send delivery status update
  updateDeliveryStatus(deliveryId, status, notes = '') {
    if (!this.connected || !this.socket) {
      console.error('Cannot update delivery status: Socket not connected');
      return false;
    }

    this.socket.emit('updateDeliveryStatus', {
      deliveryId,
      status,
      notes
    });
    
    return true;
  }

  // Send message to another user
  sendMessage(recipientId, content) {
    if (!this.connected || !this.socket) {
      console.error('Cannot send message: Socket not connected');
      return false;
    }

    this.socket.emit('sendMessage', {
      recipientId,
      content
    });
    
    return true;
  }
}

// Singleton instance
const socketService = new SocketService();
export default socketService;

// React hook for using socket in components
export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = socketService.socket;
    
    if (!socket) return;

    // Update connection status
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    
    // Handle incoming messages
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };
    
    // Handle delivery status updates (as notifications)
    const handleDeliveryUpdate = (update) => {
      setNotifications((prev) => [...prev, { 
        type: 'delivery', 
        data: update, 
        timestamp: new Date() 
      }]);
    };

    // Subscribe to events
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('newMessage', handleNewMessage);
    socket.on('deliveryStatusUpdated', handleDeliveryUpdate);
    
    // Set initial status
    setIsConnected(socket.connected);

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('newMessage', handleNewMessage);
      socket.off('deliveryStatusUpdated', handleDeliveryUpdate);
    };
  }, [socketService.socket]);

  return {
    isConnected,
    messages,
    notifications,
    clearMessages: () => setMessages([]),
    clearNotifications: () => setNotifications([])
  };
}