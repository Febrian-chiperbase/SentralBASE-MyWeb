import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Star,
  MessageSquare,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AddCustomerModal from './AddCustomerModal';

// Notification Helper (inline for now)
class NotificationHelper {
  async notifyNewCustomer(customer) {
    const message = `${customer.name} from ${customer.company} has been added as a new customer`;
    
    // WhatsApp notification
    const whatsappUrl = `https://wa.me/6282132115008?text=${encodeURIComponent(
      `👥 *SentraBASE Notification*\n\n📋 *New Customer Added*\n${message}\n\n🏢 Customer: ${customer.name}\n🏬 Company: ${customer.company}\n📊 Type: ${customer.customerType}\n📧 Email: ${customer.email}\n\n🚀 *SentraBASE Admin Dashboard*`
    )}`;
    
    // Email notification
    const emailSubject = '[SentraBASE] New Customer Added';
    const emailBody = `SentraBASE Admin Notification\n================================\n\nType: CUSTOMER\nTitle: New Customer Added\nMessage: ${message}\n\nCustomer Details:\n- Customer Name: ${customer.name}\n- Company: ${customer.company}\n- Type: ${customer.customerType}\n- Email: ${customer.email}\n- Phone: ${customer.phone}\n- Industry: ${customer.industry}\n\nTimestamp: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n\n================================\nSentraBASE Admin Dashboard\nAdmin Email: fery10febrian@gmail.com`;
    const emailUrl = `mailto:fery10febrian@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
      setTimeout(() => window.open(emailUrl, '_blank'), 1000);
    }
  }
}

const notificationHelper = new NotificationHelper();

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, statusFilter]);

  const loadCustomers = () => {
    const customerData = [];
    
    // Load from payment sessions
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      if (key && key.startsWith('payment_session_')) {
        try {
          const sessionData = JSON.parse(localStorage.getItem(key));
          if (sessionData.customerInfo) {
            const customer = {
              id: key,
              ...sessionData.customerInfo,
              plan: sessionData.plan?.name || 'No Plan',
              status: sessionData.status || 'pending',
              step: sessionData.step || 1,
              timestamp: sessionData.timestamp,
              lastActivity: sessionData.timestamp,
              source: getRandomSource(),
              tags: getRandomTags(),
              notes: '',
              priority: getRandomPriority()
            };
            customerData.push(customer);
          }
        } catch (error) {
          console.error('Error parsing customer data:', error);
        }
      }
    }
    
    // Remove duplicates based on email
    const uniqueCustomers = customerData.filter((customer, index, self) => 
      index === self.findIndex(c => c.email === customer.email)
    );
    
    setCustomers(uniqueCustomers);
  };

  const filterCustomers = () => {
    let filtered = customers;
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.clinicName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }
    
    setFilteredCustomers(filtered);
  };

  const getRandomSource = () => {
    const sources = ['Google', 'Facebook', 'Instagram', 'Direct', 'WhatsApp', 'Referral'];
    return sources[Math.floor(Math.random() * sources.length)];
  };

  const getRandomTags = () => {
    const allTags = ['Hot Lead', 'Follow Up', 'Interested', 'Price Sensitive', 'Decision Maker', 'Urgent'];
    const numTags = Math.floor(Math.random() * 3) + 1;
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  };

  const getRandomPriority = () => {
    const priorities = ['high', 'medium', 'low'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'idle': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const contactCustomer = (customer, method) => {
    if (method === 'whatsapp' && customer.phone) {
      const message = `Halo ${customer.contactPerson}, saya dari SentraBASE. Apakah ada yang bisa saya bantu dengan pemesanan Anda?`;
      const whatsappUrl = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else if (method === 'email' && customer.email) {
      const subject = `Follow up - SentraBASE untuk ${customer.clinicName}`;
      const body = `Halo ${customer.contactPerson},\n\nTerima kasih atas ketertarikan Anda pada SentraBASE. Apakah ada yang bisa kami bantu untuk melanjutkan proses pemesanan?\n\nSalam,\nTim SentraBASE`;
      const mailtoUrl = `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl, '_blank');
    }
  };

  const updateCustomerStatus = (customerId, newStatus) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === customerId ? { ...customer, status: newStatus } : customer
    );
    setCustomers(updatedCustomers);
    
    // Update in localStorage
    try {
      const sessionData = JSON.parse(localStorage.getItem(customerId));
      sessionData.status = newStatus;
      localStorage.setItem(customerId, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
  };

  const saveCustomer = async (customerData) => {
    try {
      let updatedCustomers;
      let isNewCustomer = false;
      
      if (selectedCustomer && selectedCustomer.id === customerData.id) {
        // Update existing customer
        updatedCustomers = customers.map(customer => 
          customer.id === customerData.id ? customerData : customer
        );
      } else {
        // Check for duplicate email
        const emailExists = customers.some(customer => 
          customer.email.toLowerCase() === customerData.email.toLowerCase()
        );
        
        if (emailExists) {
          throw new Error('A customer with this email already exists');
        }
        
        // Add new customer
        updatedCustomers = [...customers, customerData];
        isNewCustomer = true;
      }
      
      setCustomers(updatedCustomers);
      localStorage.setItem('sentrabase_customers', JSON.stringify(updatedCustomers));
      
      console.log('✅ Customer saved successfully:', customerData.name);
      
      // Send WhatsApp notification for new customer
      if (isNewCustomer) {
        await notificationHelper.notifyNewCustomer(customerData);
      }
      
      // Show success message
      alert(`Customer "${customerData.name}" from ${customerData.company} has been ${selectedCustomer ? 'updated' : 'added'} successfully!`);
      
      setSelectedCustomer(null);
      
    } catch (error) {
      console.error('❌ Error saving customer:', error);
      throw error; // Re-throw to be handled by the modal
    }
  };

  const deleteCustomer = (customerId) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    if (confirm(`Are you sure you want to delete customer "${customer.name}" from ${customer.company}?\n\nThis action cannot be undone.`)) {
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      localStorage.setItem('sentrabase_customers', JSON.stringify(updatedCustomers));
      
      console.log('✅ Customer deleted:', customer.name);
      alert(`Customer "${customer.name}" has been deleted.`);
    }
  };

  const exportToCSV = () => {
    try {
      // Define CSV headers
      const headers = [
        'Name',
        'Email',
        'Phone',
        'Company',
        'Position',
        'Industry',
        'Customer Type',
        'Source',
        'Status',
        'Address',
        'City',
        'Province',
        'Postal Code',
        'Website',
        'Employees',
        'Budget (IDR)',
        'Total Orders',
        'Total Value (IDR)',
        'Last Contact',
        'Created Date',
        'Notes'
      ];
      
      // Convert customers to CSV rows
      const csvRows = customers.map(customer => [
        customer.name || '',
        customer.email || '',
        customer.phone || '',
        customer.company || customer.clinicName || '',
        customer.position || '',
        customer.industry || '',
        customer.customerType || customer.type || '',
        customer.source || '',
        customer.status || '',
        customer.address || '',
        customer.city || '',
        customer.province || '',
        customer.postalCode || '',
        customer.website || '',
        customer.employees || '',
        customer.budget || '',
        customer.totalOrders || 0,
        customer.totalValue || 0,
        customer.lastContact ? new Date(customer.lastContact).toLocaleDateString('id-ID') : '',
        customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('id-ID') : '',
        customer.notes || ''
      ]);
      
      // Combine headers and rows
      const csvContent = [headers, ...csvRows]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sentrabase-customers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ Customer data exported to CSV');
      alert(`Successfully exported ${customers.length} customers to CSV!\n\nFile: sentrabase-customers-${new Date().toISOString().split('T')[0]}.csv`);
      
    } catch (error) {
      console.error('❌ Error exporting to CSV:', error);
      alert('Failed to export customer data. Please try again.');
    }
  };

  const addNote = (customerId, note) => {
    const updatedCustomers = customers.map(customer => 
      customer.id === customerId ? { ...customer, notes: note } : customer
    );
    setCustomers(updatedCustomers);
  };

  const exportCustomers = () => {
    const exportData = customers.map(customer => ({
      clinicName: customer.clinicName,
      contactPerson: customer.contactPerson,
      email: customer.email,
      phone: customer.phone,
      plan: customer.plan,
      status: customer.status,
      source: customer.source,
      priority: customer.priority,
      lastActivity: formatDate(customer.lastActivity),
      tags: customer.tags.join(', ')
    }));
    
    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentrabase-customers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Customer Management</h2>
          <p className="text-gray-400">Manage and track all your customers</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={exportToCSV}
            className="bg-green-500 hover:bg-green-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => {
              setSelectedCustomer(null);
              setShowAddCustomerModal(true);
            }}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800 border border-slate-600 text-white rounded-md px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="idle">Idle</option>
        </select>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Customers</p>
              <p className="text-2xl font-bold text-white">{customers.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-2xl font-bold text-green-400">
                {customers.filter(c => c.status === 'active').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">
                {customers.filter(c => c.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-blue-400">
                {customers.filter(c => c.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {customer.clinicName}
                      </div>
                      <div className="text-sm text-gray-400">
                        {customer.contactPerson}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {customer.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      <div className="flex items-center mb-1">
                        <Mail className="w-3 h-3 mr-1" />
                        {customer.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">
                      {customer.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(customer.status)}
                      <span className="ml-2 text-sm text-gray-300 capitalize">
                        {customer.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getPriorityColor(customer.priority)}`}>
                      {customer.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(customer.lastActivity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => contactCustomer(customer, 'whatsapp')}
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => contactCustomer(customer, 'email')}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Mail className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowAddCustomerModal(true);
                        }}
                        size="sm"
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => deleteCustomer(customer.id)}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      <select
                        value={customer.status}
                        onChange={(e) => updateCustomerStatus(customer.id, e.target.value)}
                        className="bg-slate-700 border border-slate-600 text-white rounded text-xs px-2 py-1"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="idle">Idle</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No customers found</p>
          </div>
        )}
      </motion.div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={showAddCustomerModal}
        onClose={() => {
          setShowAddCustomerModal(false);
          setSelectedCustomer(null);
        }}
        onSave={saveCustomer}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomerManagement;
