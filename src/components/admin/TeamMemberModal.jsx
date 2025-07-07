import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Award,
  Target,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const TeamMemberModal = ({ isOpen, onClose, member, onSendMessage, onAssignTask, onEdit }) => {
  if (!isOpen || !member) return null;

  const getUtilizationColor = (utilization) => {
    if (utilization >= 90) return 'text-red-400 bg-red-500/20';
    if (utilization >= 80) return 'text-orange-400 bg-orange-500/20';
    if (utilization >= 60) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-green-400 bg-green-500/20';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'busy': return 'text-yellow-400 bg-yellow-500/20';
      case 'offline': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400';
      case 'sales_manager': return 'bg-blue-500/20 text-blue-400';
      case 'sales_executive': return 'bg-green-500/20 text-green-400';
      case 'support_lead': return 'bg-purple-500/20 text-purple-400';
      case 'support_agent': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{member.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                  {member.role.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white">{member.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Join Date</p>
                  <p className="text-white">{new Date(member.joinDate).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Activity className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Department</p>
                  <p className="text-white">{member.department}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Performance Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{member.stats.tasksCompleted}</div>
                <div className="text-sm text-gray-400">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{member.stats.responseTime}</div>
                <div className="text-sm text-gray-400">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{member.stats.customersSatisfaction}%</div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{member.stats.workflowsManaged}</div>
                <div className="text-sm text-gray-400">Workflows</div>
              </div>
            </div>
          </div>

          {/* Workload Analysis */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Workload Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Current Workload</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${getUtilizationColor(member.workload.utilization)}`}>
                    {member.workload.current}/{member.workload.capacity} ({member.workload.utilization}%)
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      member.workload.utilization >= 90 ? 'bg-red-500' :
                      member.workload.utilization >= 80 ? 'bg-orange-500' :
                      member.workload.utilization >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(member.workload.utilization, 100)}%` }}
                  />
                </div>
              </div>
              
              {member.workload.utilization >= 90 && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">
                    Workload is critically high. Consider redistributing tasks.
                  </span>
                </div>
              )}
              
              {member.workload.utilization >= 80 && member.workload.utilization < 90 && (
                <div className="flex items-center space-x-2 p-3 bg-orange-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-400">
                    Workload is high. Monitor closely for potential overload.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Permissions & Access
            </h3>
            <div className="flex flex-wrap gap-2">
              {member.permissions.map((permission, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-600 text-sm text-gray-300 rounded-full"
                >
                  {permission}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => onSendMessage(member.id, `Hi ${member.name.split(' ')[0]}, quick check-in: How are things going?`)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button
                onClick={() => onAssignTask(member.id, { title: 'New task assignment', priority: 'medium' })}
                className="bg-green-500 hover:bg-green-600"
                disabled={member.workload.utilization >= 95}
              >
                <Target className="w-4 h-4 mr-2" />
                Assign Task
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => onEdit && onEdit(member)}
                variant="outline"
                className="border-cyan-400 text-cyan-400"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-500 text-gray-400"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamMemberModal;
