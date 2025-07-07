import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, BarChart3, Users, Bell, Settings, Activity, Zap, CheckSquare, UserCheck, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ErrorBoundary from '../ErrorBoundary';
import OrderMonitoring from './OrderMonitoring';
import AdvancedAnalytics from './AdvancedAnalytics';
import EnhancedWorkflowAutomation from './EnhancedWorkflowAutomation';
import CustomerManagement from './CustomerManagement';
import TeamManagement from './TeamManagement';
import TaskManagement from './TaskManagement';
import CalendarManagement from './CalendarManagement';
import AdvancedNotifications from './AdvancedNotifications';
import TestDataGenerator from './TestDataGenerator';
import DebugPanel from './DebugPanel';

const AdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('monitoring');

  // Simple password protection (dalam production gunakan proper auth)
  const ADMIN_PASSWORD = 'sentrabase2025'; // Ganti dengan password yang aman

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      localStorage.setItem('admin_session', Date.now().toString());
    } else {
      setError('Password salah');
      setPassword('');
    }
  };

  // Check existing session
  React.useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (session) {
      const sessionTime = parseInt(session);
      const now = Date.now();
      const hoursPassed = (now - sessionTime) / (1000 * 60 * 60);
      
      // Session valid for 8 hours
      if (hoursPassed < 8) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('admin_session');
      }
    }
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_session');
    setPassword('');
  };

  const tabs = [
    { id: 'monitoring', label: 'Live Monitoring', icon: Activity, description: 'Real-time customer tracking' },
    { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3, description: 'Business intelligence & forecasting' },
    { id: 'automation', label: 'Workflow Automation', icon: Zap, description: 'Team workflow management' },
    { id: 'tasks', label: 'Task Management', icon: CheckSquare, description: 'Team task coordination' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, description: 'Schedule & deadlines' },
    { id: 'team', label: 'Team Management', icon: UserCheck, description: 'Team collaboration & roles' },
    { id: 'customers', label: 'Customers', icon: Users, description: 'Customer management' },
    { id: 'notifications', label: 'WhatsApp Notifications', icon: MessageSquare, description: 'WhatsApp integration & alerts' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">SentraBASE Admin</h1>
            <p className="text-gray-400">Masukkan password untuk mengakses dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password Admin
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  className="bg-slate-700 border-slate-600 text-white pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              Login Admin
            </Button>
          </form>

          <div className="mt-8 p-4 bg-slate-700/50 rounded-lg">
            <h3 className="text-sm font-semibold text-white mb-2">🚀 Enhanced Admin Features:</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• 📊 Real-time customer monitoring</li>
              <li>• 📈 Advanced business analytics</li>
              <li>• 👥 Complete customer management</li>
              <li>• 🔔 Smart notification system</li>
              <li>• 📱 WhatsApp & Email integration</li>
              <li>• 📋 Export & reporting tools</li>
            </ul>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Admin Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">🏥 SentraBASE Admin Dashboard</h1>
            <p className="text-sm text-gray-400">Complete business management system</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8 px-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-cyan-500 text-cyan-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorBoundary>
            {activeTab === 'monitoring' && <OrderMonitoring />}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                <div className="lg:col-span-4">
                  <AdvancedAnalytics />
                </div>
                <div className="lg:col-span-2 space-y-6">
                  <TestDataGenerator />
                  <DebugPanel />
                </div>
              </div>
            )}
            {activeTab === 'automation' && <EnhancedWorkflowAutomation />}
            {activeTab === 'tasks' && <TaskManagement />}
            {activeTab === 'calendar' && <CalendarManagement />}
            {activeTab === 'team' && <TeamManagement />}
            {activeTab === 'customers' && <CustomerManagement />}
            {activeTab === 'notifications' && <AdvancedNotifications />}
          </ErrorBoundary>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRoute;
