// Notification Manager untuk monitoring customer orders
class NotificationManager {
  constructor() {
    this.isEnabled = false;
    this.subscribers = [];
    this.init();
  }

  async init() {
    // Request notification permission
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.isEnabled = permission === 'granted';
      console.log('🔔 Browser notifications:', this.isEnabled ? 'enabled' : 'disabled');
    }
  }

  // Subscribe to notifications
  subscribe(callback) {
    this.subscribers.push(callback);
  }

  // Unsubscribe from notifications
  unsubscribe(callback) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  // Notify all subscribers
  notify(data) {
    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Notification callback error:', error);
      }
    });
  }

  // Show browser notification
  showBrowserNotification(title, options = {}) {
    if (!this.isEnabled) return;

    const notification = new Notification(title, {
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      ...options
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }

  // Track new customer
  trackNewCustomer(customerData) {
    const notification = {
      id: Date.now(),
      type: 'new_customer',
      title: 'Customer Baru!',
      message: `${customerData.clinicName} sedang memesan`,
      data: customerData,
      timestamp: Date.now()
    };

    // Show browser notification
    this.showBrowserNotification(notification.title, {
      body: notification.message,
      tag: 'new-customer',
      requireInteraction: true
    });

    // Notify subscribers
    this.notify(notification);

    // Store in localStorage
    this.storeNotification(notification);

    return notification;
  }

  // Track customer progress
  trackCustomerProgress(customerData, step) {
    const notification = {
      id: Date.now(),
      type: 'customer_progress',
      title: 'Customer Progress',
      message: `${customerData.clinicName} di step ${step}`,
      data: { ...customerData, step },
      timestamp: Date.now()
    };

    // Only show browser notification for important steps
    if (step === 3) { // Confirmation step
      this.showBrowserNotification('Customer Hampir Selesai!', {
        body: `${customerData.clinicName} di step konfirmasi`,
        tag: 'customer-progress'
      });
    }

    this.notify(notification);
    this.storeNotification(notification);

    return notification;
  }

  // Track completed order
  trackCompletedOrder(orderData) {
    const notification = {
      id: Date.now(),
      type: 'order_completed',
      title: 'Order Selesai! 🎉',
      message: `${orderData.customerInfo.clinicName} berhasil memesan ${orderData.plan.name}`,
      data: orderData,
      timestamp: Date.now()
    };

    this.showBrowserNotification(notification.title, {
      body: notification.message,
      tag: 'order-completed',
      requireInteraction: true
    });

    this.notify(notification);
    this.storeNotification(notification);

    return notification;
  }

  // Store notification in localStorage
  storeNotification(notification) {
    const key = `notification_${notification.id}`;
    localStorage.setItem(key, JSON.stringify(notification));

    // Clean old notifications (keep last 50)
    this.cleanOldNotifications();
  }

  // Clean old notifications
  cleanOldNotifications() {
    const notifications = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('notification_')) {
        const data = JSON.parse(localStorage.getItem(key));
        notifications.push({ key, ...data });
      }
    }

    // Sort by timestamp and keep only last 50
    notifications.sort((a, b) => b.timestamp - a.timestamp);
    
    if (notifications.length > 50) {
      const toDelete = notifications.slice(50);
      toDelete.forEach(item => {
        localStorage.removeItem(item.key);
      });
    }
  }

  // Get recent notifications
  getRecentNotifications(limit = 10) {
    const notifications = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('notification_')) {
        const data = JSON.parse(localStorage.getItem(key));
        notifications.push(data);
      }
    }

    return notifications
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Play sound notification
  playSound(type = 'default') {
    const sounds = {
      default: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT',
      success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT'
    };

    try {
      const audio = new Audio(sounds[type] || sounds.default);
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignore errors
    } catch (error) {
      console.log('Sound notification failed:', error);
    }
  }
}

// Create singleton instance
const notificationManager = new NotificationManager();

// Export for global use
window.notificationManager = notificationManager;

export default notificationManager;
