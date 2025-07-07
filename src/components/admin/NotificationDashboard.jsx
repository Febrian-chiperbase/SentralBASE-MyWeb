import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MessageCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Send,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationService from '@/services/notificationService';

const NotificationDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    emailSuccess: 0,
    whatsappSuccess: 0,
    bothSuccess: 0,
    bothFailed: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    setLoading(true);
    
    // Load notifications from localStorage (in production, from database)
    const notificationData = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('notification_')) {
        const data = JSON.parse(localStorage.getItem(key));
        notificationData.push(data);
      }
    }
    
    // Sort by timestamp (newest first)
    notificationData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setNotifications(notificationData);
    calculateStats(notificationData);
    setLoading(false);
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      emailSuccess: data.filter(n => n.emailSuccess).length,
      whatsappSuccess: data.filter(n => n.whatsappSuccess).length,
      bothSuccess: data.filter(n => n.emailSuccess && n.whatsappSuccess).length,
      bothFailed: data.filter(n => !n.emailSuccess && !n.whatsappSuccess).length
    };
    
    setStats(stats);
  };

  const retryNotification = async (transactionId) => {
    try {
      setLoading(true);
      const result = await NotificationService.retryFailedNotifications(transactionId);
      
      if (result.email.success || result.whatsapp.success) {
        alert('Retry berhasil!');
        loadNotifications();
      } else {
        alert('Retry gagal. Silakan coba lagi.');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendManualNotification = async (notification) => {
    try {
      setLoading(true);
      
      // Reconstruct payment data
      const paymentData = {
        transactionId: notification.transactionId,
        customerInfo: {
          email: notification.customerEmail,
          phone: notification.customerPhone,
          clinicName: 'Sample Clinic', // In production, get from database
          contactPerson: 'Dr. Sample'
        },
        plan: { name: 'Professional', subtitle: 'Untuk Klinik Berkembang' },
        pricing: { basePrice: 3000000, tax: 330000, total: 3330000 },
        paymentMethod: { name: 'BCA Virtual Account' }
      };
      
      const result = await NotificationService.sendPaymentConfirmation(paymentData);
      
      if (result.success) {
        alert('Notifikasi manual berhasil dikirim!');
        loadNotifications();
      } else {
        alert('Gagal mengirim notifikasi manual.');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('id-ID');
  };

  const getStatusIcon = (emailSuccess, whatsappSuccess) => {
    if (emailSuccess && whatsappSuccess) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (emailSuccess || whatsappSuccess) {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusText = (emailSuccess, whatsappSuccess) => {
    if (emailSuccess && whatsappSuccess) {
      return 'Semua berhasil';
    } else if (emailSuccess) {
      return 'Email berhasil, WhatsApp gagal';
    } else if (whatsappSuccess) {
      return 'WhatsApp berhasil, Email gagal';
    } else {
      return 'Semua gagal';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Notification Dashboard</h1>
            <p className="text-gray-400">Monitor email dan WhatsApp notifications</p>
          </div>
          <Button
            onClick={loadNotifications}
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Send className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
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
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Mail className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Email Success</p>
                <p className="text-2xl font-bold text-white">{stats.emailSuccess}</p>
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
              <div className="p-3 bg-green-500/20 rounded-lg">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">WhatsApp Success</p>
                <p className="text-2xl font-bold text-white">{stats.whatsappSuccess}</p>
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
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Both Success</p>
                <p className="text-2xl font-bold text-white">{stats.bothSuccess}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-400">Both Failed</p>
                <p className="text-2xl font-bold text-white">{stats.bothFailed}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Notifications Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 rounded-lg overflow-hidden"
        >
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Recent Notifications</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    WhatsApp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {notifications.map((notification, index) => (
                  <tr key={index} className="hover:bg-slate-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {notification.transactionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-white">{notification.customerEmail}</div>
                        <div className="text-sm text-gray-400">{notification.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {notification.emailSuccess ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                        )}
                        <span className="text-sm text-gray-300">
                          {notification.emailService || 'Failed'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {notification.whatsappSuccess ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                        )}
                        <span className="text-sm text-gray-300">
                          {notification.whatsappService || 'Failed'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(notification.emailSuccess, notification.whatsappSuccess)}
                        <span className="ml-2 text-sm text-gray-300">
                          {getStatusText(notification.emailSuccess, notification.whatsappSuccess)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(notification.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        {(!notification.emailSuccess || !notification.whatsappSuccess) && (
                          <Button
                            onClick={() => retryNotification(notification.transactionId)}
                            size="sm"
                            className="bg-yellow-500 hover:bg-yellow-600"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Retry
                          </Button>
                        )}
                        <Button
                          onClick={() => sendManualNotification(notification)}
                          size="sm"
                          variant="outline"
                          className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900"
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Manual
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {notifications.length === 0 && (
            <div className="p-8 text-center">
              <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Belum ada notifikasi</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationDashboard;
