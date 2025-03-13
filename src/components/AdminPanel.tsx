import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Terminal, AlertOctagon, Package, BarChart3, Settings, TrendingUp, Clock, DollarSign, Truck, Book, FileSpreadsheet } from 'lucide-react';
import { useProductStore, Product, Category, StrainType } from '../store/productStore';
import DropSpecialistPanel from './DropSpecialistPanel';
import AdminHandbook from './AdminHandbook';
import CustomReports from './CustomReports';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'security' | 'analytics' | 'settings' | 'drivers' | 'handbook' | 'reports'>('products');
  const { products, addProduct, updateProduct, deleteProduct, totalSales, activeOrders, salesHistory } = useProductStore();
  const [selectedReport, setSelectedReport] = useState('overview');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    quantity: 0,
    category: Category.FLOWER,
    strainType: StrainType.HYBRID,
    thcPercentage: 0,
  });

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!newProduct.name || !newProduct.description || !newProduct.category || newProduct.price <= 0) {
      alert('Please fill in all required fields (name, description, category, and price)');
      return;
    }
    
    addProduct(newProduct as Omit<Product, 'id' | 'createdAt'>);
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      image: '',
      quantity: 0,
      category: Category.FLOWER,
      strainType: StrainType.HYBRID,
      thcPercentage: 0,
    });
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-90 text-gray-100 p-6 overflow-y-auto">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 sm:col-span-2 sticky top-6 h-fit">
          <div className="glass-panel p-4 space-y-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`cyber-button w-full flex items-center space-x-2 ${
                activeTab === 'products' ? 'border-neon-purple' : ''
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`cyber-button w-full flex items-center space-x-2 ${
                activeTab === 'security' ? 'border-neon-purple' : ''
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Security</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`cyber-button w-full flex items-center space-x-2 ${
                activeTab === 'analytics' ? 'border-neon-purple' : ''
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`cyber-button w-full flex items-center space-x-2 ${
                activeTab === 'settings' ? 'border-neon-purple' : ''
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => setActiveTab('handbook')}
              className={`cyber-button w-full flex items-center space-x-2 ${
                activeTab === 'handbook' ? 'border-neon-purple' : ''
              }`}
            >
              <Book className="w-4 h-4" />
              <span>Handbook</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`cyber-button w-full flex items-center space-x-2 ${
                activeTab === 'reports' ? 'border-neon-purple' : ''
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Reports</span>
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`cyber-button w-full flex items-center space-x-2 ${
                activeTab === 'drivers' ? 'border-neon-purple' : ''
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Drop Specialists</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 sm:col-span-10 pb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Terminal className="w-6 h-6 text-neon-cyan" />
                <h1 className="text-2xl font-cyber neon-text">Admin Terminal</h1>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                <span className="text-sm">SYSTEM ACTIVE</span>
              </div>
            </div>

            {/* Products Management */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                {/* Add Product Form */}
                <form onSubmit={handleAddProduct} className="glass-panel p-4">
                  <h2 className="text-xl mb-4 text-neon-purple">Add New Product</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        className="cyber-button bg-black bg-opacity-50"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Description *
                      </label>
                      <textarea
                        className="cyber-button bg-black bg-opacity-50 w-full min-h-[100px]"
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Price * ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="cyber-button bg-black bg-opacity-50"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            price: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Quantity
                      </label>
                      <input
                        type="number"
                        className="cyber-button bg-black bg-opacity-50"
                        value={newProduct.quantity}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            quantity: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        THC Percentage
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        className="cyber-button bg-black bg-opacity-50"
                        value={newProduct.thcPercentage}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            thcPercentage: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Category *
                      </label>
                      <select
                        className="cyber-button bg-black bg-opacity-50"
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            category: e.target.value as Category,
                          })
                        }
                      >
                        <option value="">Select Category</option>
                        {Object.values(Category).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Strain Type
                      </label>
                      <select
                        className="cyber-button bg-black bg-opacity-50"
                        value={newProduct.strainType}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            strainType: e.target.value as StrainType,
                          })
                        }
                      >
                        <option value="">Select Strain Type</option>
                        {Object.values(StrainType).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-300">
                        Product Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cyber-button bg-black bg-opacity-50 w-full"
                      />
                      {newProduct.image && (
                        <div className="mt-2">
                          <img
                            src={newProduct.image}
                            alt="Product preview"
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="cyber-button col-span-2 bg-neon-purple bg-opacity-20 hover:bg-opacity-30"
                    >
                      Add Product
                    </button>
                  </div>
                </form>

                {/* Products List */}
                <div className="glass-panel p-4">
                  <h2 className="text-xl mb-4 text-neon-cyan">Products List</h2>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-panel p-4 neon-border"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-4">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <h3 className="text-lg font-cyber">{product.name}</h3>
                              <p className="text-sm text-gray-400">
                                {product.description}
                              </p>
                              <div className="flex space-x-4 mt-2">
                                <span className="text-neon-green">
                                  ${product.price.toFixed(2)}
                                </span>
                                <span className="text-neon-purple">
                                  Stock: {product.quantity}
                                </span>
                                <span className="text-neon-cyan">
                                  THC: {product.thcPercentage}%
                                </span>
                              </div>
                              <div className="flex space-x-2 mt-1">
                                <span className="text-xs bg-neon-purple bg-opacity-20 px-2 py-1 rounded">
                                  {product.category}
                                </span>
                                {product.strainType && (
                                  <span className="text-xs bg-neon-green bg-opacity-20 px-2 py-1 rounded">
                                    {product.strainType}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="cyber-button bg-red-500 bg-opacity-20 hover:bg-opacity-30"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="glass-panel p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl text-neon-red">Security Controls</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
                      <span className="text-sm">PERIMETER SECURE</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <button 
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/backup/create', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ timestamp: new Date().toISOString() })
                            });
                            
                            if (response.ok) {
                              alert('Emergency backup completed successfully! Check the handbook for setup instructions if this is your first time.');
                            } else {
                              alert('Backup failed. Please check your Digital Ocean VPS settings in the handbook.');
                            }
                          } catch (error) {
                            alert('Error creating backup. Please check your connection and VPS settings.');
                          }
                        }}
                        className="cyber-button bg-red-500 bg-opacity-20 hover:bg-opacity-30 w-full"
                      >
                        EMERGENCY SHUTDOWN
                      </button>
                      <button 
                        onClick={() => {
                          const dogContainer = document.getElementById('security-dog-container');
                          if (dogContainer) {
                            dogContainer.classList.remove('animate-bounce');
                            void dogContainer.offsetWidth;
                            dogContainer.classList.add('animate-bounce');
                          }
                        }}
                        className="cyber-button bg-yellow-500 bg-opacity-20 hover:bg-opacity-30 w-full"
                      >
                        SIMULATE THREAT
                      </button>
                    </div>
                    
                    <div 
                      id="security-dog-container"
                      className="glass-panel p-4 flex items-center justify-center transition-all duration-300"
                    >
                      <img
                        src="https://imgur.com/oLVxMam.gif"
                        alt="Security Guard Dog"
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="glass-panel p-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-neon-cyan">System Analytics</h2>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSelectedReport('overview')}
                      className={`cyber-button ${
                        selectedReport === 'overview' ? 'border-neon-purple' : ''
                      }`}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Overview
                    </button>
                    <button
                      onClick={() => setSelectedReport('sales')}
                      className={`cyber-button ${
                        selectedReport === 'sales' ? 'border-neon-purple' : ''
                      }`}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Sales Report
                    </button>
                    <button
                      onClick={() => setSelectedReport('inventory')}
                      className={`cyber-button ${
                        selectedReport === 'inventory' ? 'border-neon-purple' : ''
                      }`}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Inventory Report
                    </button>
                  </div>
                </div>

                {selectedReport === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="glass-panel p-4">
                        <h3 className="text-lg mb-2">Total Sales</h3>
                        <p className="text-2xl text-neon-green">
                          ${totalSales.toFixed(2)}
                        </p>
                      </div>
                      <div className="glass-panel p-4">
                        <h3 className="text-lg mb-2">Active Orders</h3>
                        <p className="text-2xl text-neon-purple">{activeOrders}</p>
                      </div>
                      <div className="glass-panel p-4">
                        <h3 className="text-lg mb-2">System Status</h3>
                        <p className="text-2xl text-neon-cyan">OPTIMAL</p>
                      </div>
                    </div>

                    <div className="glass-panel p-4">
                      <h3 className="text-lg mb-4">30-Day Sales Trend</h3>
                      <div className="h-48 flex items-end space-x-1">
                        {salesHistory.map((sale, index) => (
                          <div
                            key={index}
                            className="flex-1 bg-neon-purple bg-opacity-20 hover:bg-opacity-30 transition-all"
                            style={{
                              height: `${(sale.amount / Math.max(...salesHistory.map(s => s.amount))) * 100}%`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport === 'sales' && (
                  <div className="space-y-6">
                    <div className="glass-panel p-4">
                      <h3 className="text-lg mb-4">Top Selling Products</h3>
                      <div className="space-y-4">
                        {products
                          .sort((a, b) => (b.sales || 0) - (a.sales || 0))
                          .slice(0, 5)
                          .map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between p-2 glass-panel"
                            >
                              <div>
                                <h4 className="font-cyber">{product.name}</h4>
                                <p className="text-sm text-gray-400">
                                  {product.category}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-neon-green">
                                  Sales: {product.sales || 0}
                                </p>
                                <p className="text-sm text-gray-400">
                                  Last sold:{' '}
                                  {product.lastSold
                                    ? new Date(product.lastSold).toLocaleDateString()
                                    : 'Never'}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport === 'inventory' && (
                  <div className="space-y-6">
                    <div className="glass-panel p-4">
                      <h3 className="text-lg mb-4">Low Stock Alert</h3>
                      <div className="space-y-4">
                        {products
                          .filter((p) => p.quantity < 10)
                          .map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center justify-between p-2 glass-panel"
                            >
                              <div>
                                <h4 className="font-cyber">{product.name}</h4>
                                <p className="text-sm text-gray-400">
                                  {product.category}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-red-500">
                                  Stock: {product.quantity}
                                </p>
                                <button className="cyber-button text-sm mt-2">
                                  Restock
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Drop Specialists Tab */}
            {activeTab === 'drivers' && (
              <DropSpecialistPanel />
            )}
            {activeTab === 'handbook' && (
              <AdminHandbook />
            )}
            {activeTab === 'reports' && (
              <CustomReports />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel