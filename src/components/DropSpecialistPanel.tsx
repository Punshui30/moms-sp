import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { io } from 'socket.io-client';
import Web3 from 'web3';
import { Truck, User, MessageSquare, Plus, MapPin, CheckCircle2, AlertTriangle, Battery, Signal } from 'lucide-react';
import { useDeliveryStore } from '../store/deliveryStore';
import { faker } from '@faker-js/faker';
import { config } from '../config';

const MAPBOX_TOKEN = config.mapboxToken;

interface DriverMetrics {
  batteryLevel: number;
  signalStrength: number;
  lastUpdate: Date;
}

const DriverCard = ({ driver, isSelected, onClick, metrics }) => (
  <motion.div
    key={driver.id}
    className={`glass-panel p-4 cursor-pointer transition-all ${
      isSelected ? 'border-neon-purple' : ''
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <User className="w-10 h-10 text-neon-cyan p-2 bg-neon-cyan bg-opacity-10 rounded-full" />
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
            driver.status === 'available' ? 'bg-neon-green' :
            driver.status === 'delivering' ? 'bg-neon-purple' :
            'bg-gray-500'
          }`} />
        </div>
        <div>
          <h3 className="font-cyber text-lg">{driver.name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <select
              value={driver.status}
              onChange={(e) => updateDriverStatus(driver.id, e.target.value as any)}
              className="cyber-button text-sm bg-transparent border-none focus:ring-0 py-1 px-2"
            >
              <option value="available">Available</option>
              <option value="delivering">Delivering</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-2">
          <Battery className={`w-4 h-4 ${
            metrics?.batteryLevel < 20 ? 'text-red-500' : 'text-neon-green'
          }`} />
          <span className="text-xs">{metrics?.batteryLevel || 100}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <Signal className={`w-4 h-4 ${
            metrics?.signalStrength < 50 ? 'text-red-500' : 'text-neon-cyan'
          }`} />
          <span className="text-xs">{metrics?.signalStrength || 100}%</span>
        </div>
      </div>
    </div>
    
    {driver.currentOrder && (
      <div className="mt-3 p-2 glass-panel bg-opacity-50">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-neon-purple">Order #{driver.currentOrder}</span>
          <span className="text-xs text-gray-400">
            ETA: {faker.date.soon().toLocaleTimeString()}
          </span>
        </div>
      </div>
    )}
  </motion.div>
);

function LocationUpdater({ driverId }: { driverId: string }) {
  const { updateDriverLocation } = useDeliveryStore();
  const map = useMap();
  const [metrics, setMetrics] = useState<DriverMetrics>({
    batteryLevel: 100,
    signalStrength: 100,
    lastUpdate: new Date()
  });

  useEffect(() => {
    const socket = io(`${config.socketUrl}/drivers`, {
      query: { driverId }
    });

    socket.on('location_update', (data) => {
      updateDriverLocation(driverId, data.location);
      setMetrics({
        batteryLevel: data.batteryLevel,
        signalStrength: data.signalStrength,
        lastUpdate: new Date()
      });
    });

    // Temporary simulation for development
    const simulateUpdates = setInterval(() => {
      const bounds = map.getBounds();
      socket.emit('location_update', {
        location: {
          lat: bounds.getSouth() + Math.random() * (bounds.getNorth() - bounds.getSouth()),
          lng: bounds.getWest() + Math.random() * (bounds.getEast() - bounds.getWest())
        },
        batteryLevel: Math.max(0, metrics.batteryLevel - Math.random() * 5),
        signalStrength: Math.max(0, 70 + Math.random() * 30)
      });
    }, 5000);

    return () => {
      clearInterval(simulateUpdates);
      socket.disconnect();
    };
  }, [driverId, map, updateDriverLocation]);

  return (
    <div className="absolute bottom-2 right-2 glass-panel p-2 z-[1000] flex items-center space-x-2">
      <Battery className={`w-4 h-4 ${metrics.batteryLevel < 20 ? 'text-red-500' : 'text-neon-green'}`} />
      <span className="text-xs">{Math.round(metrics.batteryLevel)}%</span>
      <Signal className={`w-4 h-4 ${metrics.signalStrength < 50 ? 'text-red-500' : 'text-neon-cyan'}`} />
      <span className="text-xs">{Math.round(metrics.signalStrength)}%</span>
    </div>
  );
}

const DropSpecialistPanel: React.FC = () => {
  const { drivers, activeDeliveries, addDriver, updateDriverStatus, updateDeliveryStatus } = useDeliveryStore();
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<Record<string, string>>({});
  const [newDriverName, setNewDriverName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; text: string; sender: string; timestamp: Date }>>([]);

  useEffect(() => {
    // Monitor blockchain transactions for active deliveries
    const monitorPayments = async () => {
      if (!window.ethereum) {
        console.warn('MetaMask not detected');
        return;
      }
      
      const web3 = new Web3(window.ethereum);
      
      activeDeliveries.forEach(delivery => {
        const subscription = web3.eth.subscribe('pendingTransactions')
          .on('data', async (txHash) => {
            const tx = await web3.eth.getTransaction(txHash);
            if (tx && tx.to && tx.to.toLowerCase() === delivery.paymentAddress?.toLowerCase()) {
              setPaymentStatus(prev => ({
                ...prev,
                [delivery.orderId]: 'Payment Confirmed'
              }));
            }
          });
          
        return () => subscription.unsubscribe();
      });
    };

    monitorPayments();
  }, [activeDeliveries]);

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim()) return;

    addDriver({
      name: newDriverName,
      status: 'available',
      currentLocation: { lat: 51.505, lng: -0.09 }
    });
    setNewDriverName('');
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedDriver) return;

    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      text: message,
      sender: 'Admin',
      timestamp: new Date()
    }]);
    setMessage('');

    // Simulate driver response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        text: 'Message received, on my way!',
        sender: drivers.find(d => d.id === selectedDriver)?.name || 'Driver',
        timestamp: new Date()
      }]);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Truck className="w-8 h-8 text-neon-cyan" />
            <h2 className="text-3xl font-cyber neon-text">Drop Specialists</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-4 py-2 glass-panel">
              <span className="text-neon-green font-mono">
                {drivers.filter(d => d.status === 'available').length} Available
              </span>
            </div>
            <div className="px-4 py-2 glass-panel">
              <span className="text-neon-purple font-mono">
                {activeDeliveries.length} Active Deliveries
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          {/* Driver List */}
          <div className="col-span-1 space-y-4">
            {/* Add Driver Form */}
            <form onSubmit={handleAddDriver} className="glass-panel p-4 border border-neon-cyan border-opacity-20">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  placeholder="New driver name"
                  className="cyber-button flex-1 bg-black bg-opacity-50 placeholder-gray-500"
                />
                <button type="submit" className="cyber-button bg-neon-purple bg-opacity-20">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>

            {drivers.map(driver => (
              <DriverCard
                key={driver.id}
                driver={driver}
                isSelected={selectedDriver === driver.id}
                onClick={() => setSelectedDriver(driver.id)}
                metrics={{
                  batteryLevel: Math.round(70 + Math.random() * 30),
                  signalStrength: Math.round(80 + Math.random() * 20)
                }}
              />
            ))}
          </div>

          {/* Map View */}
          <div className="glass-panel p-4 h-[600px] col-span-3 relative z-10 border border-neon-purple border-opacity-20">
            <MapContainer
              center={[51.505, -0.09]}
              zoom={13}
              className="h-full rounded-lg relative overflow-hidden"
              style={{ background: '#0a0a0a' }}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {drivers.map((driver) => (
                driver.currentLocation && (
                  <React.Fragment key={driver.id}>
                    <LocationUpdater driverId={driver.id} />
                    <Marker position={[driver.currentLocation.lat, driver.currentLocation.lng]}>
                      <Popup className="glass-panel">
                        <div className="text-black">
                          <h3 className="font-bold">{driver.name}</h3>
                          <p className="text-sm">Status: {driver.status}</p>
                          {driver.currentOrder && (
                            <>
                              <p className="text-sm mt-1">
                                Current Order: #{driver.currentOrder}
                              </p>
                              <p className="text-sm mt-1">
                                Est. Delivery: {faker.date.soon().toLocaleTimeString()}
                              </p>
                            </>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                )
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="glass-panel p-6 max-h-[300px] overflow-y-auto border border-neon-purple border-opacity-20">
        <h2 className="text-xl mb-4 text-neon-purple">Active Deliveries</h2>
        <div className="space-y-4">
          {activeDeliveries.map((delivery) => {
            const driver = drivers.find(d => d.id === delivery.driverId);
            return (
              <div key={delivery.orderId} className="glass-panel p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-cyber">Order #{delivery.orderId}</h3>
                    <p className="text-sm text-gray-400">
                      Driver: {driver?.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={delivery.status}
                      onChange={(e) => {
                        updateDeliveryStatus(delivery.orderId, e.target.value as any);
                        if (e.target.value === 'completed') {
                          setPaymentStatus(prev => ({
                            ...prev,
                            [delivery.orderId]: 'Payment Verified'
                          }));
                        }
                      }}
                      className="cyber-button bg-black bg-opacity-50"
                    >
                      <option value="assigned">Assigned</option>
                      <option value="picked_up">Picked Up</option>
                      <option value="delivering">Delivering</option>
                      <option value="completed">Completed</option>
                    </select>
                    {delivery.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-neon-green" />
                    ) : delivery.status === 'assigned' ? (
                      <AlertTriangle className="w-5 h-5 text-neon-purple" />
                    ) : (
                      <Truck className="w-5 h-5 text-neon-cyan animate-pulse" />
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-neon-cyan">Status: {delivery.status}</p>
                  {paymentStatus[delivery.orderId] && (
                    <p className="text-neon-green">
                      {paymentStatus[delivery.orderId]}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Communication Panel */}
      <div className="glass-panel p-6 max-h-[400px] relative z-0 border border-neon-purple border-opacity-20">
        <h2 className="text-xl mb-4 text-neon-green flex items-center">
          <MessageSquare className="w-6 h-6 mr-2" />
          Communications
        </h2>
        <div className="space-y-4">
          <div className="glass-panel p-4 h-[300px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 flex ${msg.sender === 'Admin' ? 'justify-end' : 'justify-start'}`}
                style={{ opacity: msg.timestamp > new Date(Date.now() - 60000) ? 1 : 0.7 }}
              >
                <div className={`glass-panel p-3 max-w-[70%] ${
                  msg.sender === 'Admin' ? 'bg-neon-purple' : 'bg-neon-cyan'
                } bg-opacity-20`}>
                  <p className="text-sm font-bold mb-1">{msg.sender}</p>
                  <p>{msg.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              className="cyber-button flex-1"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              className="cyber-button bg-neon-purple bg-opacity-20 hover:bg-opacity-30"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DropSpecialistPanel