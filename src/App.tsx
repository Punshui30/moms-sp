import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Bitcoin, AlertTriangle, Home, Settings } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';
import { useProductStore } from './store/productStore';
import { useCartStore } from './store/cartStore';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home', color: 'text-neon-cyan' },
  { path: '/cart', icon: ShoppingCart, label: 'Cart', color: 'text-neon-purple' }
];

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA'
];

function AppContent() {
  const [showMenu, setShowMenu] = useState(false);
  // Removed: const [audioPlayed, setAudioPlayed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [adminUnlocked, setAdminUnlocked] = useState(() => localStorage.getItem('adminUnlocked') === 'true');
  // Removed: const [audioContext] = useState(() => new (window.AudioContext || window.webkitAudioContext)());
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const { products } = useProductStore();
  const { addItem, items } = useCartStore();

  const handleAddToCart = (product: Product) => {
    addItem(product);
    // Optional: Add visual feedback
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 glass-panel p-4 text-neon-green z-50';
    toast.textContent = 'Added to cart!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const newSequence = [...keySequence, event.code];
      
      // Keep only the last N keys where N is the length of the Konami code
      if (newSequence.length > KONAMI_CODE.length) {
        newSequence.shift();
      }
      
      setKeySequence(newSequence);

      // Check if the sequence matches the Konami code
      if (newSequence.join(',') === KONAMI_CODE.join(',')) {
        setAdminUnlocked(true);
        localStorage.setItem('adminUnlocked', 'true');
        navigate('/admin');
        // Reset sequence after successful unlock
        setKeySequence([]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence]);

  const handleShopNow = () => {
    // Removed all audio code
    setShowMenu(!showMenu);
  };

  return (
    <div className="min-h-screen text-gray-100 relative flex flex-col">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0"
        >
          <source src="https://i.imgur.com/OlTHe0y.mp4" type="video/mp4" />
          <source src="https://i.imgur.com/OlTHe0y.webm" type="video/webm" />
        </video>

        {/* Floating Navigation - Responsive positioning */}
        <nav className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 glass-panel p-2 md:p-4 space-y-2 md:space-y-4 z-50">
          {NAV_ITEMS
            .map(({ path, icon: Icon, label, color }) => (
            <Link key={path} to={path}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="cyber-button w-10 h-10 md:w-12 md:h-12 flex items-center justify-center relative group"
              >
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${color}`} />
                <span className="absolute right-full mr-2 whitespace-nowrap bg-black bg-opacity-80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs md:text-sm">
                  {label}
                </span>
              </motion.button>
            </Link>
          ))}
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <main className="flex-1 relative z-10">
                {/* Enhanced Branding Panel - Larger and more prominent */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="branding-panel glass-panel p-4 sm:p-6 md:p-8 absolute top-4 sm:top-10 md:top-16 left-4 sm:left-8 md:left-10 max-w-[90%] sm:max-w-sm md:max-w-md"
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-cyber neon-text tracking-wider mb-2 sm:mb-3">
                    <span>ZaZoom</span>
                  </h1>
                  <h2 className="text-sm sm:text-lg md:text-xl font-bold text-white" style={{ textShadow: '0 0 10px var(--neon-purple), 0 0 20px var(--neon-purple), 0 0 30px var(--neon-purple)' }}>
                    Secure Cannabis Delivery
                  </h2>
                  <p className="mt-2 md:mt-3 text-xs sm:text-sm md:text-base font-bold text-neon-cyan" style={{ textShadow: '0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan)' }}>
                    Za, Delivered Fast. ZaZoom!
                  </p>
                  
                  {/* Status Panel */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-3 md:mt-6">
                    <div className="flex items-center gap-1 text-neon-green">
                      <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-neon-green animate-pulse"/>
                      <span className="text-xs md:text-sm">Online</span>
                    </div>
                    <div className="flex items-center gap-1 text-neon-purple">
                      <Bitcoin className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">Crypto</span>
                    </div>
                    <div className="flex items-center gap-1 text-neon-cyan">
                      <AlertTriangle className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">Secure</span>
                    </div>
                  </div>
                </motion.div>

                {/* Products Panel - Responsive layout */}
                <div className="absolute bottom-0 left-0 right-0 h-[25vh] sm:h-[30vh] pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full h-full overflow-x-auto scrollbar-thin scrollbar-thumb-neon-cyan scrollbar-track-transparent pb-4"
                  >
                    <div className="flex space-x-3 md:space-x-4 items-end mb-4 px-4 min-w-min">
                      {products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 0.9 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ 
                            y: -20, 
                            opacity: 1,
                            transition: { duration: 0.2 }
                          }}
                          className="product-card pointer-events-auto flex-shrink-0"
                        >
                          <div className="relative">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg mb-1 sm:mb-2"
                              />
                            )}
                            <h3 className="text-xs sm:text-sm font-cyber">{product.name}</h3>
                            <p className="text-[10px] sm:text-xs text-gray-400 truncate max-w-full">
                              {product.description.substring(0, 40)}...
                            </p>
                            <div className="flex justify-between items-center mt-1 sm:mt-2">
                              <span className="text-neon-green text-[10px] sm:text-xs font-mono">${product.price.toFixed(2)}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="add-button"
                                onClick={() => handleAddToCart(product)}
                              >
                                <ShoppingCart className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                                <span className="text-[10px] sm:text-xs">Add</span>
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {items.length > 0 && (
                  <div className="fixed bottom-4 left-4 glass-panel p-2 sm:p-3 z-50">
                    <Link to="/cart" className="flex items-center space-x-1 sm:space-x-2 text-neon-purple">
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm">{items.length} items</span>
                    </Link>
                  </div>
                )}
              </main>
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/admin"
            element={adminUnlocked ? <AdminPanel /> : <Navigate to="/" replace />}
          />
        </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;