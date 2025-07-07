import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar,
  Plus,
  Filter,
  Search,
  MoreVertical,
  MessageSquare,
  Paperclip,
  Flag,
  Users,
  Target,
  TrendingUp,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NewTaskModal from './NewTaskModal';

// Notification Helper (inline for now)
class NotificationHelper {
  async notifyTaskCreated(task, assigneeName) {
    const message = `Task "${task.title}" has been assigned to ${assigneeName}`;
    
    // WhatsApp notification
    const whatsappUrl = `https://wa.me/6282132115008?text=${encodeURIComponent(
      `✅ *SentraBASE Notification*\n\n📋 *New Task Created*\n${message}\n\n👤 Assigned to: ${assigneeName}\n📅 Due: ${new Date(task.dueDate).toLocaleDateString('id-ID')}\n⚡ Priority: ${task.priority.toUpperCase()}\n\n🚀 *SentraBASE Admin Dashboard*`
    )}`;
    
    // Email notification
    const emailSubject = '[SentraBASE] New Task Created';
    const emailBody = `SentraBASE Admin Notification\n================================\n\nType: TASK\nTitle: New Task Created\nMessage: ${message}\n\nTask Details:\n- Assigned to: ${assigneeName}\n- Due Date: ${new Date(task.dueDate).toLocaleDateString('id-ID')}\n- Priority: ${task.priority.toUpperCase()}\n- Task ID: ${task.id}\n\nTimestamp: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n================================\nSentraBASE Admin Dashboard\nAdmin Email: fery10febrian@gmail.com`;
    const emailUrl = `mailto:fery10febrian@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
      setTimeout(() => window.open(emailUrl, '_blank'), 1000);
    }
  }

  async notifyTaskCompleted(task, assigneeName) {
    const message = `Task "${task.title}" has been completed by ${assigneeName}`;
    
    // WhatsApp notification
    const whatsappUrl = `https://wa.me/6282132115008?text=${encodeURIComponent(
      `🎉 *SentraBASE Notification*\n\n📋 *Task Completed*\n${message}\n\n👤 Completed by: ${assigneeName}\n✅ Status: Completed\n\n🚀 *SentraBASE Admin Dashboard*`
    )}`;
    
    // Email notification
    const emailSubject = '[SentraBASE] Task Completed';
    const emailBody = `SentraBASE Admin Notification\n================================\n\nType: TASK\nTitle: Task Completed\nMessage: ${message}\n\nTask Details:\n- Completed by: ${assigneeName}\n- Task ID: ${task.id}\n- Completed at: ${new Date().toLocaleDateString('id-ID')}\n\nTimestamp: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n================================\nSentraBASE Admin Dashboard\nAdmin Email: fery10febrian@gmail.com`;
    const emailUrl = `mailto:fery10febrian@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
      setTimeout(() => window.open(emailUrl, '_blank'), 1000);
    }
  }
}

