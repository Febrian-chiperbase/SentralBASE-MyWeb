import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle, User, Shield } from 'lucide-react';
import { useRouter } from '@/hooks/useRouter';
import { usePostPayment } from '@/contexts/PostPaymentContext';
import { LoadingButton } from '@/components/ui/loading';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

const CustomerLogin = () => {
  const { navigate } = useRouter();
  const { storePaymentData } = usePostPayment();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load remembered credentials on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('sentrabase_remembered_email');
    const rememberedPassword = localStorage.getItem('sentrabase_remembered_password');
    
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        password: rememberedPassword || '',
        rememberMe: true
      }));
      console.log('📋 Loaded remembered credentials for:', rememberedEmail);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Customer login attempt:', { 
        email: formData.email, 
        rememberMe: formData.rememberMe 
      });

      // Enhanced validation
      if (!formData.email.trim()) {
        throw new Error('Email tidak boleh kosong');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Format email tidak valid');
      }

      if (!formData.password.trim()) {
        throw new Error('Password tidak boleh kosong');
      }

      if (formData.password.length < 6) {
        throw new Error('Password minimal 6 karakter');
      }

      // Simulate API call for customer authentication
      console.log('🔄 Authenticating user...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create EXACT same data structure as register flow
      const mockCustomerData = {
        // Customer Info (same as register)
        customerName: formData.email.toLowerCase() === 'demo@sentrabase.com' ? 
          "Dr. Demo User" : `Dr. ${formData.email.split('@')[0].charAt(0).toUpperCase() + formData.email.split('@')[0].slice(1)}`,
        email: formData.email,
        phone: "081234567890",
        clinicName: formData.email.toLowerCase() === 'demo@sentrabase.com' ? 
          "Demo Clinic SentraBASE" : `Klinik ${formData.email.split('@')[0].charAt(0).toUpperCase() + formData.email.split('@')[0].slice(1)}`,
        
        // Payment Info (EXACT same structure as register)
        transactionId: `TXN-${Date.now()}`,
        orderId: `ORDER-${Date.now()}`,
        amount: 5000000,
        paymentMethod: "Bank Transfer",
        paymentDate: new Date().toISOString(),
        status: "paid",
        
        // Plan Info (EXACT same as register)
        plan: {
          name: "Professional",
          price: 5000000,
          features: [
            "Electronic Medical Records (EMR)",
            "Appointment Management System",
            "Patient Registration & Check-in", 
            "Billing & Invoice Management",
            "Medical Report Generation",
            "Data Security & Backup",
            "Multi-user Access Control",
            "Training & Support"
          ]
        },
        
        // Registration Status (EXACT same as register)
        registrationCompleted: true,
        accountCreated: true,
        registrationDate: new Date().toISOString(),
        
        // Features Array (EXACT same as register)
        features: [
          "Electronic Medical Records (EMR)",
          "Appointment Management System",
          "Patient Registration & Check-in", 
          "Billing & Invoice Management",
          "Medical Report Generation",
          "Data Security & Backup",
          "Multi-user Access Control",
          "Training & Support"
        ],
        
        // Validity (EXACT same as register)
        validUntil: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)).toISOString(),
        
        // Login specific (only difference)
        dataSource: 'login',
        loginDate: new Date().toISOString(),
        rememberMe: formData.rememberMe
      };

      console.log('💾 Storing EXACT register-compatible data...');
      console.log('📊 Data structure (should match register):', mockCustomerData);
      
      // Store customer data using multiple methods for reliability
      try {
        // Method 1: Use context
        if (storePaymentData) {
          storePaymentData(mockCustomerData);
          console.log('✅ Data stored via context');
        }
        
        // Method 2: Direct localStorage (backup)
        localStorage.setItem('sentrabase_payment_data', JSON.stringify(mockCustomerData));
        console.log('✅ Data stored in localStorage');
        
        // Method 3: Session storage (additional backup)
        sessionStorage.setItem('sentrabase_session_data', JSON.stringify(mockCustomerData));
        console.log('✅ Data stored in sessionStorage');
        
      } catch (storageError) {
        console.error('❌ Storage error:', storageError);
        throw new Error('Gagal menyimpan data login');
      }

      // Handle Remember Me
      if (formData.rememberMe) {
        localStorage.setItem('sentrabase_remembered_email', formData.email);
        localStorage.setItem('sentrabase_remembered_password', formData.password);
        console.log('💾 Credentials remembered');
      } else {
        localStorage.removeItem('sentrabase_remembered_email');
        localStorage.removeItem('sentrabase_remembered_password');
        console.log('🗑️ Credentials cleared');
      }

      console.log('✅ Login successful, showing success message...');
      setSuccess(true);
      
      // Enhanced redirect with multiple fallbacks
      console.log('🧭 Redirecting to dashboard...');
      
      setTimeout(() => {
        try {
          // Method 1: Use router navigate
          if (navigate) {
            navigate('/dashboard');
            console.log('✅ Navigated via router');
          } else {
            throw new Error('Router navigate not available');
          }
        } catch (navError) {
          console.warn('⚠️ Router navigation failed, using window.location');
          // Method 2: Direct window location
          window.location.href = '/dashboard';
        }
      }, 1500);

    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Header */}
        <FadeIn>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Customer Login</h1>
            <p className="text-blue-200">
              Masuk ke dashboard SentraBASE Anda
            </p>
          </div>
        </FadeIn>

        {/* Login Form */}
        <ScaleIn>
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            
            {/* Demo Account Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Demo Account
              </h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Email:</strong> demo@sentrabase.com</p>
                <p><strong>Password:</strong> demo123</p>
                <p className="text-xs text-blue-600 mt-2">
                  💡 Atau gunakan email apapun dengan password minimal 6 karakter
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                    placeholder="Masukkan email Anda"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
                    placeholder="Masukkan password Anda"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  onClick={() => alert('Fitur lupa password akan segera tersedia')}
                >
                  Lupa Password?
                </button>
              </div>

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-green-800 font-medium">Login Berhasil!</p>
                      <p className="text-green-600 text-sm">Mengarahkan ke dashboard...</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-red-600 text-sm font-medium">Login Gagal</p>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Login Button */}
              <LoadingButton
                loading={loading}
                loadingText="Masuk..."
                disabled={!formData.email || !formData.password}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                type="submit"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </LoadingButton>

            </form>

            {/* Back to Home */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                ← Kembali ke Beranda
              </button>
            </div>

            {/* Debug Info (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                <p><strong>Debug Info:</strong></p>
                <p>Email: {formData.email}</p>
                <p>Remember Me: {formData.rememberMe ? 'Yes' : 'No'}</p>
                <p>Form Valid: {formData.email && formData.password ? 'Yes' : 'No'}</p>
              </div>
            )}

          </div>
        </ScaleIn>

      </div>
    </div>
  );
};

export default CustomerLogin;
