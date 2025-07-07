// Email Service for SentraBASE Notifications
class EmailService {
  constructor() {
    this.adminEmail = 'fery10febrian@gmail.com'; // Your email address
    this.isEnabled = true;
    this.emailQueue = [];
    this.rateLimitDelay = 3000; // 3 seconds between emails
    this.lastSent = {};
  }

  // Send email notification to admin
  async sendAdminNotification(type, title, message, data = {}) {
    if (!this.isEnabled) return false;

    try {
      const timestamp = new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const emailData = this.formatEmailNotification(type, title, message, timestamp, data);
      
      // Check rate limiting
      const now = Date.now();
      const lastSentKey = `${type}_${title}`;
      if (this.lastSent[lastSentKey] && (now - this.lastSent[lastSentKey]) < this.rateLimitDelay) {
        console.log('⏳ Email rate limited, queuing notification');
        this.queueEmail(type, title, message, data);
        return false;
      }

      // Send email using mailto (opens email client)
      const mailtoUrl = this.createMailtoUrl(emailData.subject, emailData.body);
      
      if (typeof window !== 'undefined') {
        window.open(mailtoUrl, '_blank');
      }

      // Log notification
      console.log('📧 Email notification sent:', {
        type,
        title,
        email: this.adminEmail,
        timestamp
      });

      // Update rate limiting
      this.lastSent[lastSentKey] = now;

      // Store notification history
      this.storeEmailHistory(type, title, message, timestamp);

      return true;
    } catch (error) {
      console.error('❌ Error sending email notification:', error);
      return false;
    }
  }

  // Format email notification
  formatEmailNotification(type, title, message, timestamp, data) {
    const subject = `[SentraBASE] ${title}`;
    
    let body = `SentraBASE Admin Notification\n`;
    body += `================================\n\n`;
    body += `Type: ${type.toUpperCase()}\n`;
    body += `Title: ${title}\n`;
    body += `Message: ${message}\n\n`;
    body += `Timestamp: ${timestamp}\n`;
    body += `Timezone: Asia/Jakarta (WIB)\n\n`;

    // Add specific data based on notification type
    switch (type) {
      case 'task':
        body += `TASK DETAILS:\n`;
        body += `- Assigned to: ${data.assignee || 'N/A'}\n`;
        body += `- Due Date: ${data.dueDate || 'N/A'}\n`;
        body += `- Priority: ${data.priority || 'N/A'}\n`;
        body += `- Task ID: ${data.taskId || 'N/A'}\n`;
        break;
      
      case 'customer':
        body += `CUSTOMER DETAILS:\n`;
        body += `- Customer Name: ${data.customerName || 'N/A'}\n`;
        body += `- Company: ${data.company || 'N/A'}\n`;
        body += `- Status: ${data.status || 'N/A'}\n`;
        body += `- Email: ${data.email || 'N/A'}\n`;
        body += `- Phone: ${data.phone || 'N/A'}\n`;
        break;
      
      case 'calendar':
        body += `EVENT DETAILS:\n`;
        body += `- Time: ${data.time || 'N/A'}\n`;
        body += `- Attendees: ${data.attendees || 'N/A'}\n`;
        body += `- Location: ${data.location || 'N/A'}\n`;
        body += `- Event ID: ${data.eventId || 'N/A'}\n`;
        break;
      
      case 'workflow':
        body += `WORKFLOW DETAILS:\n`;
        body += `- Trigger: ${data.trigger || 'N/A'}\n`;
        body += `- Step: ${data.step || 'N/A'}\n`;
        body += `- Success Rate: ${data.success || 'N/A'}%\n`;
        body += `- Workflow ID: ${data.workflowId || 'N/A'}\n`;
        break;
      
      case 'team':
        body += `TEAM DETAILS:\n`;
        body += `- Member: ${data.member || 'N/A'}\n`;
        body += `- Role: ${data.role || 'N/A'}\n`;
        body += `- Workload: ${data.workload || 'N/A'}%\n`;
        body += `- Department: ${data.department || 'N/A'}\n`;
        break;
      
      case 'system':
        body += `SYSTEM DETAILS:\n`;
        body += `- Severity: ${data.severity || 'info'}\n`;
        body += `- Component: ${data.component || 'SentraBASE'}\n`;
        break;
    }

    body += `\n================================\n`;
    body += `SentraBASE Admin Dashboard\n`;
    body += `Hospital Management System\n`;
    body += `Generated: ${timestamp}\n`;
    body += `Admin Email: ${this.adminEmail}\n`;

    return { subject, body };
  }

  // Create mailto URL
  createMailtoUrl(subject, body) {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    return `mailto:${this.adminEmail}?subject=${encodedSubject}&body=${encodedBody}`;
  }

  // Queue email for later sending
  queueEmail(type, title, message, data) {
    this.emailQueue.push({
      type,
      title,
      message,
      data,
      timestamp: Date.now()
    });

    // Process queue after delay
    setTimeout(() => {
      this.processEmailQueue();
    }, this.rateLimitDelay);
  }

