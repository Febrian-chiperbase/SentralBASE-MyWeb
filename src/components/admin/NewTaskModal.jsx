import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  CheckSquare, 
  User, 
  Calendar,
  Clock,
  Flag,
  Target,
  FileText,
  Save,
  AlertTriangle,
  Users,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NewTaskModal = ({ isOpen, onClose, onSave, teamMembers, customers = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    estimatedTime: 60,
    tags: [],
    customerId: '',
    customerName: '',
    workflowId: null,
    type: 'general'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');

  const taskTypes = [
    { id: 'general', name: 'General Task', description: 'General business task' },
    { id: 'follow_up', name: 'Customer Follow-up', description: 'Follow up with customer' },
    { id: 'demo', name: 'Product Demo', description: 'Schedule product demonstration' },
    { id: 'support', name: 'Customer Support', description: 'Provide customer support' },
    { id: 'sales', name: 'Sales Activity', description: 'Sales-related task' },
    { id: 'meeting', name: 'Meeting/Call', description: 'Schedule meeting or call' }
  ];

  const priorityOptions = [
    { id: 'low', name: 'Low', color: 'text-green-400', description: 'Can be done later' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-400', description: 'Normal priority' },
    { id: 'high', name: 'High', color: 'text-orange-400', description: 'Important task' },
    { id: 'critical', name: 'Critical', color: 'text-red-400', description: 'Urgent - needs immediate attention' }
  ];

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }

    // Assignee validation
    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign this task to a team member';
    }

    // Due date validation
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    // Estimated time validation
    if (!formData.estimatedTime || formData.estimatedTime <= 0) {
      newErrors.estimatedTime = 'Estimated time must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new task object
      const newTask = {
        id: `task_${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        assignedTo: formData.assignedTo,
        assignedBy: 'current_user', // In real app, get from auth
        priority: formData.priority,
        status: formData.status,
        type: formData.type,
        dueDate: new Date(formData.dueDate).getTime(),
        createdAt: Date.now(),
        estimatedTime: parseInt(formData.estimatedTime),
        tags: formData.tags,
        customerId: formData.customerId || null,
        customerName: formData.customerName || null,
        workflowId: formData.workflowId,
        comments: [],
        attachments: [],
        progress: 0
      };

      // Call parent save function
      await onSave(newTask);
      
      // Reset form
      resetForm();
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Error creating task:', error);
      setErrors({ submit: 'Failed to create task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      estimatedTime: 60,
      tags: [],
      customerId: '',
      customerName: '',
      workflowId: null,
      type: 'general'
    });
    setErrors({});
    setNewTag('');
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim().toLowerCase()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getMemberName = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const getAvailableMembers = () => {
    // Filter out overloaded members (>95% utilization)
    return teamMembers.filter(member => 
      !member.workload || member.workload.utilization < 95
    );
  };

  const getMemberWorkload = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member?.workload?.utilization || 0;
  };

  const getWorkloadColor = (utilization) => {
    if (utilization >= 90) return 'text-red-400';
    if (utilization >= 70) return 'text-orange-400';
    if (utilization >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Create New Task</h2>
              <p className="text-sm text-gray-400">Assign a new task to your team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Submit Error */}
          {errors.submit && (
            <div className="flex items-center space-x-2 p-3 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">{errors.submit}</span>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Task Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Task Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                  className={`bg-slate-700 border-slate-600 text-white ${errors.title ? 'border-red-500' : ''}`}
                  required
                />
                {errors.title && (
                  <p className="text-red-400 text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what needs to be done"
                  rows={3}
                  className={`w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 resize-none ${errors.description ? 'border-red-500' : ''}`}
                  required
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Task Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  {taskTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {taskTypes.find(t => t.id === formData.type)?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  {priorityOptions.map(priority => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
                <p className={`text-xs mt-1 ${priorityOptions.find(p => p.id === formData.priority)?.color}`}>
                  {priorityOptions.find(p => p.id === formData.priority)?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Assignment & Timing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Assignment & Timing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Assign To *
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className={`w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 ${errors.assignedTo ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select team member</option>
                  {getAvailableMembers().map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({getMemberWorkload(member.id)}% workload)
                    </option>
                  ))}
                </select>
                {errors.assignedTo && (
                  <p className="text-red-400 text-xs mt-1">{errors.assignedTo}</p>
                )}
                {formData.assignedTo && (
                  <p className={`text-xs mt-1 ${getWorkloadColor(getMemberWorkload(formData.assignedTo))}`}>
                    Current workload: {getMemberWorkload(formData.assignedTo)}%
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Due Date *
                </label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className={`bg-slate-700 border-slate-600 text-white ${errors.dueDate ? 'border-red-500' : ''}`}
                  required
                />
                {errors.dueDate && (
                  <p className="text-red-400 text-xs mt-1">{errors.dueDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estimated Time (minutes)
                </label>
                <Input
                  type="number"
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  min="15"
                  step="15"
                  className={`bg-slate-700 border-slate-600 text-white ${errors.estimatedTime ? 'border-red-500' : ''}`}
                />
                {errors.estimatedTime && (
                  <p className="text-red-400 text-xs mt-1">{errors.estimatedTime}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {formData.estimatedTime ? `${Math.round(formData.estimatedTime / 60 * 10) / 10} hours` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Information (Optional) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Customer Information (Optional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customer Name
                </label>
                <Input
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Enter customer name"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customer ID
                </label>
                <Input
                  value={formData.customerId}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                  placeholder="Enter customer ID"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Tags
            </h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="bg-slate-700 border-slate-600 text-white flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Add
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-600 text-sm text-gray-300 rounded-full flex items-center space-x-2"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-700">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-gray-500 text-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Task
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NewTaskModal;
