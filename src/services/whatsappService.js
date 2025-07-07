// WhatsApp Integration Service for SentraBASE
class WhatsAppService {
  constructor() {
    this.adminPhone = '+6282132115008'; // Your WhatsApp number
    this.baseUrl = 'https://wa.me/';
    this.isEnabled = true;
    this.notificationQueue = [];
    this.lastSent = {};
    this.rateLimitDelay = 2000; // 2 seconds between messages
  }

  // Format phone number for WhatsApp
  formatPhoneNumber(phone) {
    return phone.replace(/\D/g, '').replace(/^0/, '62');
  }

  // Create WhatsApp URL with message
  createWhatsAppUrl(phone, message) {
    const formattedPhone = this.formatPhoneNumber(phone);
    const encodedMessage = encodeURIComponent(message);
    return `${this.baseUrl}${formattedPhone}?text=${encodedMessage}`;
  }

  // Send notification to admin (you)
  async sendAdminNotification(type, title, message, data = {}) {
    if (!this.isEnabled) return false;

    try {
      const timestamp = new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      const formattedMessage = this.formatNotificationMessage(type, title, message, timestamp, data);
      
      // Check rate limiting
      const now = Date.now();
      const lastSentKey = `${type}_${title}`;
      if (this.lastSent[lastSentKey] && (now - this.lastSent[lastSentKey]) < this.rateLimitDelay) {
        console.log('⏳ Rate limited, queuing notification');
        this.queueNotification(type, title, message, data);
        return false;
      }

      // Open WhatsApp with message
      const whatsappUrl = this.createWhatsAppUrl(this.adminPhone, formattedMessage);
      
      // In a real app, you would use WhatsApp Business API
      // For now, we'll open the WhatsApp web/app
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }

      // Log notification
      console.log('📱 WhatsApp notification sent:', {
        type,
        title,
        phone: this.adminPhone,
        timestamp
      });

      // Update rate limiting
      this.lastSent[lastSentKey] = now;

      // Store notification history
      this.storeNotificationHistory(type, title, message, timestamp);

      return true;
    } catch (error) {
      console.error('❌ Error sending WhatsApp notification:', error);
      return false;
    }
  }

  // Format notification message for WhatsApp
  formatNotificationMessage(type, title, message, timestamp, data) {
    const emoji = this.getNotificationEmoji(type);
    let formattedMessage = `${emoji} *SentraBASE Notification*\n\n`;
    formattedMessage += `📋 *${title}*\n`;
    formattedMessage += `${message}\n\n`;
    formattedMessage += `🕐 ${timestamp}\n`;

    // Add specific data based on notification type
    switch (type) {
      case 'task':
        if (data.assignee) formattedMessage += `👤 Assigned to: ${data.assignee}\n`;
        if (data.dueDate) formattedMessage += `📅 Due: ${data.dueDate}\n`;
        if (data.priority) formattedMessage += `⚡ Priority: ${data.priority}\n`;
        break;
      
      case 'calendar':
        if (data.time) formattedMessage += `⏰ Time: ${data.time}\n`;
        if (data.attendees) formattedMessage += `👥 Attendees: ${data.attendees}\n`;
        if (data.location) formattedMessage += `📍 Location: ${data.location}\n`;
        break;
      
      case 'customer':
        if (data.customerName) formattedMessage += `🏢 Customer: ${data.customerName}\n`;
        if (data.company) formattedMessage += `🏬 Company: ${data.company}\n`;
        if (data.status) formattedMessage += `📊 Status: ${data.status}\n`;
        break;
      
      case 'workflow':
        if (data.trigger) formattedMessage += `🔄 Trigger: ${data.trigger}\n`;
        if (data.step) formattedMessage += `📝 Step: ${data.step}\n`;
        if (data.success) formattedMessage += `✅ Success Rate: ${data.success}%\n`;
        break;
      
      case 'team':
        if (data.member) formattedMessage += `👤 Member: ${data.member}\n`;
        if (data.workload) formattedMessage += `📊 Workload: ${data.workload}%\n`;
        if (data.role) formattedMessage += `🎭 Role: ${data.role}\n`;
        break;
    }

    formattedMessage += `\n🚀 *SentraBASE Admin Dashboard*`;
    return formattedMessage;
  }

  // Get emoji for notification type
  getNotificationEmoji(type) {
    const emojis = {
      task: '✅',
      calendar: '📅',
      customer: '👥',
      workflow: '⚡',
      team: '👨‍💼',
      system: '🔧',
      alert: '🚨',
      reminder: '⏰',
      success: '🎉',
      warning: '⚠️',
      error: '❌'
    };
    return emojis[type] || '📢';
  }

  // Queue notification for later sending
  queueNotification(type, title, message, data) {
    this.notificationQueue.push({
      type,
      title,
      message,
      data,
      timestamp: Date.now()
    });

    // Process queue after delay
    setTimeout(() => {
      this.processNotificationQueue();
    }, this.rateLimitDelay);
  }

  // Process queued notifications
  async processNotificationQueue() {
    if (this.notificationQueue.length === 0) return;

    const notification = this.notificationQueue.shift();
    await this.sendAdminNotification(
      notification.type,
      notification.title,
      notification.message,
      notification.data
    );

    // Continue processing if more notifications exist
    if (this.notificationQueue.length > 0) {
      setTimeout(() => {
        this.processNotificationQueue();
      }, this.rateLimitDelay);
    }
  }

  // Store notification history
  storeNotificationHistory(type, title, message, timestamp) {
    try {
      const history = JSON.parse(localStorage.getItem('whatsapp_notifications') || '[]');
      history.unshift({
        type,
        title,
        message,
        timestamp,
        phone: this.adminPhone
      });

      // Keep only last 100 notifications
      if (history.length > 100) {
        history.splice(100);
      }

      localStorage.setItem('whatsapp_notifications', JSON.stringify(history));
    } catch (error) {
      console.error('Error storing notification history:', error);
    }
  }

  // Get notification history
  getNotificationHistory() {
    try {
      return JSON.parse(localStorage.getItem('whatsapp_notifications') || '[]');
    } catch (error) {
      console.error('Error getting notification history:', error);
      return [];
    }
  }

  // Enable/disable notifications
  setEnabled(enabled) {
    this.isEnabled = enabled;
    localStorage.setItem('whatsapp_notifications_enabled', enabled.toString());
    console.log(`📱 WhatsApp notifications ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Check if notifications are enabled
  isNotificationsEnabled() {
    const stored = localStorage.getItem('whatsapp_notifications_enabled');
    return stored !== null ? stored === 'true' : this.isEnabled;
  }

  // Send specific notification types
  async sendTaskNotification(taskTitle, assignee, dueDate, priority = 'medium') {
    const message = `New task assigned: "${taskTitle}"`;
    return await this.sendAdminNotification('task', 'Task Assignment', message, {
      assignee,
      dueDate: new Date(dueDate).toLocaleDateString('id-ID'),
      priority: priority.toUpperCase()
    });
  }

  async sendCalendarNotification(eventTitle, time, attendees, location) {
    const message = `Upcoming event: "${eventTitle}"`;
    return await this.sendAdminNotification('calendar', 'Calendar Reminder', message, {
      time,
      attendees: attendees?.join(', '),
      location
    });
  }

  async sendCustomerNotification(customerName, company, action, status) {
    const message = `Customer update: ${action}`;
    return await this.sendAdminNotification('customer', 'Customer Update', message, {
      customerName,
      company,
      status
    });
  }

  async sendWorkflowNotification(workflowName, trigger, step, successRate) {
    const message = `Workflow "${workflowName}" executed`;
    return await this.sendAdminNotification('workflow', 'Workflow Update', message, {
      trigger,
      step,
      success: successRate
    });
  }

  async sendTeamNotification(memberName, action, workload, role) {
    const message = `Team update: ${action}`;
    return await this.sendAdminNotification('team', 'Team Update', message, {
      member: memberName,
      workload,
      role
    });
  }

  async sendSystemAlert(alertTitle, alertMessage, severity = 'info') {
    return await this.sendAdminNotification('alert', alertTitle, alertMessage, {
      severity
    });
  }

  // Test notification
  async sendTestNotification() {
    const message = 'WhatsApp integration is working correctly! 🎉';
    return await this.sendAdminNotification('system', 'Test Notification', message, {
      test: true,
      timestamp: new Date().toISOString()
    });
  }
}

// Create singleton instance
const whatsappService = new WhatsAppService();

// Initialize from localStorage
whatsappService.isEnabled = whatsappService.isNotificationsEnabled();

export default whatsappService;
