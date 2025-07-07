import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Play, 
  Pause, 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Clock,
  Users,
  Mail,
  MessageSquare,
  Bell,
  Target,
  CheckCircle,
  AlertTriangle,
  Activity,
  ArrowRight,
  Filter,
  Search,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const WorkflowAutomation = () => {
  const [workflows, setWorkflows] = useState([]);
  const [activeWorkflows, setActiveWorkflows] = useState([]);
  const [workflowStats, setWorkflowStats] = useState({});
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadWorkflows();
    loadWorkflowStats();
    const interval = setInterval(loadWorkflowStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadWorkflows = () => {
    // Load existing workflows from localStorage or initialize default ones
    const savedWorkflows = localStorage.getItem('sentrabase_workflows');
    if (savedWorkflows) {
      setWorkflows(JSON.parse(savedWorkflows));
    } else {
      // Initialize with default workflows
      const defaultWorkflows = [
        {
          id: 'welcome_sequence',
          name: 'Welcome New Customers',
          description: 'Automated welcome sequence for new customer registrations',
          trigger: 'customer_registered',
          status: 'active',
          steps: [
            { type: 'delay', duration: 5, unit: 'minutes' },
            { type: 'email', template: 'welcome_email', subject: 'Selamat datang di SentraBASE!' },
            { type: 'delay', duration: 1, unit: 'hours' },
            { type: 'whatsapp', template: 'welcome_whatsapp', message: 'Halo! Terima kasih telah bergabung dengan SentraBASE' },
            { type: 'delay', duration: 24, unit: 'hours' },
            { type: 'task', assignTo: 'sales_team', title: 'Follow up new customer' }
          ],
          conditions: [
            { field: 'customer_type', operator: 'equals', value: 'new' }
          ],
          stats: { triggered: 45, completed: 38, success_rate: 84.4 }
        },
        {
          id: 'abandoned_cart',
          name: 'Abandoned Cart Recovery',
          description: 'Re-engage customers who started but didn\'t complete payment',
          trigger: 'cart_abandoned',
          status: 'active',
          steps: [
            { type: 'delay', duration: 30, unit: 'minutes' },
            { type: 'email', template: 'cart_reminder', subject: 'Jangan lewatkan penawaran terbaik!' },
            { type: 'delay', duration: 2, unit: 'hours' },
            { type: 'whatsapp', template: 'cart_whatsapp', message: 'Masih tertarik dengan paket SentraBASE?' },
            { type: 'delay', duration: 24, unit: 'hours' },
            { type: 'discount', amount: 10, type: 'percentage' },
            { type: 'email', template: 'special_offer', subject: 'Diskon khusus 10% untuk Anda!' }
          ],
          conditions: [
            { field: 'step', operator: 'greater_than', value: 1 },
            { field: 'step', operator: 'less_than', value: 4 }
          ],
          stats: { triggered: 28, completed: 19, success_rate: 67.9 }
        },
        {
          id: 'lead_nurturing',
          name: 'Lead Nurturing Campaign',
          description: 'Nurture leads with educational content and offers',
          trigger: 'lead_created',
          status: 'active',
          steps: [
            { type: 'tag', action: 'add', tag: 'nurturing_sequence' },
            { type: 'email', template: 'educational_1', subject: 'Panduan RME untuk Klinik Modern' },
            { type: 'delay', duration: 3, unit: 'days' },
            { type: 'email', template: 'case_study', subject: 'Kisah Sukses: Klinik ABC dengan SentraBASE' },
            { type: 'delay', duration: 5, unit: 'days' },
            { type: 'whatsapp', template: 'consultation_offer', message: 'Mau konsultasi gratis tentang RME?' },
            { type: 'delay', duration: 7, unit: 'days' },
            { type: 'task', assignTo: 'sales_team', title: 'Personal follow up call' }
          ],
          conditions: [
            { field: 'source', operator: 'not_equals', value: 'direct_purchase' }
          ],
          stats: { triggered: 67, completed: 52, success_rate: 77.6 }
        },
        {
          id: 'high_value_alert',
          name: 'High-Value Customer Alert',
          description: 'Immediate notification for high-value potential customers',
          trigger: 'high_value_lead',
          status: 'active',
          steps: [
            { type: 'notification', target: 'sales_manager', message: 'High-value lead detected!' },
            { type: 'task', assignTo: 'senior_sales', title: 'Priority follow-up', priority: 'high' },
            { type: 'delay', duration: 15, unit: 'minutes' },
            { type: 'whatsapp', template: 'priority_response', message: 'Terima kasih atas minat Anda. Tim senior kami akan segera menghubungi.' }
          ],
          conditions: [
            { field: 'estimated_value', operator: 'greater_than', value: 10000000 }
          ],
          stats: { triggered: 12, completed: 12, success_rate: 100 }
        },
        {
          id: 'idle_customer',
          name: 'Re-engage Idle Customers',
          description: 'Re-activate customers who haven\'t been active',
          trigger: 'customer_idle',
          status: 'active',
          steps: [
            { type: 'email', template: 'we_miss_you', subject: 'Kami merindukan Anda!' },
            { type: 'delay', duration: 3, unit: 'days' },
            { type: 'discount', amount: 15, type: 'percentage' },
            { type: 'whatsapp', template: 'comeback_offer', message: 'Penawaran khusus untuk Anda yang terbaik!' },
            { type: 'delay', duration: 7, unit: 'days' },
            { type: 'survey', template: 'feedback_request', title: 'Bagaimana pengalaman Anda?' }
          ],
          conditions: [
            { field: 'last_activity', operator: 'older_than', value: 30, unit: 'days' }
          ],
          stats: { triggered: 23, completed: 15, success_rate: 65.2 }
        }
      ];
      
      setWorkflows(defaultWorkflows);
      localStorage.setItem('sentrabase_workflows', JSON.stringify(defaultWorkflows));
    }
  };

  const loadWorkflowStats = () => {
    // Calculate workflow performance stats
    const stats = {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter(w => w.status === 'active').length,
      totalTriggered: workflows.reduce((sum, w) => sum + (w.stats?.triggered || 0), 0),
      totalCompleted: workflows.reduce((sum, w) => sum + (w.stats?.completed || 0), 0),
      avgSuccessRate: workflows.length > 0 ? 
        workflows.reduce((sum, w) => sum + (w.stats?.success_rate || 0), 0) / workflows.length : 0,
      recentActivity: generateRecentActivity()
    };
    
    setWorkflowStats(stats);
  };

  const generateRecentActivity = () => {
    // Simulate recent workflow activity
    const activities = [
      { id: 1, workflow: 'Welcome New Customers', action: 'Email sent', customer: 'Klinik Sehat ABC', time: '2 minutes ago', status: 'success' },
      { id: 2, workflow: 'Abandoned Cart Recovery', action: 'WhatsApp sent', customer: 'Dr. John Doe', time: '5 minutes ago', status: 'success' },
      { id: 3, workflow: 'Lead Nurturing Campaign', action: 'Task created', customer: 'Klinik Modern XYZ', time: '8 minutes ago', status: 'pending' },
      { id: 4, workflow: 'High-Value Customer Alert', action: 'Notification sent', customer: 'RS Besar Jakarta', time: '12 minutes ago', status: 'success' },
      { id: 5, workflow: 'Welcome New Customers', action: 'Delay completed', customer: 'Klinik Prima', time: '15 minutes ago', status: 'success' }
    ];
    
    return activities;
  };

  const toggleWorkflow = (workflowId) => {
    const updatedWorkflows = workflows.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, status: workflow.status === 'active' ? 'paused' : 'active' }
        : workflow
    );
    
    setWorkflows(updatedWorkflows);
    localStorage.setItem('sentrabase_workflows', JSON.stringify(updatedWorkflows));
  };

  const deleteWorkflow = (workflowId) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      const updatedWorkflows = workflows.filter(workflow => workflow.id !== workflowId);
      setWorkflows(updatedWorkflows);
      localStorage.setItem('sentrabase_workflows', JSON.stringify(updatedWorkflows));
    }
  };

  const getStepIcon = (stepType) => {
    switch (stepType) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'delay': return <Clock className="w-4 h-4" />;
      case 'task': return <CheckCircle className="w-4 h-4" />;
      case 'notification': return <Bell className="w-4 h-4" />;
      case 'tag': return <Target className="w-4 h-4" />;
      case 'discount': return <Target className="w-4 h-4" />;
      case 'survey': return <Activity className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'paused': return 'text-yellow-400 bg-yellow-500/20';
      case 'draft': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportWorkflows = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      workflows,
      stats: workflowStats
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentrabase-workflows-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Workflow Automation</h2>
          <p className="text-gray-400">Automate customer interactions and business processes</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={exportWorkflows}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => setShowWorkflowBuilder(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Workflows</p>
              <p className="text-2xl font-bold text-white">{workflowStats.totalWorkflows}</p>
            </div>
            <Zap className="w-8 h-8 text-blue-400" />
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
              <p className="text-sm text-gray-400">Active Workflows</p>
              <p className="text-2xl font-bold text-green-400">{workflowStats.activeWorkflows}</p>
            </div>
            <Play className="w-8 h-8 text-green-400" />
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
              <p className="text-sm text-gray-400">Total Triggered</p>
              <p className="text-2xl font-bold text-white">{workflowStats.totalTriggered}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
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
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-white">{workflowStats.avgSuccessRate?.toFixed(1)}%</p>
            </div>
            <Target className="w-8 h-8 text-cyan-400" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workflows List */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Active Workflows</h3>
            </div>
            
            <div className="divide-y divide-slate-700">
              {filteredWorkflows.map((workflow) => (
                <div key={workflow.id} className="p-6 hover:bg-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-lg font-semibold text-white">{workflow.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                        {workflow.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => toggleWorkflow(workflow.id)}
                        size="sm"
                        className={workflow.status === 'active' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}
                      >
                        {workflow.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </Button>
                      <Button
                        onClick={() => setSelectedWorkflow(workflow)}
                        size="sm"
                        variant="outline"
                        className="border-cyan-400 text-cyan-400"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => deleteWorkflow(workflow.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-400 text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{workflow.description}</p>
                  
                  {/* Workflow Steps Preview */}
                  <div className="flex items-center space-x-2 mb-4">
                    {workflow.steps.slice(0, 5).map((step, index) => (
                      <div key={index} className="flex items-center">
                        <div className="p-2 bg-slate-700 rounded-lg">
                          {getStepIcon(step.type)}
                        </div>
                        {index < Math.min(workflow.steps.length - 1, 4) && (
                          <ArrowRight className="w-3 h-3 text-gray-500 mx-1" />
                        )}
                      </div>
                    ))}
                    {workflow.steps.length > 5 && (
                      <span className="text-gray-500 text-sm">+{workflow.steps.length - 5} more</span>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Triggered:</span>
                      <span className="text-white ml-2 font-semibold">{workflow.stats?.triggered || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Completed:</span>
                      <span className="text-white ml-2 font-semibold">{workflow.stats?.completed || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Success Rate:</span>
                      <span className="text-white ml-2 font-semibold">{workflow.stats?.success_rate || 0}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 rounded-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
            </div>
            
            <div className="divide-y divide-slate-700 max-h-96 overflow-y-auto">
              {workflowStats.recentActivity?.map((activity) => (
                <div key={activity.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${activity.status === 'success' ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                      <Activity className={`w-4 h-4 ${activity.status === 'success' ? 'text-green-400' : 'text-yellow-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.workflow}</p>
                      <p className="text-xs text-gray-500">{activity.customer} • {activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowAutomation;
