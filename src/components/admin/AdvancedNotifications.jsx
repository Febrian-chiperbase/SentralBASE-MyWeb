import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  MessageSquare, 
  Settings, 
  Phone,
  Calendar,
  CheckSquare,
  Users,
  Zap,
  AlertTriangle,
  Clock,
  Send,
  History,
  TestTube,
  Smartphone,
  Check,
  X,
  Power,
  Mail,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// WhatsApp Service (inline for now)
class WhatsAppService {
  constructor() {
    this.adminPhone = '+6282132115008';
    this.isEnabled = true;
  }

  async sendAdminNotification(type, title, message, data = {}) {
    const timestamp = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta'
    });
    
    const formattedMessage = this.formatNotificationMessage(type, title, message, timestamp, data);
    const whatsappUrl = `https://wa.me/6282132115008?text=${encodeURIComponent(formattedMessage)}`;
    
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
    
    return true;
  }

  formatNotificationMessage(type, title, message, timestamp, data) {
    const emoji = this.getNotificationEmoji(type);
    let formattedMessage = `${emoji} *SentraBASE Notification*\n\n`;
    formattedMessage += `📋 *${title}*\n`;
    formattedMessage += `${message}\n\n`;
    formattedMessage += `🕐 ${timestamp}\n\n`;
    formattedMessage += `🚀 *SentraBASE Admin Dashboard*`;
    return formattedMessage;
  }

  getNotificationEmoji(type) {
    const emojis = {
      task: '✅', calendar: '📅', customer: '👥', workflow: '⚡',
      team: '👨‍💼', system: '🔧', alert: '🚨', test: '🧪'
    };
    return emojis[type] || '📢';
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    localStorage.setItem('whatsapp_notifications_enabled', enabled.toString());
  }

  isNotificationsEnabled() {
    const stored = localStorage.getItem('whatsapp_notifications_enabled');
    return stored !== null ? stored === 'true' : this.isEnabled;
  }

  getNotificationHistory() {
    try {
      return JSON.parse(localStorage.getItem('whatsapp_notifications') || '[]');
    } catch {
      return [];
    }
  }
}

const whatsappService = new WhatsAppService();

// Email Service (inline)
class EmailService {
  constructor() {
    this.adminEmail = 'fery10febrian@gmail.com';
    this.isEnabled = true;
  }