const notificationHelper = new NotificationHelper();

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  useEffect(() => {
    loadTasks();
    loadTeamMembers();
  }, []);

  const loadTeamMembers = () => {
    const savedTeam = localStorage.getItem('sentrabase_team');
    if (savedTeam) {
      setTeamMembers(JSON.parse(savedTeam));
    }
  };

  const loadTasks = () => {
    const savedTasks = localStorage.getItem('sentrabase_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Generate default tasks from workflows
      const defaultTasks = [
        {
          id: 'task_1',
          title: 'Follow up Klinik Sehat ABC',
          description: 'Personal call to new customer after welcome sequence',
          status: 'pending',
          priority: 'high',
          assignedTo: 'sales_1',
          assignedBy: 'admin_1',
          workflowId: 'welcome_sequence',
          customerId: 'customer_123',
          customerName: 'Klinik Sehat ABC',
          dueDate: Date.now() + 86400000, // 1 day from now
          createdAt: Date.now() - 3600000, // 1 hour ago
          estimatedTime: 30, // minutes
          tags: ['follow-up', 'new-customer'],
          comments: [
            {
              id: 1,
              author: 'admin_1',
              message: 'High-value customer, please prioritize',
              timestamp: Date.now() - 1800000
            }
          ],
          attachments: []
        },
        {
          id: 'task_2',
          title: 'Cart abandonment follow-up - Dr. John',
          description: 'Call customer to address concerns about pricing',
          status: 'in_progress',
          priority: 'medium',
          assignedTo: 'sales_2',
          assignedBy: 'sales_1',
          workflowId: 'abandoned_cart',
          customerId: 'customer_456',
          customerName: 'Dr. John Doe',
          dueDate: Date.now() + 14400000, // 4 hours from now
          createdAt: Date.now() - 7200000, // 2 hours ago
          estimatedTime: 45,
          tags: ['cart-recovery', 'pricing-concern'],
          comments: [
            {
              id: 1,
              author: 'sales_2',
              message: 'Customer mentioned budget constraints, preparing custom proposal',
              timestamp: Date.now() - 3600000
            }
          ],
          attachments: []
        },
        {
          id: 'task_3',
          title: 'Priority consultation - RS Besar Jakarta',
          description: 'Immediate response for high-value enterprise customer',
          status: 'completed',
          priority: 'critical',
          assignedTo: 'sales_1',
          assignedBy: 'admin_1',
          workflowId: 'high_value_alert',
          customerId: 'customer_789',
          customerName: 'RS Besar Jakarta',
          dueDate: Date.now() - 3600000, // Was due 1 hour ago
          createdAt: Date.now() - 7200000,
          completedAt: Date.now() - 1800000, // Completed 30 min ago
          estimatedTime: 60,
          actualTime: 45,
          tags: ['enterprise', 'high-value', 'consultation'],
          comments: [
            {
              id: 1,
              author: 'sales_1',
              message: 'Excellent meeting! They are ready to proceed with Enterprise plan.',
              timestamp: Date.now() - 1800000
            }
          ],
          attachments: []
        },
        {
          id: 'task_4',
          title: 'Demo preparation for Klinik Modern XYZ',
          description: 'Prepare customized demo focusing on their specific needs',
          status: 'pending',
          priority: 'medium',
          assignedTo: 'support_1',
          assignedBy: 'sales_1',
          workflowId: null, // Manual task
          customerId: 'customer_101',
          customerName: 'Klinik Modern XYZ',
          dueDate: Date.now() + 172800000, // 2 days from now
          createdAt: Date.now() - 1800000,
          estimatedTime: 120,
          tags: ['demo', 'preparation', 'customization'],
          comments: [],
          attachments: []
        },
        {
          id: 'task_5',
          title: 'Weekly team sync - Workflow optimization',
          description: 'Review workflow performance and optimize based on team feedback',
          status: 'pending',
          priority: 'low',
          assignedTo: 'admin_1',
          assignedBy: 'admin_1',
          workflowId: null,
          customerId: null,
          customerName: null,
          dueDate: Date.now() + 604800000, // 1 week from now
          createdAt: Date.now() - 86400000,
          estimatedTime: 90,
          tags: ['team-sync', 'optimization', 'internal'],
          comments: [],
          attachments: []
        }
      ];
      
      setTasks(defaultTasks);
      localStorage.setItem('sentrabase_tasks', JSON.stringify(defaultTasks));
    }
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updates = { 
          ...task, 
          status: newStatus,
          updatedAt: Date.now()
        };
        
        if (newStatus === 'completed' && !task.completedAt) {
          updates.completedAt = Date.now();
          
          // Send notification for task completion
          const assigneeName = getMemberName(task.assignedTo);
          notificationHelper.notifyTaskCompleted(updates, assigneeName);
        }
        
        return updates;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    localStorage.setItem('sentrabase_tasks', JSON.stringify(updatedTasks));
  };

  const addComment = (taskId, comment) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          comments: [
            ...task.comments,
            {
              id: Date.now(),
              author: 'current_user', // In real app, get from auth
              message: comment,
              timestamp: Date.now()
            }
          ]
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    localStorage.setItem('sentrabase_tasks', JSON.stringify(updatedTasks));
  };

  const saveNewTask = async (newTask) => {
    try {
      // Add new task to tasks list
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      localStorage.setItem('sentrabase_tasks', JSON.stringify(updatedTasks));
      
      console.log('✅ New task created:', newTask.title);
      
      // Send WhatsApp notification
      const assigneeName = getMemberName(newTask.assignedTo);
      await notificationHelper.notifyTaskCreated(newTask, assigneeName);
      
      // Show success message
      alert(`Task "${newTask.title}" has been created successfully!\n\nAssigned to: ${assigneeName}\nDue: ${new Date(newTask.dueDate).toLocaleDateString('id-ID')}\nPriority: ${newTask.priority}`);
      
    } catch (error) {
      console.error('❌ Error creating task:', error);
      throw error; // Re-throw to be handled by the modal
    }
  };

  const deleteTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (confirm(`Are you sure you want to delete the task "${task.title}"?\n\nThis action cannot be undone.`)) {
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      setTasks(updatedTasks);
      localStorage.setItem('sentrabase_tasks', JSON.stringify(updatedTasks));
      
      console.log('✅ Task deleted:', task.title);
      alert(`Task "${task.title}" has been deleted.`);
    }
  };

  const getMemberName = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : memberId;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'in_progress': return 'text-blue-400 bg-blue-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'overdue': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-400 border-red-500';
      case 'high': return 'text-orange-400 border-orange-500';
      case 'medium': return 'text-yellow-400 border-yellow-500';
      case 'low': return 'text-green-400 border-green-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const isOverdue = (dueDate) => {
    return Date.now() > dueDate;
  };

  const formatTimeRemaining = (dueDate) => {
    const diff = dueDate - Date.now();
    if (diff < 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} days`;
    if (hours > 0) return `${hours} hours`;
    return 'Due soon';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesAssignee = filterAssignee === 'all' || task.assignedTo === filterAssignee;
    
    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'completed').length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Management</h2>
          <p className="text-gray-400">Manage team tasks and workflow assignments</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowNewTaskModal(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-white">{taskStats.total}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-blue-400" />
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
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{taskStats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
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
              <p className="text-sm text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-blue-400">{taskStats.inProgress}</p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
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
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-400">{taskStats.completed}</p>
            </div>
            <CheckSquare className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Overdue</p>
              <p className="text-2xl font-bold text-red-400">{taskStats.overdue}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          className="bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
        >
          <option value="all">All Assignees</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <div className={`w-3 h-3 rounded-full border-2 ${getPriorityColor(task.priority)}`} />
                </div>
                <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                
                {/* Task Meta */}
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{getMemberName(task.assignedTo)}</span>
                  </div>
                  {task.customerName && (
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{task.customerName}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span className={isOverdue(task.dueDate) && task.status !== 'completed' ? 'text-red-400' : ''}>
                      {formatTimeRemaining(task.dueDate)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{task.estimatedTime} min</span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
                {task.status !== 'completed' && (
                  <>
                    <Button
                      onClick={() => updateTaskStatus(task.id, task.status === 'pending' ? 'in_progress' : 'completed')}
                      size="sm"
                      className={task.status === 'pending' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'}
                    >
                      {task.status === 'pending' ? 'Start' : 'Complete'}
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => console.log('View task details:', task.id)}
                  size="sm"
                  variant="outline"
                  className="border-cyan-400 text-cyan-400"
                >
                  <Eye className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => deleteTask(task.id)}
                  size="sm"
                  className="bg-red-500 hover:bg-red-600"
                >
                  <AlertTriangle className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-700 text-xs text-gray-300 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Comments */}
            {task.comments.length > 0 && (
              <div className="border-t border-slate-700 pt-3">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{task.comments.length} comment(s)</span>
                </div>
                <div className="space-y-2">
                  {task.comments.slice(-2).map((comment) => (
                    <div key={comment.id} className="bg-slate-700 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">
                          {getMemberName(comment.author)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{comment.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        onSave={saveNewTask}
        teamMembers={teamMembers}
      />
    </div>
  );
};

export default TaskManagement;
