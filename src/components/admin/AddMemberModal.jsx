import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Building,
  Calendar,
  Save,
  UserPlus,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AddMemberModal = ({ isOpen, onClose, onSave, roles }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'sales_executive',
    department: 'Sales',
    status: 'active',
    permissions: ['sales', 'customers']
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s|-/g, ''))) {
      newErrors.phone = 'Please enter a valid Indonesian phone number';
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
      // Create new member object
      const newMember = {
        id: `member_${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        role: formData.role,
        department: formData.department,
        status: formData.status,
        avatar: null,
        joinDate: new Date().toISOString().split('T')[0],
        permissions: formData.permissions,
        stats: {
          tasksCompleted: 0,
          responseTime: '0 min',
          customersSatisfaction: 85,
          workflowsManaged: 0
        },
        workload: {
          current: 0,
          capacity: 15,
          utilization: 0
        }
      };

      // Call parent save function
      await onSave(newMember);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'sales_executive',
        department: 'Sales',
        status: 'active',
        permissions: ['sales', 'customers']
      });
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Error adding member:', error);
      setErrors({ submit: 'Failed to add member. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (newRole) => {
    setFormData(prev => {
      const roleInfo = roles.find(r => r.id === newRole);
      return {
        ...prev,
        role: newRole,
        permissions: roleInfo ? roleInfo.permissions : ['basic'],
        department: getDepartmentForRole(newRole)
      };
    });
  };

  const getDepartmentForRole = (role) => {
    switch (role) {
      case 'admin': return 'Management';
      case 'sales_manager': return 'Sales';
      case 'sales_executive': return 'Sales';
      case 'support_lead': return 'Customer Support';
      case 'support_agent': return 'Customer Support';
      default: return 'General';
    }
  };

  const getRoleInfo = (roleId) => {
    return roles.find(role => role.id === roleId) || { name: roleId, color: 'gray' };
  };

  if (!isOpen) return null;

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
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Add New Team Member</h2>
              <p className="text-sm text-gray-400">Add a new member to your team</p>
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
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                  className={`bg-slate-700 border-slate-600 text-white ${errors.name ? 'border-red-500' : ''}`}
                  required
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                  className={`bg-slate-700 border-slate-600 text-white ${errors.email ? 'border-red-500' : ''}`}
                  required
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g., +62812345678"
                  className={`bg-slate-700 border-slate-600 text-white ${errors.phone ? 'border-red-500' : ''}`}
                  required
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Role & Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Role & Permissions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {getRoleInfo(formData.role).description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Department
                </label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="bg-slate-700 border-slate-600 text-white"
                  readOnly
                />
              </div>
            </div>

            {/* Permissions Display */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Permissions
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.permissions.map((permission, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-600 text-sm text-gray-300 rounded-full"
                  >
                    {permission}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Permissions are automatically assigned based on the selected role
              </p>
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
                  Adding...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Add Member
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddMemberModal;
