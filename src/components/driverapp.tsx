// DriverApp.jsx
import React, { useEffect, useState } from 'react';
import socketService, { useSocket } from './socketService';

// Mock authentication service
const getAuthToken = () => {
  // In a real app, you would get this from your auth system
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRyaXZlcjEyMyIsInJvbGUiOiJkcml2ZXIiLCJpYXQiOjE2MDU1NTYxMTksImV4cCI6MTYwNjE2MDkxOX0.example-token';
};

const DriverApp = () => {
  const [deliveryId, setDeliveryId] = useState('delivery123');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [recipientId, setRecipientId] = useState('admin');
  const [messageContent, setMessageContent] = useState('');
  
  // Use the socket hook to get connection status and messages
  const { isConnected, messages, notifications } = useSocket();

  // Connect to socket when component mounts
  useEffect(() => {
    const token = getAuthToken();
    socketService.connect(token);
    
    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Handle delivery status update
  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!status || !deliveryId) return;
    
    const success = socketService.updateDeliveryStatus(deliveryId, status, notes);
    if (success) {
      setNotes('');
    }
  };

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageContent || !recipientId) return;
    
    const success = socketService.sendMessage(recipientId, messageContent);
    if (success) {
      setMessageContent('');
    }
  };

  return (
    <div className="driver-app p-4">
      <h1 className="text-2xl font-bold mb-4">Driver App</h1>
      
      {/* Connection status */}
      <div className="mb-4">
        <div className={`inline-block w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      
      {/* Delivery status form */}
      <div className="border p-4 rounded mb-4">
        <h2 className="text-xl mb-2">Update Delivery Status</h2>
        <form onSubmit={handleUpdateStatus}>
          <div className="mb-2">
            <label className="block text-sm">Delivery ID</label>
            <input
              type="text"
              value={deliveryId}
              onChange={(e) => setDeliveryId(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 w-full rounded"
            >
              <option value="">Select status</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed Delivery</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border p-2 w-full rounded"
              rows="2"
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="bg-blue-500 text-white py-2 px-4 rounded"
            disabled={!isConnected || !status}
          >
            Update Status
          </button>
        </form>
      </div>
      
      {/* Messaging */}
      <div className="border p-4 rounded mb-4">
        <h2 className="text-xl mb-2">Send Message</h2>
        <form onSubmit={handleSendMessage}>
          <div className="mb-2">
            <label className="block text-sm">Recipient</label>
            <select
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="border p-2 w-full rounded"
            >
              <option value="admin">Admin</option>
              <option value="customer123">Customer</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm">Message</label>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              className="border p-2 w-full rounded"
              rows="3"
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="bg-green-500 text-white py-2 px-4 rounded"
            disabled={!isConnected || !messageContent}
          >
            Send Message
          </button>
        </form>
      </div>
      
      {/* Messages */}
      <div className="border p-4 rounded mb-4">
        <h2 className="text-xl mb-2">Messages</h2>
        <div className="max-h-40 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="mb-2 p-2 border-b">
                <div className="flex justify-between">
                  <span className="font-bold">{msg.senderType}: {msg.senderId}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p>{msg.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Notifications */}
      <div className="border p-4 rounded">
        <h2 className="text-xl mb-2">Notifications</h2>
        <div className="max-h-40 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications yet</p>
          ) : (
            notifications.map((notification, index) => (
              <div key={index} className="mb-2 p-2 border-b">
                <div className="flex justify-between">
                  <span className="font-bold">{notification.type}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p>
                  {notification.type === 'delivery' && 
                    `Delivery ${notification.data.deliveryId} status: ${notification.data.status}`}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverApp;