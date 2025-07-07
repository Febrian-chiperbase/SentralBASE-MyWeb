import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Clock,
  Mail,
  Settings,
  Play,
  Save,
  Share
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ReportBuilder = () => {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    type: 'summary',
    dateRange: '30d',
    metrics: [],
    filters: [],
    groupBy: 'day',
    format: 'pdf'
  });
  
  const [availableMetrics] = useState([
    { id: 'total_customers', name: 'Total Customers', icon: Users, category: 'customers' },
    { id: 'new_customers', name: 'New Customers', icon: Users, category: 'customers' },
    { id: 'conversion_rate', name: 'Conversion Rate', icon: Target, category: 'performance' },
    { id: 'total_revenue', name: 'Total Revenue', icon: DollarSign, category: 'revenue' },
    { id: 'avg_order_value', name: 'Average Order Value', icon: DollarSign, category: 'revenue' },
    { id: 'response_time', name: 'Response Time', icon: Clock, category: 'performance' },
    { id: 'email_open_rate', name: 'Email Open Rate', icon: Mail, category: 'marketing' },
    { id: 'workflow_success', name: 'Workflow Success Rate', icon: Target, category: 'automation' }
  ]);

  const [savedReports] = useState([
    { id: 1, name: 'Monthly Business Summary', type: 'summary', lastRun: '2024-01-15', schedule: 'monthly' },
    { id: 2, name: 'Customer Acquisition Report', type: 'detailed', lastRun: '2024-01-14', schedule: 'weekly' },
    { id: 3, name: 'Revenue Analysis', type: 'financial', lastRun: '2024-01-13', schedule: 'daily' },
    { id: 4, name: 'Workflow Performance', type: 'automation', lastRun: '2024-01-12', schedule: 'weekly' }
  ]);

  const generateReport = () => {
    // Simulate report generation
    const reportData = {
      config: reportConfig,
      generatedAt: new Date().toISOString(),
      data: generateMockData()
    };
    
    // Export as JSON for now (in production, would generate PDF/Excel)
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportConfig.name || 'sentrabase-report'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateMockData = () => {
    return {
      summary: {
        totalCustomers: 156,
        newCustomers: 23,
        conversionRate: 12.5,
        totalRevenue: 45000000,
        avgOrderValue: 3330000
      },
      trends: Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        customers: Math.floor(Math.random() * 10) + 5,
        revenue: (Math.floor(Math.random() * 5) + 2) * 3330000
      }))
    };
  };

  const addMetric = (metric) => {
    if (!reportConfig.metrics.find(m => m.id === metric.id)) {
      setReportConfig(prev => ({
        ...prev,
        metrics: [...prev.metrics, metric]
      }));
    }
  };

  const removeMetric = (metricId) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.filter(m => m.id !== metricId)
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Custom Report Builder</h2>
          <p className="text-gray-400">Create and schedule custom business reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={generateReport}
            disabled={!reportConfig.name || reportConfig.metrics.length === 0}
            className="bg-green-500 hover:bg-green-600"
          >
            <Play className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Configuration */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Report Configuration</h3>
            
            {/* Basic Settings */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Report Name</label>
                <Input
                  value={reportConfig.name}
                  onChange={(e) => setReportConfig(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter report name..."
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Report Type</label>
                  <select
                    value={reportConfig.type}
                    onChange={(e) => setReportConfig(prev => ({...prev, type: e.target.value}))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="summary">Summary Report</option>
                    <option value="detailed">Detailed Analysis</option>
                    <option value="financial">Financial Report</option>
                    <option value="automation">Automation Report</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
                  <select
                    value={reportConfig.dateRange}
                    onChange={(e) => setReportConfig(prev => ({...prev, dateRange: e.target.value}))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Metrics Selection */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">Select Metrics</h4>
              
              {/* Available Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {availableMetrics.map((metric) => {
                  const Icon = metric.icon;
                  const isSelected = reportConfig.metrics.find(m => m.id === metric.id);
                  
                  return (
                    <button
                      key={metric.id}
                      onClick={() => isSelected ? removeMetric(metric.id) : addMetric(metric)}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        isSelected 
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                          : 'bg-slate-700 border-slate-600 text-gray-300 hover:border-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{metric.name}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Selected Metrics */}
              {reportConfig.metrics.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Selected Metrics:</p>
                  <div className="flex flex-wrap gap-2">
                    {reportConfig.metrics.map((metric) => (
                      <span
                        key={metric.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400"
                      >
                        {metric.name}
                        <button
                          onClick={() => removeMetric(metric.id)}
                          className="ml-2 text-blue-300 hover:text-blue-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Options */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Group By</label>
                <select
                  value={reportConfig.groupBy}
                  onChange={(e) => setReportConfig(prev => ({...prev, groupBy: e.target.value}))}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="day">Daily</option>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                  <option value="quarter">Quarterly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Export Format</label>
                <select
                  value={reportConfig.format}
                  onChange={(e) => setReportConfig(prev => ({...prev, format: e.target.value}))}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Saved Reports */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Saved Reports</h3>
            
            <div className="space-y-4">
              {savedReports.map((report) => (
                <div key={report.id} className="p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{report.name}</h4>
                    <span className="text-xs text-gray-400">{report.type}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    Last run: {report.lastRun} • {report.schedule}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-500 text-gray-400">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">Schedule Reports</h4>
              <p className="text-xs text-gray-400 mb-3">
                Set up automatic report generation and delivery
              </p>
              <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                <Calendar className="w-3 h-3 mr-1" />
                Setup Schedule
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;
