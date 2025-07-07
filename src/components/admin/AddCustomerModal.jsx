import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Building,
  MapPin,
  CreditCard,
  Calendar,
  Save,
  AlertTriangle,
  Users,
  Globe,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AddCustomerModal = ({ isOpen, onClose, onSave, customer = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    website: '',
    industry: 'healthcare',
    customerType: 'prospect',
    source: 'website',
    notes: '',
    budget: '',
    employees: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (customer) {
      // Edit existing customer
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        position: customer.position || '',
        address: customer.address || '',
        city: customer.city || '',
        province: customer.province || '',
        postalCode: customer.postalCode || '',
        website: customer.website || '',
        industry: customer.industry || 'healthcare',
        customerType: customer.customerType || 'prospect',
        source: customer.source || 'website',
        notes: customer.notes || '',
        budget: customer.budget || '',
        employees: customer.employees || ''
      });
    } else {
      // Reset form for new customer
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        website: '',
        industry: 'healthcare',
        customerType: 'prospect',
        source: 'website',
        notes: '',
        budget: '',
        employees: ''
      });
    }
  }, [customer, isOpen]);

  const industryOptions = [
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'education', name: 'Education' },
    { id: 'retail', name: 'Retail' },
    { id: 'manufacturing', name: 'Manufacturing' },
    { id: 'finance', name: 'Finance' },
    { id: 'technology', name: 'Technology' },
    { id: 'government', name: 'Government' },
    { id: 'hospitality', name: 'Hospitality' },
    { id: 'other', name: 'Other' }
  ];

  const customerTypeOptions = [
    { id: 'prospect', name: 'Prospect', description: 'Potential customer' },
    { id: 'lead', name: 'Lead', description: 'Qualified lead' },
    { id: 'customer', name: 'Customer', description: 'Active customer' },
    { id: 'partner', name: 'Partner', description: 'Business partner' }
  ];

  const sourceOptions = [
    { id: 'website', name: 'Website' },
    { id: 'referral', name: 'Referral' },
    { id: 'social_media', name: 'Social Media' },
    { id: 'cold_call', name: 'Cold Call' },
    { id: 'event', name: 'Event/Exhibition' },
    { id: 'advertisement', name: 'Advertisement' },
    { id: 'partner', name: 'Partner' },
    { id: 'other', name: 'Other' }
  ];

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
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

    // Phone validation (Indonesian format)
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s|-/g, ''))) {
      newErrors.phone = 'Please enter a valid Indonesian phone number';
    }

    // Company validation
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    // Website validation (if provided)
    if (formData.website && formData.website.trim()) {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(formData.website)) {
        newErrors.website = 'Please enter a valid website URL';
      }
    }

    // Budget validation (if provided)
    if (formData.budget && formData.budget.trim()) {
      const budgetNum = parseFloat(formData.budget.replace(/[^\d.-]/g, ''));
      if (isNaN(budgetNum) || budgetNum < 0) {
        newErrors.budget = 'Please enter a valid budget amount';
      }
    }

    // Employees validation (if provided)
    if (formData.employees && formData.employees.trim()) {
      const empNum = parseInt(formData.employees);
      if (isNaN(empNum) || empNum < 1) {
        newErrors.employees = 'Please enter a valid number of employees';
      }
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
      // Create customer object
      const customerData = {
        id: customer?.id || `customer_${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        position: formData.position.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        province: formData.province.trim(),
        postalCode: formData.postalCode.trim(),
        website: formData.website.trim(),
        industry: formData.industry,
        customerType: formData.customerType,
        source: formData.source,
        notes: formData.notes.trim(),
        budget: formData.budget ? parseFloat(formData.budget.replace(/[^\d.-]/g, '')) : null,
        employees: formData.employees ? parseInt(formData.employees) : null,
        status: customer?.status || 'active',
        createdAt: customer?.createdAt || Date.now(),
        updatedAt: Date.now(),
        lastContact: customer?.lastContact || null,
        totalOrders: customer?.totalOrders || 0,
        totalValue: customer?.totalValue || 0,
        tags: customer?.tags || []
      };

      // Call parent save function
      await onSave(customerData);
      
      // Reset form
      resetForm();
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Error saving customer:', error);
      setErrors({ submit: 'Failed to save customer. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      website: '',
      industry: 'healthcare',
      customerType: 'prospect',
      source: 'website',
      notes: '',
      budget: '',
      employees: ''
    });
    setErrors({});
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
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {customer ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <p className="text-sm text-gray-400">
                {customer ? 'Update customer information' : 'Add a new customer to your database'}
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
                  placeholder="Enter customer name"
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
                  Position/Title
                </label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="e.g., IT Manager, Director"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Company Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name *
                </label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Enter company name"
                  className={`bg-slate-700 border-slate-600 text-white ${errors.company ? 'border-red-500' : ''}`}
                  required
                />
                {errors.company && (
                  <p className="text-red-400 text-xs mt-1">{errors.company}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  {industryOptions.map(industry => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website
                </label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://company.com"
                  className={`bg-slate-700 border-slate-600 text-white ${errors.website ? 'border-red-500' : ''}`}
                />
                {errors.website && (
                  <p className="text-red-400 text-xs mt-1">{errors.website}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Employees
                </label>
                <Input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData(prev => ({ ...prev, employees: e.target.value }))}
                  placeholder="e.g., 100"
                  min="1"
                  className={`bg-slate-700 border-slate-600 text-white ${errors.employees ? 'border-red-500' : ''}`}
                />
                {errors.employees && (
                  <p className="text-red-400 text-xs mt-1">{errors.employees}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Address Information
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter full address"
                  rows={2}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City
                  </label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter city"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Province
                  </label>
                  <Input
                    value={formData.province}
                    onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
                    placeholder="Enter province"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Postal Code
                  </label>
                  <Input
                    value={formData.postalCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                    placeholder="Enter postal code"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Business Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customer Type
                </label>
                <select
                  value={formData.customerType}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerType: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  {customerTypeOptions.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  {customerTypeOptions.find(t => t.id === formData.customerType)?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                >
                  {sourceOptions.map(source => (
                    <option key={source.id} value={source.id}>
                      {source.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget (IDR)
                </label>
                <Input
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  placeholder="e.g., 50000000"
                  className={`bg-slate-700 border-slate-600 text-white ${errors.budget ? 'border-red-500' : ''}`}
                />
                {errors.budget && (
                  <p className="text-red-400 text-xs mt-1">{errors.budget}</p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Additional Notes
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter any additional notes about this customer"
                rows={3}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 resize-none"
              />
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
                  {customer ? 'Update Customer' : 'Add Customer'}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddCustomerModal;
