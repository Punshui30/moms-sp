import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useCartStore } from '../store/cartStore';
import { useWeb3Store } from '../store/web3Store';
import { X, Bitcoin, Truck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import socketService from '../socketService';

const Cart: React.FC = () => {
  const { items, total, removeItem, updateQuantity, orderStatus, btcAddress } = useCartStore();
  const { initializeWeb3, monitorPayment } = useWeb3Store();

  useEffect(() => {
    // Connect to socket when component mounts
    const token = localStorage.getItem('userToken') || 'guest-token';
    socketService.connect(token);

    return () => {
      socketService.disconnect();
    };
  }, []);

  const handleCheckout = () => {
    // In production, this would call your backend to generate a unique BTC address
    const mockBtcAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
    useCartStore.getState().setBtcAddress(mockBtcAddress);
    
    // Initialize Web3 and start monitoring for payment
    initializeWeb3().then(() => {
      monitorPayment(mockBtcAddress, total.toString()).then((success) => {
        if (success) {
          useCartStore.getState().setOrderStatus('paid');
        }
      });
    });
    
    // Notify server about new order
    socketService.socket?.emit('newOrder', {
      items,
      total,
      btcAddress: mockBtcAddress
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <Link to="/" className="flex items-center space-x-2 text-neon-cyan mb-8">
        <ArrowLeft className="w-6 h-6" />
        <span>Continue Shopping</span>
      </Link>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 max-w-3xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-cyber neon-text">Your Cart</h1>
          <span className="text-neon-purple">{items.length} items</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Your cart is empty</p>
            <Link to="/" className="cyber-button bg-neon-purple bg-opacity-20">
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  className="glass-panel p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="font-cyber">{item.name}</h3>
                      <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="cyber-button w-20 text-center"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="cyber-button text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass-panel p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-cyber">Total</h2>
                <p className="text-2xl text-neon-green">${total.toFixed(2)}</p>
              </div>

              {btcAddress ? (
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                    <QRCodeSVG value={btcAddress} size={200} />
                  </div>
                  <p className="font-mono text-sm break-all">{btcAddress}</p>
                  <div className="flex items-center justify-center space-x-2 text-neon-purple">
                    <Bitcoin className="w-5 h-5" />
                    <p>Waiting for payment...</p>
                  </div>
                  {orderStatus !== 'pending' && (
                    <div className="mt-4 p-4 glass-panel">
                      <div className="flex items-center justify-center space-x-2">
                        <Truck className="w-5 h-5 text-neon-cyan" />
                        <p>Order Status: {orderStatus}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleCheckout}
                  className="cyber-button w-full bg-neon-purple bg-opacity-20 hover:bg-opacity-30"
                >
                  Proceed to Checkout
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default Cart;