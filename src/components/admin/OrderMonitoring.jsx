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
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderMonitoring = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    activeCustomers: 0,
    pendingOrders: 0,
    completedToday: 0,
    totalRevenue: 0
  });

  // Monitor active sessions dan orders
  useEffect(() => {
    const monitorOrders = () => {
      console.log('🔍 Monitoring orders...');
      
      // Get data dari localStorage
      const orders = [];
      const sessions = [];
      const recentNotifications = [];
      
      // Scan localStorage untuk active sessions
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Monitor payment sessions
        if (key && key.startsWith('payment_session_')) {
          try {
            const sessionData = JSON.parse(localStorage.getItem(key));
            const now = Date.now();
            const sessionAge = now - sessionData.timestamp;
            
            // Session aktif dalam 30 menit terakhir
            if (sessionAge < 30 * 60 * 1000) {
              sessions.push({
                id: key,
                ...sessionData,
                age: sessionAge,
                status: sessionAge < 5 * 60 * 1000 ? 'active' : 'idle'
              });
            } else {
              // Remove old sessions
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
        
        // Monitor notifications (dengan debug logging)
        if (key && key.startsWith('notification_')) {
          try {
            const notificationData = JSON.parse(localStorage.getItem(key));
            const notificationAge = now - notificationData.timestamp;
            
            console.log('🔔 Found notification:', key, 'Age:', Math.floor(notificationAge / 1000 / 60), 'minutes');
            
            // Ambil notifikasi dalam 24 jam terakhir (lebih longgar untuk testing)
            if (notificationAge < 24 * 60 * 60 * 1000) {
              recentNotifications.push(notificationData);
              console.log('✅ Notification added:', notificationData.message);
            } else {
              console.log('❌ Notification too old, removing:', key);
              localStorage.removeItem(key);
            }
          } catch (error) {
            console.error('Error parsing notification data:', error);
            localStorage.removeItem(key);
          }
        }
        
        // Monitor activities (dengan debug logging)
        if (key && key.startsWith('activity_')) {
          try {
            const activityData = JSON.parse(localStorage.getItem(key));
            const activityAge = now - activityData.timestamp;
            
            console.log('📋 Found activity:', key, 'Type:', activityData.type, 'Age:', Math.floor(activityAge / 1000 / 60), 'minutes');
            
            // Ambil activity dalam 12 jam terakhir
            if (activityAge < 12 * 60 * 60 * 1000) {
              // Convert semua activity to notification (tidak filter type)
              const notification = {
                id: activityData.timestamp || Date.now(),
                type: activityData.type || 'activity',
                message: generateNotificationMessage(activityData),
                timestamp: activityData.timestamp || Date.now(),
                data: activityData
              };
              recentNotifications.push(notification);
              console.log('✅ Activity converted to notification:', notification.message);
            } else {
              console.log('❌ Activity too old, removing:', key);
              localStorage.removeItem(key);
            }
          } catch (error) {
            console.error('Error parsing activity data:', error);
            localStorage.removeItem(key);
          }
        }
      }
      
      console.log('📊 Found sessions:', sessions.length);
      console.log('📊 Found orders:', orders.length);
      console.log('📊 Found notifications:', recentNotifications.length);
      
      setActiveOrders(sessions);
      
      // Sort notifications by timestamp (newest first) and take last 5 (reduced from 10)
      const sortedNotifications = recentNotifications
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5); // Reduced to 5 notifications
      
      setNotifications(sortedNotifications);
      
      // Update statistics
      const todayOrders = orders.filter(o => isToday(o.timestamp));
      setStats({
        activeCustomers: sessions.filter(s => s.status === 'active').length,
        pendingOrders: sessions.length,
        completedToday: todayOrders.filter(o => o.status === 'completed').length,
        totalRevenue: todayOrders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + (o.amount || 0), 0)
      });
    };

    // Monitor setiap 5 detik untuk testing
    const interval = setInterval(monitorOrders, 5000);
    monitorOrders(); // Initial load
    
    return () => clearInterval(interval);
  }, []);

  // Generate notification message from activity data
  const generateNotificationMessage = (activityData) => {
    const clinicName = activityData.customerInfo?.clinicName || 'Unknown Clinic';
    const planName = activityData.plan?.name || 'Unknown Plan';
    
    switch (activityData.type) {
      case 'new_customer':
        return `🆕 Customer baru: ${clinicName} mulai memesan`;
      case 'step_progress':
        return `📈 ${clinicName} pindah ke step ${activityData.step}`;
      case 'payment_method_selected':
        return `💳 ${clinicName} pilih metode pembayaran`;
      case 'order_completed':
        return `✅ ${clinicName} berhasil memesan ${planName}`;
      default:
        return `📋 ${clinicName} - ${activityData.activity || 'aktivitas baru'}`;
    }
  };

  // Track customer activity
  const trackCustomerActivity = (activity) => {
    const timestamp = Date.now();
    const sessionId = `payment_session_${timestamp}`;
    
    const sessionData = {
      timestamp,
      activity,
      customerInfo: activity.customerInfo || {},
      plan: activity.plan || {},
      step: activity.step || 1,
      status: 'active'
    };
    
    localStorage.setItem(sessionId, JSON.stringify(sessionData));
    
    // Add notification
    const notification = {
      id: timestamp,
      type: 'new_customer',
      message: `Customer baru: ${activity.customerInfo?.clinicName || 'Unknown'} sedang memesan`,
      timestamp,
      data: sessionData
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
    
    // Play notification sound (optional)
    playNotificationSound();
  };

  const playNotificationSound = () => {
    // Create audio notification
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore errors
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

  // Expose function untuk dipanggil dari payment flow
  window.trackCustomerActivity = trackCustomerActivity;

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Order Monitoring</h1>
            <p className="text-gray-400">Monitor customer yang sedang memesan secara real-time</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm">Live Monitoring</span>
            </div>
            <Button
              onClick={() => {
                // Create test customer data
                const testSessionId = `payment_session_${Date.now()}`;
                const testData = {
                  id: testSessionId,
                  timestamp: Date.now(),
                  customerInfo: {
                    clinicName: 'Test Klinik Demo',
                    contactPerson: 'Dr. Test Demo',
                    email: 'test@demo.com',
                    phone: '081234567890'
                  },
                  plan: { name: 'Professional' },
                  step: 2,
                  status: 'active',
                  activity: 'test_data'
                };
                localStorage.setItem(testSessionId, JSON.stringify(testData));
                
                // Create test notification
                const testNotificationId = `notification_${Date.now()}`;
                const testNotification = {
                  id: Date.now(),
                  type: 'new_customer',
                  message: `🆕 Customer baru: ${testData.customerInfo.clinicName} mulai memesan`,
                  timestamp: Date.now(),
                  data: testData
                };
                localStorage.setItem(testNotificationId, JSON.stringify(testNotification));
                
                // Create test activity
                const testActivityId = `activity_${Date.now() + 1}`;
                const testActivity = {
                  type: 'new_customer',
                  customerInfo: testData.customerInfo,
                  plan: testData.plan,
                  timestamp: Date.now(),
                  activity: 'form_completed'
                };
                localStorage.setItem(testActivityId, JSON.stringify(testActivity));
                
                console.log('🧪 Test data created:', testData);
                console.log('🧪 Test notification created:', testNotification);
                console.log('🧪 Test activity created:', testActivity);
                window.location.reload();
              }}
              variant="outline"
              className="border-yellow-500 text-yellow-400"
            >
              Add Test Data
            </Button>
            <Button
              onClick={() => {
                console.log('🔍 DEBUG: Checking localStorage...');
                const allKeys = Object.keys(localStorage);
                console.log('📋 All localStorage keys:', allKeys);
                
                allKeys.forEach(key => {
                  if (key.startsWith('payment_session_') || 
                      key.startsWith('notification_') || 
                      key.startsWith('activity_')) {
                    try {
                      const data = JSON.parse(localStorage.getItem(key));
                      console.log(`📊 ${key}:`, data);
                    } catch (error) {
                      console.log(`❌ Error parsing ${key}:`, error);
                    }
                  }
                });
              }}
              variant="outline"
              className="border-blue-500 text-blue-400"
            >
              Debug Storage
            </Button>
            <Button
              onClick={() => {
                // Force create notification
                const testNotificationId = `notification_${Date.now()}`;
                const testNotification = {
                  id: Date.now(),
                  type: 'test',
                  message: `🧪 Test notification - ${new Date().toLocaleTimeString()}`,
                  timestamp: Date.now(),
                  data: { test: true }
                };
                localStorage.setItem(testNotificationId, JSON.stringify(testNotification));
                console.log('🔔 Force notification created:', testNotification);
                
                // Trigger refresh
                setTimeout(() => window.location.reload(), 500);
              }}
              variant="outline"
              className="border-green-500 text-green-400"
            >
              Force Notification
            </Button>
            <Button
              onClick={() => {
                // Clear only old notifications (older than 1 hour)
                const now = Date.now();
                Object.keys(localStorage).forEach(key => {
                  if (key.startsWith('notification_') || key.startsWith('activity_')) {
                    try {
                      const data = JSON.parse(localStorage.getItem(key));
                      const age = now - data.timestamp;
                      if (age > 60 * 60 * 1000) { // 1 hour
                        localStorage.removeItem(key);
                      }
                    } catch (error) {
                      localStorage.removeItem(key);
                    }
                  }
                });
                console.log('🧹 Old notifications cleared');
                window.location.reload();
              }}
              variant="outline"
              className="border-orange-500 text-orange-400"
            >
              Clear Old Notif
            </Button>
            <Button
              onClick={() => {
                if (confirm('Yakin ingin menghapus semua data? Ini akan menghapus semua customer dan notifikasi.')) {
                  Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('payment_session_') || 
                        key.startsWith('order_') || 
                        key.startsWith('notification_') || 
                        key.startsWith('activity_')) {
                      localStorage.removeItem(key);
                    }
                  });
                  console.log('🧹 All data cleared');
                  window.location.reload();
                }
              }}
              variant="outline"
              className="border-red-500 text-red-400"
            >
              Clear All
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Customer Aktif</p>
                <p className="text-2xl font-bold text-white">{stats.activeCustomers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Pending Orders</p>
                <p className="text-2xl font-bold text-white">{stats.pendingOrders}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Selesai Hari Ini</p>
                <p className="text-2xl font-bold text-white">{stats.completedToday}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-cyan-500/20 rounded-lg">
                <Bell className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Revenue Hari Ini</p>
                <p className="text-2xl font-bold text-white">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(stats.totalRevenue)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Orders */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800 rounded-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Customer Sedang Memesan
                </h2>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {activeOrders.length > 0 ? (
                  <div className="divide-y divide-slate-700">
                    {activeOrders.map((order, index) => (
                      <div key={order.id} className="p-6 hover:bg-slate-700/50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status === 'active' ? 'Aktif' : 'Idle'}
                              </div>
                              <span className="text-sm text-gray-400">
                                {formatTime(order.timestamp)}
                              </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-white mt-2">
                              {order.customerInfo?.clinicName || 'Klinik Tidak Diketahui'}
                            </h3>
                            
                            <div className="text-sm text-gray-300 space-y-1 mt-2">
                              <p>👤 {order.customerInfo?.contactPerson || 'N/A'}</p>
                              <p>📧 {order.customerInfo?.email || 'N/A'}</p>
                              <p>📱 {order.customerInfo?.phone || 'N/A'}</p>
                              <p>📦 {order.plan?.name || 'Paket belum dipilih'}</p>
                              <p>⏱️ Aktif selama: {formatDuration(order.age)}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            <Button
                              onClick={() => contactCustomer(order)}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              disabled={!order.customerInfo?.phone}
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              WhatsApp
                            </Button>
                            
                            <Button
                              onClick={() => window.open(`mailto:${order.customerInfo?.email}`)}
                              size="sm"
                              variant="outline"
                              className="border-cyan-400 text-cyan-400"
                              disabled={!order.customerInfo?.email}
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              Email
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Tidak ada customer yang sedang memesan</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recent Notifications */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800 rounded-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifikasi Terbaru
                </h2>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-slate-700">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <Bell className="w-4 h-4 text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Belum ada notifikasi</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderMonitoring;
