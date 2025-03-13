import React from 'react';
import { motion } from 'framer-motion';
import { Book, Users, TrendingUp, Shield, Wallet, Bitcoin, AlertTriangle, FileSpreadsheet, Map } from 'lucide-react';

const AdminHandbook: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel p-8 border border-neon-cyan border-opacity-20"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Book className="w-8 h-8 text-neon-cyan" />
          <h2 className="text-3xl font-cyber neon-text">Admin Handbook</h2>
        </div>

        <div className="space-y-8">
          {/* MetaMask Integration */}
          <section className="glass-panel p-6 border border-neon-purple border-opacity-20">
            <div className="flex items-center space-x-3 mb-4">
              <Wallet className="w-6 h-6 text-neon-purple" />
              <h3 className="text-xl font-cyber">MetaMask Integration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg mb-2 text-neon-green">Initial Setup</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Install MetaMask browser extension:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Visit metamask.io</li>
                      <li>Click "Download" and follow installation steps</li>
                      <li>Create or import a wallet</li>
                    </ul>
                  </li>
                  <li>Configure Network Settings:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Open MetaMask</li>
                      <li>Click network dropdown (usually shows "Ethereum Mainnet")</li>
                      <li>Add custom network if needed</li>
                    </ul>
                  </li>
                  <li>Security Best Practices:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Never share private keys</li>
                      <li>Use hardware wallet for large transactions</li>
                      <li>Enable enhanced security features</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="text-lg mb-2 text-neon-green">Transaction Monitoring</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Payment Status Indicators:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li><span className="text-neon-purple">Purple</span>: Pending</li>
                      <li><span className="text-neon-green">Green</span>: Confirmed</li>
                      <li><span className="text-red-500">Red</span>: Failed</li>
                    </ul>
                  </li>
                  <li>Transaction Verification:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Check block confirmations</li>
                      <li>Verify gas fees and limits</li>
                      <li>Monitor network congestion</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg mb-2 text-neon-green">Troubleshooting</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Common Issues:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Insufficient funds for gas</li>
                      <li>Network congestion</li>
                      <li>Pending transactions</li>
                    </ul>
                  </li>
                  <li>Resolution Steps:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Check MetaMask connection</li>
                      <li>Verify network status</li>
                      <li>Contact support if needed</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Mapbox Integration */}
          <section className="glass-panel p-6 border border-neon-purple border-opacity-20">
            <div className="flex items-center space-x-3 mb-4">
              <Map className="w-6 h-6 text-neon-purple" />
              <h3 className="text-xl font-cyber">Mapbox Integration</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg mb-2 text-neon-green">Initial Setup</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Create Mapbox Account:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Visit mapbox.com and sign up</li>
                      <li>Navigate to Account → Access Tokens</li>
                      <li>Create a new token with required scopes</li>
                    </ul>
                  </li>
                  <li>Configure Map Style:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Use dark-v10 style for cyberpunk theme</li>
                      <li>Customize colors to match brand</li>
                      <li>Save style URL for reference</li>
                    </ul>
                  </li>
                  <li>Security Best Practices:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Restrict token usage by URL</li>
                      <li>Set appropriate rate limits</li>
                      <li>Monitor token usage regularly</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div>
                <h4 className="text-lg mb-2 text-neon-green">Driver Tracking Features</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Real-time Location Updates:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Automatic position refresh every 5s</li>
                      <li>Smooth marker animations</li>
                      <li>Battery level indicators</li>
                    </ul>
                  </li>
                  <li>Route Optimization:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Automatic route calculation</li>
                      <li>Traffic-aware pathfinding</li>
                      <li>Multiple delivery optimization</li>
                    </ul>
                  </li>
                  <li>Geofencing Controls:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Define delivery zones</li>
                      <li>Set restricted areas</li>
                      <li>Automatic alerts for zone violations</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg mb-2 text-neon-green">Map Customization</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Custom Markers:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Driver status indicators</li>
                      <li>Delivery status icons</li>
                      <li>Interactive popups</li>
                    </ul>
                  </li>
                  <li>Layer Management:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Toggle different data layers</li>
                      <li>Heat maps for busy areas</li>
                      <li>Historical route visualization</li>
                    </ul>
                  </li>
                  <li>Interactive Features:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Click-to-assign deliveries</li>
                      <li>Drag-to-reorder routes</li>
                      <li>Zoom-based detail levels</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg mb-2 text-neon-green">Troubleshooting</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Common Issues:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Token authentication errors</li>
                      <li>Rate limit exceeded</li>
                      <li>Marker update delays</li>
                    </ul>
                  </li>
                  <li>Performance Optimization:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Implement marker clustering</li>
                      <li>Use viewport-based loading</li>
                      <li>Cache map tiles locally</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Driver Management */}
          <section className="glass-panel p-6 border border-neon-purple border-opacity-20">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-neon-purple" />
              <h3 className="text-xl font-cyber">Driver Management</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg mb-2 text-neon-green">Adding New Drivers</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Navigate to the "Drop Specialists" tab in the admin panel</li>
                  <li>Use the "Add Driver" form in the left sidebar</li>
                  <li>Required information:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Full Name</li>
                      <li>Email (for login)</li>
                      <li>Phone Number</li>
                      <li>Vehicle Information</li>
                    </ul>
                  </li>
                  <li>Provide the driver with their login credentials</li>
                  <li>Monitor their first few deliveries closely</li>
                </ol>
              </div>

              <div>
                <h4 className="text-lg mb-2 text-neon-green">Managing Active Drivers</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Monitor driver status in real-time:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Green: Available</li>
                      <li>Purple: Delivering</li>
                      <li>Gray: Offline</li>
                    </ul>
                  </li>
                  <li>Use the communication panel for direct messaging</li>
                  <li>Check battery levels and signal strength indicators</li>
                  <li>Review delivery history and performance metrics</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg mb-2 text-neon-green">Handling Issues</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Low battery alerts: Contact driver immediately</li>
                  <li>Poor signal: Monitor closely and consider route adjustment</li>
                  <li>Customer complaints: Document and investigate promptly</li>
                  <li>Emergency situations: Use the emergency protocol button</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Performance Monitoring */}
          <section className="glass-panel p-6 border border-neon-purple border-opacity-20">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-neon-purple" />
              <h3 className="text-xl font-cyber">Performance Monitoring</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg mb-2 text-neon-green">Key Metrics</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Delivery completion time</li>
                  <li>Customer satisfaction ratings</li>
                  <li>On-time delivery percentage</li>
                  <li>Active hours per week</li>
                  <li>Number of successful deliveries</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg mb-2 text-neon-green">Creating Reports</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Access Custom Reports:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Click the "Reports" tab in the left sidebar</li>
                      <li>You'll see the custom reports builder interface</li>
                    </ul>
                  </li>
                  <li>Create a New Report:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Choose fields from the "Available Fields" section</li>
                      <li>Click the + button to add fields to your report</li>
                      <li>Fields are organized by category: Driver, Delivery, Customer</li>
                    </ul>
                  </li>
                  <li>Configure Report Details:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Enter a descriptive report name</li>
                      <li>Add a detailed description of the report's purpose</li>
                      <li>Selected fields will appear in the preview area</li>
                    </ul>
                  </li>
                  <li>Set Up Automated Reports:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Click the calendar icon to enable scheduling</li>
                      <li>Choose frequency: Daily, Weekly, or Monthly</li>
                      <li>Set delivery time</li>
                      <li>Add email recipients who should receive the report</li>
                    </ul>
                  </li>
                  <li>Save and Generate Reports:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Click "Save Template" to save your report configuration</li>
                      <li>Use "Generate Report" to create a one-time report</li>
                      <li>Saved reports appear in the "Saved Reports" section</li>
                    </ul>
                  </li>
                  <li>Available Metrics:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Driver Metrics: Active hours, deliveries, ratings, etc.</li>
                      <li>Delivery Metrics: Duration, distance, status updates</li>
                      <li>Customer Metrics: Ratings, feedback, order frequency</li>
                    </ul>
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="text-lg mb-2 text-neon-green">Customizing the Build</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Environment Setup:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Locate the ".env" file in your project folder</li>
                      <li>Update values for your specific setup</li>
                      <li>Never share or commit this file to version control</li>
                    </ul>
                  </li>
                  <li>Customizing Reports:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Reports are fully customizable through the interface</li>
                      <li>Save frequently used report templates</li>
                      <li>Export reports in various formats (CSV, PDF)</li>
                    </ul>
                  </li>
                  <li>Adding New Metrics:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Contact your development team to add new metrics</li>
                      <li>New metrics will appear in the Available Fields list</li>
                      <li>Custom calculations can be added upon request</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security Protocols */}
          <section className="glass-panel p-6 border border-neon-purple border-opacity-20">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-neon-purple" />
              <h3 className="text-xl font-cyber">Security Monitoring</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg mb-2 text-neon-green">Automated Security Features</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Real-time Transaction Monitoring:
                  <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                    <li>Blockchain transaction verification</li>
                    <li>Payment confirmation alerts</li>
                    <li>Fraud detection patterns</li>
                  </ul>
                </li>
                <li>Driver Activity Monitoring:
                  <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                    <li>GPS location tracking</li>
                    <li>Delivery route analysis</li>
                    <li>Speed and safety monitoring</li>
                  </ul>
                </li>
                <li>System Health Monitoring:
                  <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                    <li>Network connectivity status</li>
                    <li>Server response times</li>
                    <li>API endpoint health</li>
                  </ul>
                </li>
                <li>Automated Alerts:
                  <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                    <li>Unusual activity detection</li>
                    <li>System performance issues</li>
                    <li>Security breach attempts</li>
                  </ul>
                </li>
              </ul>
              </div>
              <div>
                <h4 className="text-lg mb-2 text-neon-green">Emergency Protocols</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Digital Ocean VPS Backup Setup:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Step 1: Create a Digital Ocean Account
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Visit <a href="https://www.digitalocean.com" target="_blank" className="text-neon-cyan hover:underline">Digital Ocean's website</a></li>
                          <li>Click the big blue "Sign Up" button</li>
                          <li>Use your email and make a password</li>
                          <li>They might ask for your credit card - that's okay! They're a trusted company 😊</li>
                        </ul>
                      </li>
                      <li>Step 2: Create Your First VPS (they call it a "Droplet")
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Look for a green button that says "Create" at the top</li>
                          <li>Choose "Droplets" from the menu</li>
                          <li>Pick "Ubuntu" - it has a circle logo that looks like this: <img src="https://assets.digitalocean.com/logos/ubuntu.png" alt="Ubuntu Logo" className="inline-block h-4 mx-1" /></li>
                          <li>Choose the cheapest plan - it's perfect for backups!</li>
                          <li>Pick a place close to you for "datacenter region"</li>
                          <li>Make up a password you'll remember</li>
                          <li>Click "Create Droplet" and wait a minute</li>
                        </ul>
                      </li>
                      <li>Step 3: Find Your Special Numbers (IP Address)
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>After your VPS is ready, you'll see a number like "123.456.789.123"</li>
                          <li>This is your VPS's address - write it down!</li>
                          <li>Your username will be "root" at first</li>
                        </ul>
                      </li>
                      <li>Step 4: Set Up Your Secret Key
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Open this folder on your computer:
                            <div className="bg-black bg-opacity-50 p-2 my-1 rounded font-mono text-sm">
                              Windows: C:\Windows\System32<br/>
                              Mac: ~/.ssh
                            </div>
                          </li>
                          <li>Look for files named "id_rsa" and "id_rsa.pub"</li>
                          <li>If you don't have them, don't worry! Ask your IT person to help create them 😊</li>
                        </ul>
                      </li>
                      <li>Step 5: Tell the App About Your VPS
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Find the file named ".env" in your app folder</li>
                          <li>Add these lines (replace with your info):
                            <div className="bg-black bg-opacity-50 p-2 my-1 rounded font-mono text-sm">
                              DO_SSH_KEY=C:/Windows/System32/id_rsa<br/>
                              DO_HOST=123.456.789.123<br/>
                              DO_USERNAME=root<br/>
                              DO_PORT=22<br/>
                              DO_BACKUP_PATH=/root/backups
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li>Step 6: Test Your Backup
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Click the "EMERGENCY SHUTDOWN" button</li>
                          <li>If everything is set up right, you'll see a message saying "Backup Complete!"</li>
                          <li>If you see any red error messages, double-check steps 3-5</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>Automated System Lockdown:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Triggers on multiple failed auth attempts</li>
                      <li>Activates on suspicious transaction patterns</li>
                      <li>Engages during network attacks</li>
                    </ul>
                  </li>
                  <li>Incident Response:
                    <ul className="list-disc list-inside ml-4 mt-1 text-gray-400">
                      <li>Automatic incident logging</li>
                      <li>Alert escalation system</li>
                      <li>Emergency contact procedures</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminHandbook;