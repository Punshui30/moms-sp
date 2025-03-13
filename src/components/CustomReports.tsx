import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Download, Save, Plus, X, Calendar, Filter, FileDown } from 'lucide-react';
import { useDeliveryStore } from '../store/deliveryStore';

interface ExportFormat {
  type: 'csv';
  mimeType: string;
  extension: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  { type: 'csv', mimeType: 'text/csv', extension: '.csv' }
];

interface ReportField {
  id: string;
  name: string;
  type: 'metric' | 'dimension';
  category: 'driver' | 'delivery' | 'customer';
}

interface SavedReport {
  id: string;
  name: string;
  description: string;
  fields: string[];
  filters: any[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    recipients: string[];
  };
}

const AVAILABLE_FIELDS: ReportField[] = [
  // Driver Metrics
  { id: 'driver_name', name: 'Driver Name', type: 'dimension', category: 'driver' },
  { id: 'driver_status', name: 'Driver Status', type: 'dimension', category: 'driver' },
  { id: 'active_hours', name: 'Active Hours', type: 'metric', category: 'driver' },
  { id: 'total_deliveries', name: 'Total Deliveries', type: 'metric', category: 'driver' },
  { id: 'avg_delivery_time', name: 'Average Delivery Time', type: 'metric', category: 'driver' },
  { id: 'battery_level', name: 'Battery Level', type: 'metric', category: 'driver' },
  { id: 'signal_strength', name: 'Signal Strength', type: 'metric', category: 'driver' },
  
  // Delivery Metrics
  { id: 'delivery_id', name: 'Delivery ID', type: 'dimension', category: 'delivery' },
  { id: 'delivery_status', name: 'Delivery Status', type: 'dimension', category: 'delivery' },
  { id: 'pickup_time', name: 'Pickup Time', type: 'dimension', category: 'delivery' },
  { id: 'delivery_time', name: 'Delivery Time', type: 'dimension', category: 'delivery' },
  { id: 'delivery_duration', name: 'Delivery Duration', type: 'metric', category: 'delivery' },
  { id: 'distance', name: 'Distance', type: 'metric', category: 'delivery' },
  
  // Customer Metrics
  { id: 'customer_rating', name: 'Customer Rating', type: 'metric', category: 'customer' },
  { id: 'customer_feedback', name: 'Customer Feedback', type: 'dimension', category: 'customer' },
];

