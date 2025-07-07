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
  Upload,
  UserCheck,
  Calendar,
  BarChart3,
  Share2,
  Copy,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WorkflowBuilderModal from './WorkflowBuilderModal';

const EnhancedWorkflowAutomation = () => {
  const [workflows, setWorkflows] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [workflowStats, setWorkflowStats] = useState({});
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    loadWorkflows();
    loadTeamMembers();
    loadWorkflowStats();
    const interval = setInterval(loadWorkflowStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadTeamMembers = () => {
    // Load team members for assignment
    const savedTeam = localStorage.getItem('sentrabase_team');
    if (savedTeam) {
      setTeamMembers(JSON.parse(savedTeam));
    } else {
      // Default team members
      const defaultTeam = [
        { id: 'admin_1', name: 'Admin SentraBASE', role: 'admin', status: 'active' },
        { id: 'sales_1', name: 'Sarah Sales Manager', role: 'sales_manager', status: 'active' },
        { id: 'support_1', name: 'David Support Lead', role: 'support_lead', status: 'active' },
        { id: 'sales_2', name: 'Lisa Sales Executive', role: 'sales_executive', status: 'active' }
      ];
      setTeamMembers(defaultTeam);
    }
  };

  const loadWorkflows = () => {
    const savedWorkflows = localStorage.getItem('sentrabase_workflows');
    if (savedWorkflows) {
      setWorkflows(JSON.parse(savedWorkflows));
    } else {
      // Enhanced workflows with team collaboration features
      const defaultWorkflows = [
        {
          id: 'welcome_sequence',
          name: 'Welcome New Customers',
          description: 'Automated welcome sequence for new customer registrations',
          trigger: 'customer_registered',
          status: 'active',
          owner: 'sales_1',
          collaborators: ['support_1', 'admin_1'],
          category: 'onboarding',
          priority: 'high',
          lastModified: Date.now() - 86400000,
          steps: [
            { 
              type: 'delay', 
              duration: 5, 
              unit: 'minutes',
              assignedTo: null,
              description: 'Wait 5 minutes before first contact'
            },
            { 
              type: 'email', 
              template: 'welcome_email', 
              subject: 'Selamat datang di SentraBASE!',
              assignedTo: 'sales_1',
              description: 'Send personalized welcome email'
            },
            { 
              type: 'delay', 
              duration: 1, 
              unit: 'hours',
              assignedTo: null,
              description: 'Wait 1 hour before WhatsApp follow-up'
            },
            { 
              type: 'whatsapp', 
              template: 'welcome_whatsapp', 
              message: 'Halo! Terima kasih telah bergabung dengan SentraBASE',
              assignedTo: 'sales_1',
              description: 'Send WhatsApp welcome message'
            },
            { 
              type: 'task', 
              assignTo: 'sales_1', 
              title: 'Personal follow up call',
              priority: 'medium',
              deadline: '24 hours',
              description: 'Make personal call to new customer'
            }
          ],
          conditions: [
            { field: 'customer_type', operator: 'equals', value: 'new' }
          ],
          stats: { 
            triggered: 45, 
            completed: 38, 
            success_rate: 84.4,
            avg_completion_time: '2.5 hours',
            team_performance: {
              'sales_1': { tasks: 32, completion_rate: 94 },
              'support_1': { tasks: 8, completion_rate: 100 }
            }
          },
          comments: [
            {
              id: 1,
              author: 'sales_1',
              message: 'Working great! High conversion rate.',
              timestamp: Date.now() - 3600000
            }
          ]
        },
        {
          id: 'abandoned_cart',
          name: 'Abandoned Cart Recovery',
          description: 'Re-engage customers who started but didn\'t complete payment',
          trigger: 'cart_abandoned',
          status: 'active',
          owner: 'sales_2',
          collaborators: ['sales_1'],
          category: 'conversion',
          priority: 'high',
          lastModified: Date.now() - 172800000,
          steps: [
            { 
              type: 'delay', 
              duration: 30, 
              unit: 'minutes',
              description: 'Wait 30 minutes to avoid being pushy'
            },
            { 
              type: 'email', 
              template: 'cart_reminder', 
              subject: 'Jangan lewatkan penawaran terbaik!',
              assignedTo: 'sales_2',
              description: 'Send cart abandonment email'
            },
            { 
              type: 'delay', 
              duration: 2, 
              unit: 'hours',
              description: 'Wait 2 hours before WhatsApp'
            },
            { 
              type: 'whatsapp', 
              template: 'cart_whatsapp', 
              message: 'Masih tertarik dengan paket SentraBASE?',
              assignedTo: 'sales_2',
              description: 'Personal WhatsApp follow-up'
            },
            { 
              type: 'task', 
              assignTo: 'sales_1', 
              title: 'Personal consultation call',
              priority: 'high',
              deadline: '4 hours',
              description: 'Call customer to address concerns'
            }
          ],
          conditions: [
            { field: 'step', operator: 'greater_than', value: 1 },
            { field: 'step', operator: 'less_than', value: 4 }
          ],
          stats: { 
            triggered: 28, 
            completed: 19, 
            success_rate: 67.9,
            avg_completion_time: '6.2 hours',
            team_performance: {
              'sales_2': { tasks: 18, completion_rate: 89 },
              'sales_1': { tasks: 12, completion_rate: 92 }
            }
          },
          comments: [
            {
              id: 1,
              author: 'sales_1',
              message: 'Need to optimize timing for WhatsApp messages',
              timestamp: Date.now() - 7200000
            }
          ]
        },
        {
          id: 'high_value_alert',
          name: 'High-Value Customer Alert',
          description: 'Immediate notification for high-value potential customers',
          trigger: 'high_value_lead',
          status: 'active',
          owner: 'admin_1',
          collaborators: ['sales_1', 'sales_2'],
          category: 'priority',
          priority: 'critical',
          lastModified: Date.now() - 259200000,
          steps: [
            { 
              type: 'notification', 
              target: 'sales_manager', 
              message: 'High-value lead detected!',
              assignedTo: 'admin_1',
              description: 'Instant alert to sales manager'
            },
            { 
              type: 'task', 
              assignTo: 'sales_1', 
              title: 'Priority follow-up', 
              priority: 'critical',
              deadline: '15 minutes',
              description: 'Immediate response required'
            },
            { 
              type: 'whatsapp', 
              template: 'priority_response', 
              message: 'Terima kasih atas minat Anda. Tim senior kami akan segera menghubungi.',
              assignedTo: 'sales_1',
              description: 'Immediate acknowledgment message'
            }
          ],
          conditions: [
            { field: 'estimated_value', operator: 'greater_than', value: 10000000 }
          ],
          stats: { 
            triggered: 12, 
            completed: 12, 
            success_rate: 100,
            avg_completion_time: '12 minutes',
            team_performance: {
              'sales_1': { tasks: 12, completion_rate: 100 },
              'admin_1': { tasks: 12, completion_rate: 100 }
            }
          },
          comments: []
        }
      ];
      
      setWorkflows(defaultWorkflows);
      localStorage.setItem('sentrabase_workflows', JSON.stringify(defaultWorkflows));
    }
  };

  const loadWorkflowStats = () => {
    const stats = {
      totalWorkflows: workflows.length,
      activeWorkflows: workflows.filter(w => w.status === 'active').length,
      totalTriggered: workflows.reduce((sum, w) => sum + (w.stats?.triggered || 0), 0),
      totalCompleted: workflows.reduce((sum, w) => sum + (w.stats?.completed || 0), 0),
      avgSuccessRate: workflows.length > 0 ? 
        workflows.reduce((sum, w) => sum + (w.stats?.success_rate || 0), 0) / workflows.length : 0,
      teamWorkload: calculateTeamWorkload(),
      recentActivity: generateRecentActivity()
    };
    
    setWorkflowStats(stats);
  };

  const calculateTeamWorkload = () => {
    const workload = {};
    teamMembers.forEach(member => {
      workload[member.id] = {
        name: member.name,
        assignedWorkflows: workflows.filter(w => 
          w.owner === member.id || w.collaborators?.includes(member.id)
        ).length,
        activeTasks: workflows.reduce((sum, w) => {
          return sum + w.steps.filter(s => s.assignedTo === member.id || s.assignTo === member.id).length;
        }, 0)
      };
    });
    return workload;
  };

  const generateRecentActivity = () => {
    return [
      { 
        id: 1, 
        workflow: 'Welcome New Customers', 
        action: 'Task completed', 
        user: 'Sarah Sales Manager',
        customer: 'Klinik Sehat ABC', 
        time: '2 minutes ago', 
        status: 'success' 
      },
      { 
        id: 2, 
        workflow: 'Abandoned Cart Recovery', 
        action: 'WhatsApp sent', 
        user: 'Lisa Sales Executive',
        customer: 'Dr. John Doe', 
        time: '5 minutes ago', 
        status: 'success' 
      },
      { 
        id: 3, 
        workflow: 'High-Value Customer Alert', 
        action: 'Priority task assigned', 
        user: 'Admin SentraBASE',
        customer: 'RS Besar Jakarta', 
        time: '8 minutes ago', 
        status: 'pending' 
      }
    ];
  };

  const assignWorkflow = (workflowId, memberId) => {
    const updatedWorkflows = workflows.map(workflow => {
      if (workflow.id === workflowId) {
        return {
          ...workflow,
          owner: memberId,
          lastModified: Date.now()
        };
      }
      return workflow;
    });
    
    setWorkflows(updatedWorkflows);
    localStorage.setItem('sentrabase_workflows', JSON.stringify(updatedWorkflows));
  };

  const addCollaborator = (workflowId, memberId) => {
    const updatedWorkflows = workflows.map(workflow => {
      if (workflow.id === workflowId) {
        const collaborators = workflow.collaborators || [];
        if (!collaborators.includes(memberId)) {
          return {
            ...workflow,
            collaborators: [...collaborators, memberId],
            lastModified: Date.now()
          };
        }
      }
      return workflow;
    });
    
    setWorkflows(updatedWorkflows);
    localStorage.setItem('sentrabase_workflows', JSON.stringify(updatedWorkflows));
  };

  const duplicateWorkflow = (workflowId) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      const duplicated = {
        ...workflow,
        id: `${workflow.id}_copy_${Date.now()}`,
        name: `${workflow.name} (Copy)`,
        status: 'draft',
        stats: { triggered: 0, completed: 0, success_rate: 0 },
        lastModified: Date.now()
      };
      
      const updatedWorkflows = [...workflows, duplicated];
      setWorkflows(updatedWorkflows);
      localStorage.setItem('sentrabase_workflows', JSON.stringify(updatedWorkflows));
    }
  };

  const saveWorkflow = async (workflowData) => {
    try {
      let updatedWorkflows;
      
      if (selectedWorkflow && selectedWorkflow.id === workflowData.id) {
        // Update existing workflow
        updatedWorkflows = workflows.map(workflow => 
          workflow.id === workflowData.id ? workflowData : workflow
        );
      } else {
        // Add new workflow
        updatedWorkflows = [...workflows, workflowData];
      }
      
      setWorkflows(updatedWorkflows);
      localStorage.setItem('sentrabase_workflows', JSON.stringify(updatedWorkflows));
      
      console.log('✅ Workflow saved successfully:', workflowData.name);
      
      // Show success message
      alert(`Workflow "${workflowData.name}" has been ${selectedWorkflow ? 'updated' : 'created'} successfully!`);
      
      setSelectedWorkflow(null);
      
    } catch (error) {
      console.error('❌ Error saving workflow:', error);
      throw error; // Re-throw to be handled by the modal
    }
  };

  const deleteWorkflow = (workflowId) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    if (confirm(`Are you sure you want to delete the workflow "${workflow.name}"?\n\nThis action cannot be undone.`)) {
      const updatedWorkflows = workflows.filter(w => w.id !== workflowId);
      setWorkflows(updatedWorkflows);
      localStorage.setItem('sentrabase_workflows', JSON.stringify(updatedWorkflows));
      
      console.log('✅ Workflow deleted:', workflow.name);
      alert(`Workflow "${workflow.name}" has been deleted.`);
    }
  };

  const exportWorkflows = () => {
    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        totalWorkflows: workflows.length,
        workflows: workflows.map(workflow => ({
          ...workflow,
          // Include team member names for reference
          ownerName: getMemberName(workflow.owner),
          collaboratorNames: workflow.collaborators?.map(id => getMemberName(id)) || []
        })),
        teamMembers: teamMembers.map(member => ({
          id: member.id,
          name: member.name,
          role: member.role,
          department: member.department
        })),
        statistics: workflowStats
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sentrabase-workflows-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('✅ Workflows exported successfully');
      alert(`Successfully exported ${workflows.length} workflows!\n\nFile: sentrabase-workflows-${new Date().toISOString().split('T')[0]}.json`);
      
    } catch (error) {
      console.error('❌ Error exporting workflows:', error);
      alert('Failed to export workflows. Please try again.');
    }
  };

  const getMemberName = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : memberId;
  };

  const getStepIcon = (stepType) => {
    switch (stepType) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'delay': return <Clock className="w-4 h-4" />;
      case 'task': return <CheckCircle className="w-4 h-4" />;
      case 'notification': return <Bell className="w-4 h-4" />;
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         workflow.status === filterBy ||
                         workflow.category === filterBy ||
                         workflow.priority === filterBy;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Team Workflow Automation</h2>
          <p className="text-gray-400">Collaborative workflow management with team assignments</p>
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
            onClick={() => {
              setSelectedWorkflow(null);
              setShowWorkflowBuilder(true);
            }}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Enhanced Stats with Team Info */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
              <p className="text-sm text-gray-400">Team Members</p>
              <p className="text-2xl font-bold text-white">{teamMembers.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Completed Today</p>
              <p className="text-2xl font-bold text-white">{workflowStats.totalCompleted}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
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
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
        >
          <option value="all">All Workflows</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
          <option value="critical">Critical Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      {/* Workflows List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Team Workflows</h3>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(workflow.priority)}`}>
                        {workflow.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => duplicateWorkflow(workflow.id)}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedWorkflow(workflow);
                          setShowWorkflowBuilder(true);
                        }}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => deleteWorkflow(workflow.id)}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => setSelectedWorkflow(workflow)}
                        size="sm"
                        variant="outline"
                        className="border-cyan-400 text-cyan-400"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{workflow.description}</p>
                  
                  {/* Team Info */}
                  <div className="flex items-center space-x-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">Owner: {getMemberName(workflow.owner)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">
                        {workflow.collaborators?.length || 0} collaborators
                      </span>
                    </div>
                  </div>
                  
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
                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-400">Triggered:</span>
                      <span className="text-white ml-2 font-semibold">{workflow.stats?.triggered || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Success Rate:</span>
                      <span className="text-white ml-2 font-semibold">{workflow.stats?.success_rate || 0}%</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Avg Time:</span>
                      <span className="text-white ml-2 font-semibold">{workflow.stats?.avg_completion_time || 'N/A'}</span>
                    </div>
                  </div>
                  
                  {/* Team Performance */}
                  {workflow.stats?.team_performance && (
                    <div className="bg-slate-700 rounded-lg p-3">
                      <h5 className="text-sm font-medium text-white mb-2">Team Performance</h5>
                      <div className="space-y-1">
                        {Object.entries(workflow.stats.team_performance).map(([memberId, perf]) => (
                          <div key={memberId} className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">{getMemberName(memberId)}</span>
                            <span className="text-gray-400">
                              {perf.tasks} tasks, {perf.completion_rate}% completion
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Team Workload Sidebar */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 rounded-lg overflow-hidden"
          >
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Team Workload</h3>
            </div>
            
            <div className="p-6 space-y-4">
              {Object.entries(workflowStats.teamWorkload || {}).map(([memberId, workload]) => (
                <div key={memberId} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{workload.name}</h4>
                    <span className="text-xs text-gray-400">
                      {workload.assignedWorkflows} workflows
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Active Tasks:</span>
                    <span className="text-white font-semibold">{workload.activeTasks}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 rounded-lg overflow-hidden mt-6"
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
                      <p className="text-xs text-gray-500">
                        {activity.user} • {activity.customer} • {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Workflow Builder Modal */}
      <WorkflowBuilderModal
        isOpen={showWorkflowBuilder}
        onClose={() => {
          setShowWorkflowBuilder(false);
          setSelectedWorkflow(null);
        }}
        onSave={saveWorkflow}
        teamMembers={teamMembers}
        workflow={selectedWorkflow}
      />
    </div>
  );
};

export default EnhancedWorkflowAutomation;
