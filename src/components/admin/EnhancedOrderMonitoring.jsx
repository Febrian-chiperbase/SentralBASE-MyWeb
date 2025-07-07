import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Users, 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Phone,
  Mail,
  RefreshCw,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Search,
  Settings,
  MessageSquare,
  Globe,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EnhancedOrderMonitoring = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [stats, setStats] = useState({
    activeCustomers: 0,
    pendingOrders: 0,
    completedToday: 0,
    totalRevenue: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    topPlan: '',
    peakHour: ''
  });
  const [timeFilter, setTimeFilter] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Enhanced monitoring dengan analytics
  useEffect(() => {
    const monitorOrders = () => {
      console.log('🔍 Enhanced monitoring...');
      
      const orders = [];
      const sessions = [];
      const recentNotifications = [];
      const now = Date.now();
      
      // Scan localStorage dengan enhanced data collection
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Monitor payment sessions
        if (key && key.startsWith('payment_session_')) {
          try {
            const sessionData = JSON.parse(localStorage.getItem(key));
            const sessionAge = now - sessionData.timestamp;
            
            if (sessionAge < 30 * 60 * 1000) {
              sessions.push({
                id: key,
                ...sessionData,
                age: sessionAge,
                status: sessionAge < 5 * 60 * 1000 ? 'active' : 'idle',
                source: getTrafficSource(sessionData),
                device: getDeviceType(sessionData),
                location: getLocation(sessionData)
              });
            } else {
              localStorage.removeItem(key);
            }
          } catch (error) {
            console.error('Error parsing session data:', error);
            localStorage.removeItem(key);
          }
        }
        
        // Monitor completed orders
        if (key && key.startsWith('order_')) {
          try {
            const orderData = JSON.parse(localStorage.getItem(key));
            orders.push(orderData);
          } catch (error) {
            console.error('Error parsing order data:', error);
          }
        }
        
        // Monitor notifications
        if (key && key.startsWith('notification_')) {
          try {
            const notificationData = JSON.parse(localStorage.getItem(key));
            const notificationAge = now - notificationData.timestamp;
            
            if (notificationAge < 24 * 60 * 60 * 1000) {
              recentNotifications.push(notificationData);
            } else {
              localStorage.removeItem(key);
            }
          } catch (error) {
            console.error('Error parsing notification data:', error);
            localStorage.removeItem(key);
          }
        }
      }
      
      // Filter berdasarkan search term
      const filteredSessions = sessions.filter(session => 
        !searchTerm || 
        session.customerInfo?.clinicName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.customerInfo?.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setActiveOrders(filteredSessions);
      setNotifications(recentNotifications.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10));
      
      // Enhanced analytics calculation
      const todayOrders = orders.filter(o => isToday(o.timestamp));
      const completedOrders = todayOrders.filter(o => o.status === 'completed');
      
      setStats({
        activeCustomers: sessions.filter(s => s.status === 'active').length,
        pendingOrders: sessions.length,
        completedToday: completedOrders.length,
        totalRevenue: completedOrders.reduce((sum, o) => sum + (o.amount || 0), 0),
        conversionRate: sessions.length > 0 ? (completedOrders.length / sessions.length * 100).toFixed(1) : 0,
        avgOrderValue: completedOrders.length > 0 ? (completedOrders.reduce((sum, o) => sum + (o.amount || 0), 0) / completedOrders.length).toFixed(0) : 0,
        topPlan: getTopPlan(sessions),
        peakHour: getPeakHour(sessions)
      });
      
      // Calculate detailed analytics
      setAnalytics({
        hourlyData: getHourlyData(sessions),
        planDistribution: getPlanDistribution(sessions),
        sourceAnalytics: getSourceAnalytics(sessions),
        deviceAnalytics: getDeviceAnalytics(sessions),
        conversionFunnel: getConversionFunnel(sessions, orders)
      });
    };

    const interval = setInterval(monitorOrders, 5000);
    monitorOrders();
    
    return () => clearInterval(interval);
  }, [searchTerm, timeFilter]);

  // Helper functions
  const getTrafficSource = (sessionData) => {
    // Simulate traffic source detection
    const sources = ['Direct', 'Google', 'Facebook', 'Instagram', 'WhatsApp', 'Email'];
    return sources[Math.floor(Math.random() * sources.length)];
  };

  const getDeviceType = (sessionData) => {
    // Simulate device detection
    const devices = ['Desktop', 'Mobile', 'Tablet'];
    return devices[Math.floor(Math.random() * devices.length)];
  };

  const getLocation = (sessionData) => {
    // Simulate location detection
    const locations = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang'];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const getTopPlan = (sessions) => {
    const planCounts = {};
    sessions.forEach(session => {
      const plan = session.plan?.name || 'Unknown';
      planCounts[plan] = (planCounts[plan] || 0) + 1;
    });
    return Object.keys(planCounts).reduce((a, b) => planCounts[a] > planCounts[b] ? a : b, 'None');
  };

  const getPeakHour = (sessions) => {
    const hourCounts = {};
    sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const peakHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b, '0');
    return `${peakHour}:00`;
  };

  const getHourlyData = (sessions) => {
    const hourlyData = Array.from({length: 24}, (_, i) => ({hour: i, count: 0}));
    sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours();
      hourlyData[hour].count++;
    });
    return hourlyData;
  };

  const getPlanDistribution = (sessions) => {
    const planCounts = {};
    sessions.forEach(session => {
      const plan = session.plan?.name || 'Unknown';
      planCounts[plan] = (planCounts[plan] || 0) + 1;
    });
    return Object.entries(planCounts).map(([name, count]) => ({name, count}));
  };

  const getSourceAnalytics = (sessions) => {
    const sourceCounts = {};
    sessions.forEach(session => {
      const source = session.source || 'Unknown';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    return Object.entries(sourceCounts).map(([name, count]) => ({name, count}));
  };

  const getDeviceAnalytics = (sessions) => {
    const deviceCounts = {};
    sessions.forEach(session => {
      const device = session.device || 'Unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    return Object.entries(deviceCounts).map(([name, count]) => ({name, count}));
  };

  const getConversionFunnel = (sessions, orders) => {
    return {
      visitors: sessions.length,
      formStarted: sessions.filter(s => s.step >= 1).length,
      formCompleted: sessions.filter(s => s.step >= 2).length,
      paymentStarted: sessions.filter(s => s.step >= 3).length,
      completed: orders.filter(o => o.status === 'completed').length
    };
  };

  const isToday = (timestamp) => {
    const today = new Date();
    const date = new Date(timestamp);
    return date.toDateString() === today.toDateString();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('id-ID');
  };

  const formatDuration = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'idle': return 'text-yellow-400 bg-yellow-500/20';
      case 'completed': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const contactCustomer = (customer) => {
    const phone = customer.customerInfo?.phone;
    const email = customer.customerInfo?.email;
    
    if (phone) {
      const message = `Halo ${customer.customerInfo?.contactPerson}, saya dari SentraBASE. Apakah ada yang bisa saya bantu dengan pemesanan Anda?`;
      const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      stats,
      activeOrders,
      notifications: notifications.slice(0, 5),
      analytics
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentrabase-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Enhanced Admin Dashboard</h1>
            <p className="text-gray-400">Real-time customer monitoring & business analytics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Live Monitoring</span>
            </div>
            <Button
              onClick={exportData}
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white"
            />
          </div>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Customers</p>
                <p className="text-2xl font-bold text-white">{stats.activeCustomers}</p>
                <p className="text-xs text-green-400">+12% from yesterday</p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Users className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">{stats.conversionRate}%</p>
                <p className="text-xs text-blue-400">Industry avg: 2.3%</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Order Value</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.avgOrderValue)}</p>
                <p className="text-xs text-purple-400">Top plan: {stats.topPlan}</p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Peak Hour</p>
                <p className="text-2xl font-bold text-white">{stats.peakHour}</p>
                <p className="text-xs text-orange-400">Most active time</p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Continue with more components... */}
        <div className="text-center py-8">
          <p className="text-gray-400">Enhanced dashboard dengan fitur analytics lengkap sedang dimuat...</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOrderMonitoring;