  // Process queued emails
  async processEmailQueue() {
    if (this.emailQueue.length === 0) return;

    const email = this.emailQueue.shift();
    await this.sendAdminNotification(
      email.type,
      email.title,
      email.message,
      email.data
    );

    // Continue processing if more emails exist
    if (this.emailQueue.length > 0) {
      setTimeout(() => {
        this.processEmailQueue();
      }, this.rateLimitDelay);
    }
  }

  // Store email history
  storeEmailHistory(type, title, message, timestamp) {
    try {
      const history = JSON.parse(localStorage.getItem('email_notifications') || '[]');
      history.unshift({
        type,
        title,
        message,
        timestamp,
        email: this.adminEmail
      });

      // Keep only last 100 emails
      if (history.length > 100) {
        history.splice(100);
      }

      localStorage.setItem('email_notifications', JSON.stringify(history));
    } catch (error) {
      console.error('Error storing email history:', error);
    }
  }

  // Get email history
  getEmailHistory() {
    try {
      return JSON.parse(localStorage.getItem('email_notifications') || '[]');
    } catch (error) {
      console.error('Error getting email history:', error);
      return [];
    }
  }

  // Enable/disable email notifications
  setEnabled(enabled) {
    this.isEnabled = enabled;
    localStorage.setItem('email_notifications_enabled', enabled.toString());
    console.log(`📧 Email notifications ${enabled ? 'enabled' : 'disabled'}`);
  }

  // Check if email notifications are enabled
  isEmailEnabled() {
    const stored = localStorage.getItem('email_notifications_enabled');
    return stored !== null ? stored === 'true' : this.isEnabled;
  }

  // Send specific notification types
  async sendTaskNotification(taskTitle, assignee, dueDate, priority = 'medium', taskId) {
    const message = `New task "${taskTitle}" has been assigned to ${assignee}`;
    return await this.sendAdminNotification('task', 'Task Assignment', message, {
      assignee,
      dueDate: new Date(dueDate).toLocaleDateString('id-ID'),
      priority: priority.toUpperCase(),
      taskId
    });
  }

  async sendTaskCompletionNotification(taskTitle, assignee, taskId) {
    const message = `Task "${taskTitle}" has been completed by ${assignee}`;
    return await this.sendAdminNotification('task', 'Task Completed', message, {
      assignee,
      taskId,
      completedAt: new Date().toLocaleDateString('id-ID')
    });
  }

  async sendCustomerNotification(customerName, company, action, status, email, phone) {
    const message = `Customer update: ${action}`;
    return await this.sendAdminNotification('customer', 'Customer Update', message, {
      customerName,
      company,
      status,
      email,
      phone
    });
  }

  async sendCalendarNotification(eventTitle, time, attendees, location, eventId) {
    const message = `Calendar event: "${eventTitle}"`;
    return await this.sendAdminNotification('calendar', 'Calendar Event', message, {
      time,
      attendees: attendees?.join(', '),
      location,
      eventId
    });
  }

  async sendWorkflowNotification(workflowName, trigger, step, successRate, workflowId) {
    const message = `Workflow "${workflowName}" ${step.toLowerCase()}`;
    return await this.sendAdminNotification('workflow', 'Workflow Update', message, {
      trigger,
      step,
      success: successRate,
      workflowId
    });
  }

  async sendTeamNotification(memberName, action, workload, role, department) {
    const message = `Team update: ${action}`;
    return await this.sendAdminNotification('team', 'Team Update', message, {
      member: memberName,
      workload,
      role,
      department
    });
  }

  async sendSystemAlert(alertTitle, alertMessage, severity = 'info') {
    return await this.sendAdminNotification('system', alertTitle, alertMessage, {
      severity,
      component: 'SentraBASE'
    });
  }

  // Send daily summary
  async sendDailySummary(stats) {
    const message = `Daily Summary: ${stats.tasksCompleted} tasks completed, ${stats.newCustomers} new customers, ${stats.eventsScheduled} events scheduled`;
    return await this.sendAdminNotification('system', 'Daily Summary Report', message, {
      tasksCompleted: stats.tasksCompleted,
      newCustomers: stats.newCustomers,
      eventsScheduled: stats.eventsScheduled,
      date: new Date().toLocaleDateString('id-ID'),
      severity: 'info'
    });
  }

  // Send test email
  async sendTestEmail() {
    const message = 'Email notification system is working correctly! This is a test email from SentraBASE admin dashboard.';
    return await this.sendAdminNotification('system', 'Test Email Notification', message, {
      test: true,
      adminEmail: this.adminEmail,
      severity: 'info'
    });
  }
}

// Create singleton instance
const emailService = new EmailService();

// Initialize from localStorage
emailService.isEnabled = emailService.isEmailEnabled();

export default emailService;
