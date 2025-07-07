import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Clock,
  Users,
  ShoppingCart,
  DollarSign
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    conversionFunnel: {
      visitors: 0,
      formStarted: 0,
      formCompleted: 0,
      paymentStarted: 0,
      completed: 0
    },
    hourlyData: [],
    planDistribution: [],
    sourceAnalytics: [],
    deviceAnalytics: [],
    locationData: []
  });

  useEffect(() => {
    // Load analytics data
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = () => {
    // Simulate analytics data loading
    const sessions = [];
    const orders = [];
    
    // Get data from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith('payment_session_')) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key));
          sessions.push(sessionData);
        } catch (error) {
          console.error('Error parsing session data:', error);
        }
      }
      
      if (key && key.startsWith('order_')) {
        try {
          const orderData = JSON.parse(localStorage.getItem(key));
          orders.push(orderData);
        } catch (error) {
          console.error('Error parsing order data:', error);
        }
      }
    }

    // Calculate analytics
    setAnalytics({
      conversionFunnel: calculateConversionFunnel(sessions, orders),
      hourlyData: calculateHourlyData(sessions),
      planDistribution: calculatePlanDistribution(sessions),
      sourceAnalytics: calculateSourceAnalytics(sessions),
      deviceAnalytics: calculateDeviceAnalytics(sessions),
      locationData: calculateLocationData(sessions)
    });
  };

  const calculateConversionFunnel = (sessions, orders) => {
    return {
      visitors: sessions.length,
      formStarted: sessions.filter(s => s.step >= 1).length,
      formCompleted: sessions.filter(s => s.step >= 2).length,
      paymentStarted: sessions.filter(s => s.step >= 3).length,
      completed: orders.filter(o => o.status === 'completed').length
    };
  };

  const calculateHourlyData = (sessions) => {
    const hourlyData = Array.from({length: 24}, (_, i) => ({
      hour: i,
      count: 0,
      label: `${i.toString().padStart(2, '0')}:00`
    }));
    
    sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours();
      hourlyData[hour].count++;
    });
    
    return hourlyData;
  };

  const calculatePlanDistribution = (sessions) => {
    const planCounts = {};
    sessions.forEach(session => {
      const plan = session.plan?.name || 'No Plan Selected';
      planCounts[plan] = (planCounts[plan] || 0) + 1;
    });
    
    return Object.entries(planCounts).map(([name, count]) => ({
      name,
      count,
      percentage: sessions.length > 0 ? ((count / sessions.length) * 100).toFixed(1) : 0
    }));
  };

  const calculateSourceAnalytics = (sessions) => {
    // Simulate traffic sources
    const sources = ['Direct', 'Google Search', 'Facebook', 'Instagram', 'WhatsApp', 'Email Marketing'];
    const sourceCounts = {};
    
    sessions.forEach(session => {
      const source = sources[Math.floor(Math.random() * sources.length)];
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    
    return Object.entries(sourceCounts).map(([name, count]) => ({
      name,
      count,
      percentage: sessions.length > 0 ? ((count / sessions.length) * 100).toFixed(1) : 0
    }));
  };

  const calculateDeviceAnalytics = (sessions) => {
    // Simulate device distribution
    const devices = ['Mobile', 'Desktop', 'Tablet'];
    const deviceCounts = {};
    
    sessions.forEach(session => {
      const device = devices[Math.floor(Math.random() * devices.length)];
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    
    return Object.entries(deviceCounts).map(([name, count]) => ({
      name,
      count,
      percentage: sessions.length > 0 ? ((count / sessions.length) * 100).toFixed(1) : 0
    }));
  };

  const calculateLocationData = (sessions) => {
    // Simulate location data
    const locations = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang'];
    const locationCounts = {};
    
    sessions.forEach(session => {
      const location = locations[Math.floor(Math.random() * locations.length)];
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    
    return Object.entries(locationCounts).map(([name, count]) => ({
      name,
      count,
      percentage: sessions.length > 0 ? ((count / sessions.length) * 100).toFixed(1) : 0
    })).sort((a, b) => b.count - a.count);
  };

  const getDeviceIcon = (device) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getConversionRate = (current, previous) => {
    if (previous === 0) return 0;
    return ((current / previous) * 100).toFixed(1);
  };

  return (
    <div className="space-y-8">
      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Conversion Funnel
        </h3>
        
        <div className="space-y-4">
          {[
            { label: 'Visitors', count: analytics.conversionFunnel.visitors, icon: Users, color: 'blue' },
            { label: 'Form Started', count: analytics.conversionFunnel.formStarted, icon: Users, color: 'green' },
            { label: 'Form Completed', count: analytics.conversionFunnel.formCompleted, icon: Users, color: 'yellow' },
            { label: 'Payment Started', count: analytics.conversionFunnel.paymentStarted, icon: ShoppingCart, color: 'orange' },
            { label: 'Completed', count: analytics.conversionFunnel.completed, icon: DollarSign, color: 'purple' }
          ].map((step, index, array) => {
            const conversionRate = index > 0 ? getConversionRate(step.count, array[index - 1].count) : 100;
            const width = analytics.conversionFunnel.visitors > 0 ? (step.count / analytics.conversionFunnel.visitors) * 100 : 0;
            
            return (
              <div key={step.label} className="flex items-center space-x-4">
                <div className={`p-2 bg-${step.color}-500/20 rounded-lg`}>
                  <step.icon className={`w-4 h-4 text-${step.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{step.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-white">{step.count}</span>
                      <span className="text-xs text-gray-400">({conversionRate}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className={`bg-${step.color}-500 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hourly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Hourly Activity
          </h3>
          
          <div className="space-y-2">
            {analytics.hourlyData.map((hour) => (
              <div key={hour.hour} className="flex items-center space-x-3">
                <span className="text-xs text-gray-400 w-12">{hour.label}</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${analytics.hourlyData.length > 0 ? (hour.count / Math.max(...analytics.hourlyData.map(h => h.count))) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="text-xs text-white w-8">{hour.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Plan Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Plan Distribution
          </h3>
          
          <div className="space-y-3">
            {analytics.planDistribution.map((plan, index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
              const color = colors[index % colors.length];
              
              return (
                <div key={plan.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${color} rounded-full`} />
                    <span className="text-sm text-gray-300">{plan.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-white">{plan.count}</span>
                    <span className="text-xs text-gray-400">({plan.percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Traffic Sources
          </h3>
          
          <div className="space-y-3">
            {analytics.sourceAnalytics.map((source, index) => {
              const colors = ['bg-cyan-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-blue-500'];
              const color = colors[index % colors.length];
              
              return (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${color} rounded-full`} />
                    <span className="text-sm text-gray-300">{source.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-white">{source.count}</span>
                    <span className="text-xs text-gray-400">({source.percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Device Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Device Analytics
          </h3>
          
          <div className="space-y-4">
            {analytics.deviceAnalytics.map((device) => (
              <div key={device.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-700 rounded-lg">
                    {getDeviceIcon(device.name)}
                  </div>
                  <span className="text-sm text-gray-300">{device.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-white">{device.count}</span>
                  <span className="text-xs text-gray-400">({device.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Location Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800 rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Geographic Distribution
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.locationData.map((location, index) => (
            <div key={location.name} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span className="text-sm text-gray-300">{location.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-white">{location.count}</span>
                <span className="text-xs text-gray-400">({location.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;
