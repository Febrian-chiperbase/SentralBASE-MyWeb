import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Plus, 
  Trash2,
  Save,
  Zap,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle,
  Bell,
  Users,
  Target,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const WorkflowBuilderModal = ({ isOpen, onClose, onSave, teamMembers, workflow = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: 'customer_registered',
    category: 'onboarding',
    priority: 'medium',
    owner: '',
    collaborators: [],
    status: 'draft',
    steps: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (workflow) {
      // Edit existing workflow
      setFormData({
        name: workflow.name || '',
        description: workflow.description || '',
        trigger: workflow.trigger || 'customer_registered',
        category: workflow.category || 'onboarding',
        priority: workflow.priority || 'medium',
        owner: workflow.owner || '',
        collaborators: workflow.collaborators || [],
        status: workflow.status || 'draft',
        steps: workflow.steps || []
      });
    } else {
      // New workflow - reset form
      setFormData({
        name: '',
        description: '',
        trigger: 'customer_registered',
        category: 'onboarding',
        priority: 'medium',
        owner: teamMembers[0]?.id || '',
        collaborators: [],
        status: 'draft',
        steps: [
          {
            type: 'delay',
            duration: 5,
            unit: 'minutes',
            description: 'Wait before first action'
          }
        ]
      });
    }
  }, [workflow, teamMembers, isOpen]);

  const stepTypes = [
    { id: 'delay', name: 'Delay', icon: Clock, description: 'Wait for specified time' },
    { id: 'email', name: 'Send Email', icon: Mail, description: 'Send automated email' },
    { id: 'whatsapp', name: 'WhatsApp Message', icon: MessageSquare, description: 'Send WhatsApp message' },
    { id: 'task', name: 'Create Task', icon: CheckCircle, description: 'Assign task to team member' },
    { id: 'notification', name: 'Send Notification', icon: Bell, description: 'Internal notification' }
  ];

  const triggerOptions = [
    { id: 'customer_registered', name: 'Customer Registered', description: 'When new customer signs up' },
    { id: 'cart_abandoned', name: 'Cart Abandoned', description: 'When customer leaves without completing' },
    { id: 'payment_completed', name: 'Payment Completed', description: 'When payment is successful' },
    { id: 'high_value_lead', name: 'High Value Lead', description: 'When high-value customer detected' },
    { id: 'support_ticket', name: 'Support Ticket', description: 'When support ticket is created' },
    { id: 'manual_trigger', name: 'Manual Trigger', description: 'Manually triggered workflow' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Workflow name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.owner) {
      newErrors.owner = 'Workflow owner is required';
    }

    if (formData.steps.length === 0) {
      newErrors.steps = 'At least one step is required';
    }

    // Validate each step
    formData.steps.forEach((step, index) => {
      if (step.type === 'delay' && (!step.duration || step.duration <= 0)) {
        newErrors[`step_${index}`] = 'Delay duration must be greater than 0';
      }
      if ((step.type === 'email' || step.type === 'whatsapp') && !step.template) {
        newErrors[`step_${index}`] = 'Template/message is required';
      }
      if (step.type === 'task' && !step.assignTo) {
        newErrors[`step_${index}`] = 'Task assignee is required';
      }
    });

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
      const workflowData = {
        ...formData,
        id: workflow?.id || `workflow_${Date.now()}`,
        createdAt: workflow?.createdAt || Date.now(),
        updatedAt: Date.now(),
        stats: workflow?.stats || {
          triggered: 0,
          completed: 0,
          success_rate: 0,
          avg_completion_time: '0 minutes',
          team_performance: {}
        }
      };

      await onSave(workflowData);
      onClose();
      
    } catch (error) {
      console.error('Error saving workflow:', error);
      setErrors({ submit: 'Failed to save workflow. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addStep = (stepType) => {
    const newStep = {
      type: stepType,
      description: `${stepTypes.find(t => t.id === stepType)?.name} step`,
      assignedTo: null
    };

    // Add type-specific properties
    switch (stepType) {
      case 'delay':
        newStep.duration = 30;
        newStep.unit = 'minutes';
        break;
      case 'email':
        newStep.template = '';
        newStep.subject = '';
        break;
      case 'whatsapp':
        newStep.template = '';
        newStep.message = '';
        break;
      case 'task':
        newStep.assignTo = '';
        newStep.title = '';
        newStep.priority = 'medium';
        break;
      case 'notification':
        newStep.target = 'owner';
        newStep.message = '';
        break;
    }

    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const updateStep = (index, updates) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, ...updates } : step
      )
    }));
  };

  const removeStep = (index) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const moveStep = (index, direction) => {
    const newSteps = [...formData.steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newSteps.length) {
      [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
      setFormData(prev => ({ ...prev, steps: newSteps }));
    }
  };

  const renderStepEditor = (step, index) => {
    const StepIcon = stepTypes.find(t => t.id === step.type)?.icon || Settings;

    return (
      <div key={index} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <StepIcon className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-white">
              Step {index + 1}: {stepTypes.find(t => t.id === step.type)?.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              onClick={() => moveStep(index, 'up')}
              size="sm"
              variant="outline"
              className="border-gray-500"
              disabled={index === 0}
            >
              <ArrowUp className="w-3 h-3" />
            </Button>
            <Button
              type="button"
              onClick={() => moveStep(index, 'down')}
              size="sm"
              variant="outline"
              className="border-gray-500"
              disabled={index === formData.steps.length - 1}
            >
              <ArrowDown className="w-3 h-3" />
            </Button>
            <Button
              type="button"
              onClick={() => removeStep(index)}
              size="sm"
              className="bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <Input
              value={step.description || ''}
              onChange={(e) => updateStep(index, { description: e.target.value })}
              placeholder="Step description"
              className="bg-slate-600 border-slate-500 text-white"
            />
          </div>

          {step.type === 'delay' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Duration
                </label>
                <Input
                  type="number"
                  value={step.duration || ''}
                  onChange={(e) => updateStep(index, { duration: parseInt(e.target.value) })}
                  min="1"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Unit
                </label>
                <select
                  value={step.unit || 'minutes'}
                  onChange={(e) => updateStep(index, { unit: e.target.value })}
                  className="w-full bg-slate-600 border border-slate-500 text-white rounded-md px-3 py-2"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          )}

          {step.type === 'email' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Subject
                </label>
                <Input
                  value={step.subject || ''}
                  onChange={(e) => updateStep(index, { subject: e.target.value })}
                  placeholder="Email subject"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Template/Message
                </label>
                <textarea
                  value={step.template || ''}
                  onChange={(e) => updateStep(index, { template: e.target.value })}
                  placeholder="Email content"
                  rows={3}
                  className="w-full bg-slate-600 border border-slate-500 text-white rounded-md px-3 py-2"
                />
              </div>
            </div>
          )}

          {step.type === 'whatsapp' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Message
              </label>
              <textarea
                value={step.message || ''}
                onChange={(e) => updateStep(index, { message: e.target.value })}
                placeholder="WhatsApp message"
                rows={3}
                className="w-full bg-slate-600 border border-slate-500 text-white rounded-md px-3 py-2"
              />
            </div>
          )}

          {step.type === 'task' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Task Title
                </label>
                <Input
                  value={step.title || ''}
                  onChange={(e) => updateStep(index, { title: e.target.value })}
                  placeholder="Task title"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Assign To
                  </label>
                  <select
                    value={step.assignTo || ''}
                    onChange={(e) => updateStep(index, { assignTo: e.target.value })}
                    className="w-full bg-slate-600 border border-slate-500 text-white rounded-md px-3 py-2"
                  >
                    <option value="">Select team member</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={step.priority || 'medium'}
                    onChange={(e) => updateStep(index, { priority: e.target.value })}
                    className="w-full bg-slate-600 border border-slate-500 text-white rounded-md px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step.type === 'notification' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Target
                </label>
                <select
                  value={step.target || 'owner'}
                  onChange={(e) => updateStep(index, { target: e.target.value })}
                  className="w-full bg-slate-600 border border-slate-500 text-white rounded-md px-3 py-2"
                >
                  <option value="owner">Workflow Owner</option>
                  <option value="all_team">All Team Members</option>
                  <option value="sales_team">Sales Team</option>
                  <option value="support_team">Support Team</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <Input
                  value={step.message || ''}
                  onChange={(e) => updateStep(index, { message: e.target.value })}
                  placeholder="Notification message"
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
            </div>
          )}

          {errors[`step_${index}`] && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>{errors[`step_${index}`]}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {workflow ? 'Edit Workflow' : 'Create New Workflow'}
              </h2>
              <p className="text-sm text-gray-400">
                {workflow ? 'Modify existing workflow' : 'Build automated customer journey'}
              </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Workflow Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter workflow name"
                  className={`bg-slate-700 border-slate-600 text-white ${errors.name ? 'border-red-500' : ''}`}
                  required
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this workflow does"
                  rows={3}
                  className={`w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 ${errors.description ? 'border-red-500' : ''}`}
                  required
                />
                {errors.description && (
                  <p className="text-red-400 text-xs mt-1">{errors.description}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trigger Event
                </label>
                <select
                  value={formData.trigger}
                  onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  {triggerOptions.map(trigger => (
                    <option key={trigger.id} value={trigger.id}>
                      {trigger.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {triggerOptions.find(t => t.id === formData.trigger)?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="onboarding">Onboarding</option>
                    <option value="conversion">Conversion</option>
                    <option value="retention">Retention</option>
                    <option value="support">Support</option>
                    <option value="nurturing">Nurturing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Owner *
                </label>
                <select
                  value={formData.owner}
                  onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                  className={`w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 ${errors.owner ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select owner</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                {errors.owner && (
                  <p className="text-red-400 text-xs mt-1">{errors.owner}</p>
                )}
              </div>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Workflow Steps</h3>
              <div className="flex items-center space-x-2">
                {stepTypes.map(stepType => (
                  <Button
                    key={stepType.id}
                    type="button"
                    onClick={() => addStep(stepType.id)}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <stepType.icon className="w-3 h-3 mr-1" />
                    {stepType.name}
                  </Button>
                ))}
              </div>
            </div>

            {errors.steps && (
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>{errors.steps}</span>
              </div>
            )}

            <div className="space-y-4">
              {formData.steps.map((step, index) => (
                <div key={index}>
                  {renderStepEditor(step, index)}
                  {index < formData.steps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </div>
              ))}
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {workflow ? 'Update Workflow' : 'Create Workflow'}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default WorkflowBuilderModal;