const CustomReports: React.FC = () => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedule, setSchedule] = useState({
    frequency: 'weekly' as const,
    time: '09:00',
    recipients: ['']
  });
  const [activeCategory, setActiveCategory] = useState<'driver' | 'delivery' | 'customer'>('driver');
  
  const { drivers, activeDeliveries } = useDeliveryStore();
  
  const exportToCSV = (data: any[], filename: string) => {
    // Convert object array to CSV string
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle special cases and escape commas
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ];
    const csvString = csvRows.join('\n');

    // Create and download the file
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExport = () => {
    // Prepare data based on selected fields
    const data = drivers.map(driver => {
      const exportData: any = {};
      selectedFields.forEach(fieldId => {
        const field = AVAILABLE_FIELDS.find(f => f.id === fieldId);
        if (field) {
          switch (field.id) {
            case 'driver_name':
              exportData[field.name] = driver.name;
              break;
            case 'driver_status':
              exportData[field.name] = driver.status;
              break;
            case 'total_deliveries':
              exportData[field.name] = activeDeliveries.filter(d => d.driverId === driver.id).length;
              break;
            // Add more field mappings as needed
            default:
              exportData[field.name] = 'N/A';
          }
        }
      });
      return exportData;
    });

    exportToCSV(data, `report-${new Date().toISOString().split('T')[0]}`);
  };

  const handleAddField = (fieldId: string) => {
    setSelectedFields(prev => [...prev, fieldId]);
  };

  const handleRemoveField = (fieldId: string) => {
    setSelectedFields(prev => prev.filter(id => id !== fieldId));
  };

  const handleSaveReport = () => {
    if (!reportName) return;

    const newReport: SavedReport = {
      id: crypto.randomUUID(),
      name: reportName,
      description: reportDescription,
      fields: selectedFields,
      filters: [],
      ...(showSchedule && { schedule })
    };

    setSavedReports(prev => [...prev, newReport]);
    setReportName('');
    setReportDescription('');
    setSelectedFields([]);
    setShowSchedule(false);
  };

  const generateReport = () => {
    // In a real implementation, this would query the database and generate actual reports
    console.log('Generating report with fields:', selectedFields);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="w-8 h-8 text-neon-cyan" />
            <h2 className="text-2xl font-cyber">Custom Reports</h2>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={generateReport}
              className="cyber-button bg-neon-purple bg-opacity-20 flex items-center space-x-2 relative group"
            >
              <Download className="w-4 h-4" />
              <span>Generate Report</span>
              <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExport();
                  }}
                  className="cyber-button bg-neon-cyan bg-opacity-20 flex items-center space-x-2 whitespace-nowrap"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Export as CSV</span>
                </button>
              </div>
            </button>
            <button
              onClick={handleSaveReport}
              className="cyber-button bg-neon-green bg-opacity-20 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Template</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Field Selection */}
          <div className="col-span-3 glass-panel p-4">
            <h3 className="text-lg font-cyber mb-4">Available Fields</h3>
            
            <div className="space-y-4">
              <div className="flex space-x-2">
                {(['driver', 'delivery', 'customer'] as const).map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`cyber-button text-sm ${
                      activeCategory === category ? 'bg-neon-purple bg-opacity-20' : ''
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="space-y-2">
                {AVAILABLE_FIELDS.filter(field => field.category === activeCategory).map(field => (
                  <motion.div
                    key={field.id}
                    className="glass-panel p-2 flex items-center justify-between"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-sm">{field.name}</span>
                    <button
                      onClick={() => handleAddField(field.id)}
                      className="cyber-button p-1"
                      disabled={selectedFields.includes(field.id)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Configuration */}
          <div className="col-span-9 space-y-6">
            {/* Selected Fields */}
            <div className="glass-panel p-4">
              <h3 className="text-lg font-cyber mb-4">Selected Fields</h3>
              <div className="grid grid-cols-3 gap-4">
                {selectedFields.map(fieldId => {
                  const field = AVAILABLE_FIELDS.find(f => f.id === fieldId)!;
                  return (
                    <motion.div
                      key={fieldId}
                      className="glass-panel p-2 flex items-center justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="text-sm">{field.name}</span>
                      <button
                        onClick={() => handleRemoveField(fieldId)}
                        className="cyber-button p-1 text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Report Details */}
            <div className="glass-panel p-4">
              <h3 className="text-lg font-cyber mb-4">Report Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Report Name</label>
                  <input
                    type="text"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    className="cyber-button w-full bg-black bg-opacity-50"
                    placeholder="Enter report name"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Description</label>
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="cyber-button w-full bg-black bg-opacity-50 h-24"
                    placeholder="Enter report description"
                  />
                </div>
              </div>
            </div>

            {/* Schedule Configuration */}
            <div className="glass-panel p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-cyber">Schedule Report</h3>
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className={`cyber-button ${showSchedule ? 'bg-neon-purple bg-opacity-20' : ''}`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
              
              {showSchedule && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2">Frequency</label>
                      <select
                        value={schedule.frequency}
                        onChange={(e) => setSchedule(prev => ({
                          ...prev,
                          frequency: e.target.value as 'daily' | 'weekly' | 'monthly'
                        }))}
                        className="cyber-button w-full bg-black bg-opacity-50"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Time</label>
                      <input
                        type="time"
                        value={schedule.time}
                        onChange={(e) => setSchedule(prev => ({
                          ...prev,
                          time: e.target.value
                        }))}
                        className="cyber-button w-full bg-black bg-opacity-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Recipients</label>
                    {schedule.recipients.map((recipient, index) => (
                      <div key={index} className="flex space-x-2 mb-2">
                        <input
                          type="email"
                          value={recipient}
                          onChange={(e) => {
                            const newRecipients = [...schedule.recipients];
                            newRecipients[index] = e.target.value;
                            setSchedule(prev => ({ ...prev, recipients: newRecipients }));
                          }}
                          className="cyber-button flex-1 bg-black bg-opacity-50"
                          placeholder="Enter email"
                        />
                        <button
                          onClick={() => {
                            const newRecipients = [...schedule.recipients];
                            if (newRecipients.length > 1) {
                              newRecipients.splice(index, 1);
                            } else {
                              newRecipients[0] = '';
                            }
                            setSchedule(prev => ({ ...prev, recipients: newRecipients }));
                          }}
                          className="cyber-button text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setSchedule(prev => ({
                        ...prev,
                        recipients: [...prev.recipients, '']
                      }))}
                      className="cyber-button mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Recipient</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Saved Reports */}
        {savedReports.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-cyber mb-4">Saved Reports</h3>
            <div className="grid grid-cols-3 gap-4">
              {savedReports.map(report => (
                <motion.div
                  key={report.id}
                  className="glass-panel p-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-cyber text-neon-purple mb-2">{report.name}</h4>
                  <p className="text-sm text-gray-400 mb-4">{report.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {report.fields.length} fields selected
                    </span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleExport()}
                        className="cyber-button bg-neon-cyan bg-opacity-20"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {report.schedule && (
                    <div className="mt-2 text-sm text-gray-400">
                      Scheduled: {report.schedule.frequency} at {report.schedule.time}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CustomReports;