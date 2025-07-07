// Notification Helper for SentraBASE
import whatsappService from '@/services/whatsappService';

class NotificationHelper {
  constructor() {
    this.isEnabled = true;
  }

  // Dispatch custom event for internal notifications
  dispatchNotification(type, title, message, data = {}) {
    const event = new CustomEvent('sentrabase-notification', {
      detail: { type, title, message, data }
    });
    window.dispatchEvent(event);
  }

  // Task-related notifications
  async notifyTaskCreated(task, assigneeName) {
    const title = 'New Task Created';
    const message = `Task "${task.title}" has been assigned to ${assigneeName}`;
    
    await whatsappService.sendTaskNotification(
      task.title,
      assigneeName,
      task.dueDate,
      task.priority
    );

    this.dispatchNotification('task', title, message, {
      taskId: task.id,
      assignee: assigneeName,
      dueDate: new Date(task.dueDate).toLocaleDateString('id-ID'),
      priority: task.priority
    });
  }

  async notifyTaskOverdue(task, assigneeName) {
    const title = 'Task Overdue';
    const message = `Task "${task.title}" assigned to ${assigneeName} is overdue`;
    
    await whatsappService.sendAdminNotification('alert', title, message, {
      taskId: task.id,
      assignee: assigneeName,
      dueDate: new Date(task.dueDate).toLocaleDateString('id-ID'),
      priority: 'HIGH'
    });

    this.dispatchNotification('alert', title, message, {
      taskId: task.id,
      assignee: assigneeName,
      priority: 'high'
    });
  }

  async notifyTaskCompleted(task, assigneeName) {
    const title = 'Task Completed';
    const message = `Task "${task.title}" has been completed by ${assigneeName}`;
    
    await whatsappService.sendAdminNotification('success', title, message, {
      taskId: task.id,
      assignee: assigneeName,
      completedAt: new Date().toLocaleDateString('id-ID')
    });

    this.dispatchNotification('success', title, message, {
      taskId: task.id,
      assignee: assigneeName
    });
  }

  // Calendar-related notifications
  async notifyUpcomingEvent(event, timeUntil) {
    const title = 'Upcoming Event';
    const message = `Event "${event.title}" starts in ${timeUntil}`;
    
    await whatsappService.sendCalendarNotification(
      event.title,
      event.time,
      event.attendees,
      event.location
    );

    this.dispatchNotification('calendar', title, message, {
      eventId: event.id,
      time: event.time,
      attendees: event.attendees?.join(', '),
      location: event.location
    });
  }

  async notifyEventCreated(event, creatorName) {
    const title = 'New Event Created';
    const message = `Event "${event.title}" has been scheduled by ${creatorName}`;
    
    await whatsappService.sendCalendarNotification(
      event.title,
      new Date(event.date).toLocaleDateString('id-ID') + ' ' + event.time,
      event.attendees,
      event.location
    );

    this.dispatchNotification('calendar', title, message, {
      eventId: event.id,
      creator: creatorName,
      date: new Date(event.date).toLocaleDateString('id-ID'),
      time: event.time
    });
  }

  // Customer-related notifications
  async notifyNewCustomer(customer) {
    const title = 'New Customer Added';
    const message = `${customer.name} from ${customer.company} has been added as a new customer`;
    
    await whatsappService.sendCustomerNotification(
      customer.name,
      customer.company,
      'New customer registration',
      customer.customerType
    );

    this.dispatchNotification('customer', title, message, {
      customerId: customer.id,
      customerName: customer.name,
      company: customer.company,
      status: customer.customerType
    });
  }

  async notifyCustomerStatusChange(customer, oldStatus, newStatus) {
    const title = 'Customer Status Updated';
    const message = `${customer.name} status changed from ${oldStatus} to ${newStatus}`;
    
    await whatsappService.sendCustomerNotification(
      customer.name,
      customer.company,
      `Status changed to ${newStatus}`,
      newStatus
    );

    this.dispatchNotification('customer', title, message, {
      customerId: customer.id,
      customerName: customer.name,
      company: customer.company,
      oldStatus,
      newStatus
    });
  }