  async sendAdminNotification(type, title, message, data = {}) {
    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const emailData = this.formatEmailNotification(type, title, message, timestamp, data);
    const mailtoUrl = `mailto:${this.adminEmail}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
    
    if (typeof window !== 'undefined') {
      window.open(mailtoUrl, '_blank');
    }
    
    return true;
  }

  formatEmailNotification(type, title, message, timestamp, data) {
    const subject = `[SentraBASE] ${title}`;
    let body = `SentraBASE Admin Notification\n================================\n\n`;
    body += `Type: ${type.toUpperCase()}\nTitle: ${title}\nMessage: ${message}\n\n`;
    body += `Timestamp: ${timestamp}\nTimezone: Asia/Jakarta (WIB)\n\n`;
    
    // Add specific data
    if (data.assignee) body += `Assigned to: ${data.assignee}\n`;
    if (data.dueDate) body += `Due Date: ${data.dueDate}\n`;
    if (data.priority) body += `Priority: ${data.priority}\n`;
    if (data.customerName) body += `Customer: ${data.customerName}\n`;
    if (data.company) body += `Company: ${data.company}\n`;
    
    body += `\n================================\nSentraBASE Admin Dashboard\nAdmin Email: ${this.adminEmail}`;
    return { subject, body };
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    localStorage.setItem('email_notifications_enabled', enabled.toString());
  }

  isEmailEnabled() {
    const stored = localStorage.getItem('email_notifications_enabled');
    return stored !== null ? stored === 'true' : this.isEnabled;
  }

  getEmailHistory() {
    try {
      return JSON.parse(localStorage.getItem('email_notifications') || '[]');
    } catch {
      return [];
    }
  }
}

const emailService = new EmailService();

const AdvancedNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState(true);
  const [isEmailEnabled, setIsEmailEnabled] = useState(true);
  const [testMessage, setTestMessage] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    success: 0
  });

  useEffect(() => {
    loadNotificationData();
    setupNotificationListeners();
  }, []);

  const loadNotificationData = () => {
    // Load notification history
    const whatsappHistory = whatsappService.getNotificationHistory();
    const emailHistory = emailService.getEmailHistory();
    const combinedHistory = [...whatsappHistory, ...emailHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setNotificationHistory(combinedHistory);

    // Load enabled states
    const whatsappEnabled = whatsappService.isNotificationsEnabled();
    const emailEnabled = emailService.isEmailEnabled();
    setIsWhatsAppEnabled(whatsappEnabled);
    setIsEmailEnabled(emailEnabled);

    // Calculate stats
    calculateStats(combinedHistory);

    // Load recent notifications
    loadRecentNotifications();
  };

  const calculateStats = (history) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayCount = history.filter(n => new Date(n.timestamp) >= today).length;
    const weekCount = history.filter(n => new Date(n.timestamp) >= thisWeek).length;

    setStats({
      total: history.length,
      today: todayCount,
      thisWeek: weekCount,
      success: Math.round((history.length / Math.max(history.length, 1)) * 100)
    });
  };

  const loadRecentNotifications = () => {
    // Simulate recent system notifications
    const recentNotifications = [
      {
        id: 1,
        type: 'task',
        title: 'Task Overdue',
        message: 'Follow up with RS Jakarta is overdue',
        timestamp: Date.now() - 300000, // 5 minutes ago
        priority: 'high',
        read: false
      },
      {
        id: 2,
        type: 'calendar',
        title: 'Upcoming Meeting',
        message: 'Demo presentation in 30 minutes',
        timestamp: Date.now() - 600000, // 10 minutes ago
        priority: 'medium',
        read: false
      },
      {
        id: 3,
        type: 'customer',
        title: 'New Customer',
        message: 'Dr. Ahmad from RS Jakarta registered',
        timestamp: Date.now() - 900000, // 15 minutes ago
        priority: 'low',
        read: true
      },
      {
        id: 4,
        type: 'workflow',
        title: 'Workflow Completed',
        message: 'Welcome sequence completed for new customer',
        timestamp: Date.now() - 1200000, // 20 minutes ago
        priority: 'low',
        read: true
      },
      {
        id: 5,
        type: 'team',
        title: 'Team Alert',
        message: 'Sarah Sales Manager workload is high (85%)',
        timestamp: Date.now() - 1800000, // 30 minutes ago
        priority: 'medium',
        read: true
      }
    ];

    setNotifications(recentNotifications);
  };

  const setupNotificationListeners = () => {
    // Listen for new notifications from other components
    const handleNewNotification = (event) => {
      const { type, title, message, data } = event.detail;
      
      // Send WhatsApp notification
      if (isEnabled) {
        whatsappService.sendAdminNotification(type, title, message, data);
      }

      // Add to local notifications
      const newNotification = {
        id: Date.now(),
        type,
        title,
        message,
        timestamp: Date.now(),
        priority: data?.priority || 'medium',
        read: false
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    };

    window.addEventListener('sentrabase-notification', handleNewNotification);

    return () => {
      window.removeEventListener('sentrabase-notification', handleNewNotification);
    };
  };

  const toggleWhatsAppNotifications = () => {
    const newState = !isWhatsAppEnabled;
    setIsWhatsAppEnabled(newState);
    whatsappService.setEnabled(newState);
    
    if (newState) {
      whatsappService.sendSystemAlert(
        'WhatsApp Notifications Enabled',
        'WhatsApp notifications have been enabled for your admin account.'
      );
    }
  };

  const toggleEmailNotifications = () => {
    const newState = !isEmailEnabled;
    setIsEmailEnabled(newState);
    emailService.setEnabled(newState);
    
    if (newState) {
      emailService.sendSystemAlert(
        'Email Notifications Enabled',
        'Email notifications have been enabled for your admin account.'
      );
    }
  };

  const sendTestNotification = async () => {
    try {
      const message = testMessage || 'This is a test notification from SentraBASE admin dashboard.';
      
      if (isWhatsAppEnabled) {
        await whatsappService.sendAdminNotification('system', 'Test WhatsApp Notification', message, {
          test: true,
          adminPhone: '+6282132115008'
        });
      }
      
      if (isEmailEnabled) {
        await emailService.sendAdminNotification('system', 'Test Email Notification', message, {
          test: true,
          adminEmail: 'fery10febrian@gmail.com'
        });
      }
      
      setTestMessage('');
      alert(`Test notification sent!\n${isWhatsAppEnabled ? '✅ WhatsApp' : '❌ WhatsApp'}\n${isEmailEnabled ? '✅ Email' : '❌ Email'}`);
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('Failed to send test notification.');
    }
  };

  const sendNotificationToChannels = async (notification) => {
    try {
      if (isWhatsAppEnabled) {
        await whatsappService.sendAdminNotification(
          notification.type,
          notification.title,
          notification.message,
          { priority: notification.priority }
        );
      }
      
      if (isEmailEnabled) {
        await emailService.sendAdminNotification(
          notification.type,
          notification.title,
          notification.message,
          { priority: notification.priority }
        );
      }
      
      // Mark as sent
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id 
            ? { ...n, sentToChannels: true }
            : n
        )
      );
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const getNotificationIcon = (type) => {
    const icons = {
      task: CheckSquare,
      calendar: Calendar,
      customer: Users,
      workflow: Zap,
      team: Users,
      system: Settings,
      alert: AlertTriangle
    };
    return icons[type] || Bell;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-400 bg-red-500/20',
      medium: 'text-yellow-400 bg-yellow-500/20',
      low: 'text-green-400 bg-green-500/20'
    };
    return colors[priority] || colors.medium;
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Notifications</h2>
          <p className="text-gray-400">WhatsApp & Email integration for real-time alerts</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-300">+6282132115008</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">fery10febrian@gmail.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleWhatsAppNotifications}
              size="sm"
              className={`${isWhatsAppEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
            >
              {isWhatsAppEnabled ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
              WA
            </Button>
            <Button
              onClick={toggleEmailNotifications}
              size="sm"
              className={`${isEmailEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
            >
              {isEmailEnabled ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
              Email
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">WhatsApp + Email</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-green-400" />
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          delay={0.1}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Today</p>
              <p className="text-2xl font-bold text-white">{stats.today}</p>
            </div>
            <Clock className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          delay={0.2}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">This Week</p>
              <p className="text-2xl font-bold text-white">{stats.thisWeek}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          delay={0.3}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-white">{stats.success}%</p>
            </div>
            <MessageSquare className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notifications */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Notifications</h3>
            <span className="text-sm text-gray-400">{notifications.filter(n => !n.read).length} unread</span>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.read 
                      ? 'bg-slate-700 border-slate-600' 
                      : 'bg-slate-700/50 border-blue-500/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {!notification.read && (
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-xs"
                          >
                            Mark Read
                          </Button>
                        )}
                        {(isWhatsAppEnabled || isEmailEnabled) && !notification.sentToChannels && (
                          <Button
                            onClick={() => sendNotificationToChannels(notification)}
                            size="sm"
                            className="bg-purple-500 hover:bg-purple-600 text-xs"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Send Now
                          </Button>
                        )}
                        {notification.sentToChannels && (
                          <span className="text-xs text-green-400 flex items-center">
                            <Check className="w-3 h-3 mr-1" />
                            Sent
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Notification Configuration */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* WhatsApp & Email Configuration */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Notification Channels
            </h3>
            
            <div className="space-y-4">
              {/* WhatsApp Config */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  WhatsApp Number
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    value="+6282132115008"
                    readOnly
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <div className="flex items-center text-green-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Email Config */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    value="fery10febrian@gmail.com"
                    readOnly
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <div className="flex items-center text-blue-400">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Toggle Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">WhatsApp Notifications</p>
                    <p className="text-xs text-gray-400">Send to WhatsApp</p>
                  </div>
                  <Button
                    onClick={toggleWhatsAppNotifications}
                    className={`${isWhatsAppEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                  >
                    <Power className="w-4 h-4 mr-2" />
                    {isWhatsAppEnabled ? 'ON' : 'OFF'}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Email Notifications</p>
                    <p className="text-xs text-gray-400">Send to Email</p>
                  </div>
                  <Button
                    onClick={toggleEmailNotifications}
                    className={`${isEmailEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                  >
                    <Power className="w-4 h-4 mr-2" />
                    {isEmailEnabled ? 'ON' : 'OFF'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Test Notification */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TestTube className="w-5 h-5 mr-2" />
              Test Notification
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Test Message
                </label>
                <Input
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter test message (optional)"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <Button
                onClick={sendTestNotification}
                className="w-full bg-purple-500 hover:bg-purple-600"
                disabled={!isWhatsAppEnabled && !isEmailEnabled}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Test Notifications
              </Button>
              
              {!isWhatsAppEnabled && !isEmailEnabled && (
                <p className="text-xs text-yellow-400 text-center">
                  Enable at least one notification channel to send test
                </p>
              )}
              
              {(isWhatsAppEnabled || isEmailEnabled) && (
                <p className="text-xs text-gray-400 text-center">
                  Will send to: {isWhatsAppEnabled ? 'WhatsApp' : ''} {isWhatsAppEnabled && isEmailEnabled ? '& ' : ''} {isEmailEnabled ? 'Email' : ''}
                </p>
              )}
            </div>
          </div>

          {/* Notification Types */}
          <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Notification Types
            </h3>
            
            <div className="space-y-3">
              {[
                { type: 'task', name: 'Task Updates', icon: CheckSquare, desc: 'New tasks, deadlines, completions' },
                { type: 'calendar', name: 'Calendar Events', icon: Calendar, desc: 'Meetings, appointments, reminders' },
                { type: 'customer', name: 'Customer Updates', icon: Users, desc: 'New customers, status changes' },
                { type: 'workflow', name: 'Workflow Alerts', icon: Zap, desc: 'Automation triggers, completions' },
                { type: 'team', name: 'Team Notifications', icon: Users, desc: 'Team updates, workload alerts' }
              ].map(({ type, name, icon: Icon, desc }) => (
                <div key={type} className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <div className="text-green-400">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedNotifications;
