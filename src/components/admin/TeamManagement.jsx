import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Mail, 
  Phone, 
  Shield, 
  Award,
  Activity,
  Clock,
  Target,
  TrendingUp,
  Edit,
  Trash2,
  MoreVertical,
  MessageSquare,
  Bell,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TeamMemberModal from './TeamMemberModal';
import AddMemberModal from './AddMemberModal';

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = () => {
    // Load team data from localStorage or initialize default
    const savedTeam = localStorage.getItem('sentrabase_team');
    if (savedTeam) {
      setTeamMembers(JSON.parse(savedTeam));
    } else {
      // Initialize with default team structure
      const defaultTeam = [
        {
          id: 'admin_1',
          name: 'Admin SentraBASE',
          email: 'admin@sentrabase.com',
          phone: '+62812345678',
          role: 'admin',
          department: 'Management',
          status: 'active',
          avatar: null,
          joinDate: '2024-01-01',
          permissions: ['all'],
          stats: {
            tasksCompleted: 45,
            responseTime: '2.5 min',
            customersSatisfaction: 98,
            workflowsManaged: 12
          },
          workload: {
            current: 8,
            capacity: 15,
            utilization: 53
          }
        },
        {
          id: 'sales_1',
          name: 'Sarah Sales Manager',
          email: 'sarah@sentrabase.com',
          phone: '+62812345679',
          role: 'sales_manager',
          department: 'Sales',
          status: 'active',
          avatar: null,
          joinDate: '2024-01-15',
          permissions: ['sales', 'customers', 'reports'],
          stats: {
            tasksCompleted: 67,
            responseTime: '1.8 min',
            customersSatisfaction: 95,
            workflowsManaged: 8
          },
          workload: {
            current: 12,
            capacity: 20,
            utilization: 60
          }
        },
        {
          id: 'support_1',
          name: 'David Support Lead',
          email: 'david@sentrabase.com',
          phone: '+62812345680',
          role: 'support_lead',
          department: 'Customer Support',
          status: 'active',
          avatar: null,
          joinDate: '2024-02-01',
          permissions: ['support', 'customers', 'workflows'],
          stats: {
            tasksCompleted: 89,
            responseTime: '1.2 min',
            customersSatisfaction: 97,
            workflowsManaged: 15
          },
          workload: {
            current: 18,
            capacity: 25,
            utilization: 72
          }
        },
        {
          id: 'sales_2',
          name: 'Lisa Sales Executive',
          email: 'lisa@sentrabase.com',
          phone: '+62812345681',
          role: 'sales_executive',
          department: 'Sales',
          status: 'active',
          avatar: null,
          joinDate: '2024-02-15',
          permissions: ['sales', 'customers'],
          stats: {
            tasksCompleted: 34,
            responseTime: '3.1 min',
            customersSatisfaction: 92,
            workflowsManaged: 5
          },
          workload: {
            current: 6,
            capacity: 15,
            utilization: 40
          }
        }
      ];
      
      setTeamMembers(defaultTeam);
      localStorage.setItem('sentrabase_team', JSON.stringify(defaultTeam));
    }

    // Load roles
    const defaultRoles = [
      {
        id: 'admin',
        name: 'Administrator',
        permissions: ['all'],
        color: 'red',
        description: 'Full system access'
      },
      {
        id: 'sales_manager',
        name: 'Sales Manager',
        permissions: ['sales', 'customers', 'reports', 'team_management'],
        color: 'blue',
        description: 'Manage sales team and processes'
      },
      {
        id: 'sales_executive',
        name: 'Sales Executive',
        permissions: ['sales', 'customers'],
        color: 'green',
        description: 'Handle customer sales and follow-ups'
      },
      {
        id: 'support_lead',
        name: 'Support Lead',
        permissions: ['support', 'customers', 'workflows'],
        color: 'purple',
        description: 'Lead customer support operations'
      },
      {
        id: 'support_agent',
        name: 'Support Agent',
        permissions: ['support', 'customers'],
        color: 'yellow',
        description: 'Provide customer support'
      }
    ];
    
    setRoles(defaultRoles);
  };

  const getRoleInfo = (roleId) => {
    return roles.find(role => role.id === roleId) || { name: roleId, color: 'gray' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'busy': return 'text-yellow-400 bg-yellow-500/20';
      case 'offline': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getUtilizationColor = (utilization) => {
    if (utilization >= 95) return 'text-red-400';
    if (utilization >= 80) return 'text-orange-400';
    if (utilization >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const assignTask = (memberId, task) => {
    // Simulate task assignment with proper workload calculation
    console.log(`Assigning task to ${memberId}:`, task);
    
    // Update member workload with validation
    const updatedMembers = teamMembers.map(member => {
      if (member.id === memberId) {
        const newCurrent = member.workload.current + 1;
        const newUtilization = Math.min(Math.round((newCurrent / member.workload.capacity) * 100), 100);
        
        return {
          ...member,
          workload: {
            ...member.workload,
            current: Math.min(newCurrent, member.workload.capacity), // Don't exceed capacity
            utilization: newUtilization
          },
          stats: {
            ...member.stats,
            tasksCompleted: member.stats.tasksCompleted + (task.priority === 'high' ? 0 : 0) // Only increment when completed
          }
        };
      }
      return member;
    });
    
    setTeamMembers(updatedMembers);
    localStorage.setItem('sentrabase_team', JSON.stringify(updatedMembers));
    
    // Show success message
    const memberName = teamMembers.find(m => m.id === memberId)?.name;
    alert(`Task "${task.title}" assigned to ${memberName} successfully!`);
  };

  const sendMessage = (memberId, message) => {
    // Simulate internal messaging
    const memberName = teamMembers.find(m => m.id === memberId)?.name;
    console.log(`Sending message to ${memberId}:`, message);
    alert(`Message sent to ${memberName}:\n\n"${message}"\n\nIn a real system, this would send via internal chat or email.`);
  };

  const viewMemberDetails = (member) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  const editMemberProfile = (member) => {
    // For now, just show an alert. In a real system, this would open an edit form
    alert(`Edit profile for ${member.name}\n\nThis would open an edit form in a real system.`);
  };

  const getWorkloadStatus = (utilization) => {
    if (utilization >= 95) return { status: 'Overloaded', color: 'text-red-400' };
    if (utilization >= 80) return { status: 'High Load', color: 'text-orange-400' };
    if (utilization >= 60) return { status: 'Moderate', color: 'text-yellow-400' };
    return { status: 'Available', color: 'text-green-400' };
  };

  const saveMember = async (newMember) => {
    try {
      // Check if email already exists
      const emailExists = teamMembers.some(member => 
        member.email.toLowerCase() === newMember.email.toLowerCase()
      );
      
      if (emailExists) {
        throw new Error('A team member with this email already exists');
      }

      // Add new member to team
      const updatedMembers = [...teamMembers, newMember];
      setTeamMembers(updatedMembers);
      localStorage.setItem('sentrabase_team', JSON.stringify(updatedMembers));
      
      console.log('✅ New team member added:', newMember.name);
      
      // Show success message
      alert(`Team member "${newMember.name}" has been added successfully!\n\nRole: ${newMember.role}\nDepartment: ${newMember.department}\nEmail: ${newMember.email}`);
      
    } catch (error) {
      console.error('❌ Error adding team member:', error);
      throw error; // Re-throw to be handled by the modal
    }
  };

  const deleteMember = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    // Prevent deleting the main admin
    if (member.role === 'admin' && teamMembers.filter(m => m.role === 'admin').length === 1) {
      alert('Cannot delete the last administrator. Please assign admin role to another member first.');
      return;
    }

    if (confirm(`Are you sure you want to remove ${member.name} from the team?\n\nThis action cannot be undone.`)) {
      const updatedMembers = teamMembers.filter(m => m.id !== memberId);
      setTeamMembers(updatedMembers);
      localStorage.setItem('sentrabase_team', JSON.stringify(updatedMembers));
      
      console.log('✅ Team member removed:', member.name);
      alert(`${member.name} has been removed from the team.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Team Management</h2>
          <p className="text-gray-400">Manage team members, roles, and collaboration</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowAddMember(true)}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Members</p>
              <p className="text-2xl font-bold text-white">{teamMembers.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
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
              <p className="text-sm text-gray-400">Active Members</p>
              <p className="text-2xl font-bold text-green-400">
                {teamMembers.filter(m => m.status === 'active').length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
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
              <p className="text-sm text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-bold text-white">
                {teamMembers.length > 0 
                  ? (teamMembers.reduce((sum, m) => {
                      const responseTime = parseFloat(m.stats?.responseTime?.toString().replace(' min', '') || '0');
                      return sum + responseTime;
                    }, 0) / teamMembers.length).toFixed(1)
                  : '0'} min
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-400" />
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
              <p className="text-sm text-gray-400">Team Satisfaction</p>
              <p className="text-2xl font-bold text-white">
                {teamMembers.length > 0 
                  ? Math.round(teamMembers.reduce((sum, m) => sum + m.stats.customersSatisfaction, 0) / teamMembers.length)
                  : 0}%
              </p>
            </div>
            <Award className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teamMembers.map((member) => {
          const roleInfo = getRoleInfo(member.role);
          const workloadStatus = getWorkloadStatus(member.workload.utilization);
          
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700/50 transition-colors"
            >
              {/* Member Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${roleInfo.color}-500/20 text-${roleInfo.color}-400`}>
                        {roleInfo.name}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => sendMessage(member.id, 'Quick check-in: How are things going?')}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <MessageSquare className="w-3 h-3" />
                  </Button>
                  <Button
                    onClick={() => assignTask(member.id, { title: 'Follow up customer', priority: 'medium' })}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                    disabled={member.workload.utilization >= 95}
                  >
                    <Target className="w-3 h-3" />
                  </Button>
                  {/* Only show delete for non-admin or if there are multiple admins */}
                  {(member.role !== 'admin' || teamMembers.filter(m => m.role === 'admin').length > 1) && (
                    <Button
                      onClick={() => deleteMember(member.id)}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>{member.phone}</span>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Tasks Done</span>
                    <span className="text-lg font-bold text-white">{member.stats.tasksCompleted}</span>
                  </div>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Response Time</span>
                    <span className="text-lg font-bold text-white">{member.stats.responseTime}</span>
                  </div>
                </div>
              </div>

              {/* Workload with Fixed Logic */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Workload</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getUtilizationColor(member.workload.utilization)}`}>
                      {member.workload.current}/{member.workload.capacity} ({member.workload.utilization}%)
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${workloadStatus.color} bg-current/20`}>
                      {workloadStatus.status}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      member.workload.utilization >= 95 ? 'bg-red-500' :
                      member.workload.utilization >= 80 ? 'bg-orange-500' :
                      member.workload.utilization >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(member.workload.utilization, 100)}%` }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => assignTask(member.id, { title: 'High priority follow-up', priority: 'high' })}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                  disabled={member.workload.utilization >= 95}
                >
                  {member.workload.utilization >= 95 ? 'Overloaded' : 'Urgent Task'}
                </Button>
                <Button
                  onClick={() => viewMemberDetails(member)}
                  size="sm"
                  variant="outline"
                  className="flex-1 border-cyan-400 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Role Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-lg p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Team Roles & Permissions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div key={role.id} className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">{role.name}</h4>
                <div className={`w-3 h-3 bg-${role.color}-500 rounded-full`} />
              </div>
              <p className="text-sm text-gray-400 mb-3">{role.description}</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="px-2 py-1 bg-slate-600 text-xs text-gray-300 rounded"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Team Member Details Modal */}
      <TeamMemberModal
        isOpen={showMemberModal}
        onClose={() => {
          setShowMemberModal(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSendMessage={sendMessage}
        onAssignTask={assignTask}
        onEdit={editMemberProfile}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        onSave={saveMember}
        roles={roles}
      />
    </div>
  );
};

export default TeamManagement;