  // Team-related notifications
  async notifyTeamMemberAdded(member) {
    const title = 'New Team Member';
    const message = `${member.name} has been added to the team as ${member.role}`;
    
    await whatsappService.sendTeamNotification(
      member.name,
      'New team member added',
      member.workload?.utilization || 0,
      member.role
    );

    this.dispatchNotification('team', title, message, {
      memberId: member.id,
      member: member.name,
      role: member.role,
      department: member.department
    });
  }

  async notifyHighWorkload(member, workload) {
    const title = 'High Workload Alert';
    const message = `${member.name} has high workload (${workload}%)`;
    
    await whatsappService.sendTeamNotification(
      member.name,
      'High workload detected',
      workload,
      member.role
    );

    this.dispatchNotification('warning', title, message, {
      memberId: member.id,
      member: member.name,
      workload,
      role: member.role
    });
  }

  // Workflow-related notifications
  async notifyWorkflowTriggered(workflow, trigger) {
    const title = 'Workflow Triggered';
    const message = `Workflow "${workflow.name}" has been triggered by ${trigger}`;
    
    await whatsappService.sendWorkflowNotification(
      workflow.name,
      trigger,
      'Started',
      workflow.stats?.success_rate || 0
    );

    this.dispatchNotification('workflow', title, message, {
      workflowId: workflow.id,
      trigger,
      step: 'Started'
    });
  }

  async notifyWorkflowCompleted(workflow, successRate) {
    const title = 'Workflow Completed';
    const message = `Workflow "${workflow.name}" completed with ${successRate}% success rate`;
    
    await whatsappService.sendWorkflowNotification(
      workflow.name,
      'Completed',
      'All steps finished',
      successRate
    );

    this.dispatchNotification('workflow', title, message, {
      workflowId: workflow.id,
      success: successRate
    });
  }

  // System notifications
  async notifySystemAlert(alertTitle, alertMessage, severity = 'info') {
    await whatsappService.sendSystemAlert(alertTitle, alertMessage, severity);
    
    this.dispatchNotification('system', alertTitle, alertMessage, {
      severity
    });
  }

  // Daily summary notification
  async sendDailySummary(stats) {
    const title = 'Daily Summary';
    const message = `Today's activity: ${stats.tasksCompleted} tasks completed, ${stats.newCustomers} new customers, ${stats.eventsScheduled} events scheduled`;
    
    await whatsappService.sendAdminNotification('system', title, message, {
      tasksCompleted: stats.tasksCompleted,
      newCustomers: stats.newCustomers,
      eventsScheduled: stats.eventsScheduled,
      date: new Date().toLocaleDateString('id-ID')
    });
  }

  // Weekly summary notification
  async sendWeeklySummary(stats) {
    const title = 'Weekly Summary';
    const message = `This week: ${stats.totalTasks} tasks, ${stats.totalCustomers} customers, ${stats.totalEvents} events, ${stats.teamPerformance}% team performance`;
    
    await whatsappService.sendAdminNotification('system', title, message, {
      totalTasks: stats.totalTasks,
      totalCustomers: stats.totalCustomers,
      totalEvents: stats.totalEvents,
      teamPerformance: stats.teamPerformance,
      week: `Week ${Math.ceil(new Date().getDate() / 7)}`
    });
  }

  // Check for overdue tasks and send notifications
  async checkOverdueTasks(tasks, teamMembers) {
    const now = new Date();
    const overdueTasks = tasks.filter(task => 
      task.status !== 'completed' && new Date(task.dueDate) < now
    );

    for (const task of overdueTasks) {
      const assignee = teamMembers.find(m => m.id === task.assignedTo);
      if (assignee) {
        await this.notifyTaskOverdue(task, assignee.name);
      }
    }
  }

  // Check for upcoming events and send reminders
  async checkUpcomingEvents(events) {
    const now = new Date();
    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
    
    const upcomingEvents = events.filter(event => {
      const eventTime = new Date(event.date);
      return eventTime > now && eventTime <= thirtyMinutesFromNow;
    });

    for (const event of upcomingEvents) {
      const timeUntil = Math.round((new Date(event.date) - now) / (1000 * 60));
      await this.notifyUpcomingEvent(event, `${timeUntil} minutes`);
    }
  }

  // Enable/disable notifications
  setEnabled(enabled) {
    this.isEnabled = enabled;
    whatsappService.setEnabled(enabled);
  }
}

// Create singleton instance
const notificationHelper = new NotificationHelper();

export default notificationHelper;
