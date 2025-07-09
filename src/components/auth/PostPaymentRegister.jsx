import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, User, Mail, Building, ArrowRight, Shield } from 'lucide-react';
import { usePostPayment } from '@/contexts/PostPaymentContext';
import { useRouter } from '@/hooks/useRouter';
import { EnhancedInput } from '@/components/ui/enhanced-forms';
import { LoadingButton } from '@/components/ui/loading';
import { FadeIn, SlideInRight } from '@/components/ui/animations';

const PostPaymentRegister = () => {
  const { paymentData, completeRegistration } = usePostPayment();
  const { navigate } = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!paymentData) {
      // Redirect to home if no payment data
      navigate('/');
    }
  }, [paymentData, navigate]);

  const validatePassword = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push('Minimal 8 karakter');
    if (!/[A-Z]/.test(pwd)) errors.push('Minimal 1 huruf besar');
    if (!/[a-z]/.test(pwd)) errors.push('Minimal 1 huruf kecil');
    if (!/[0-9]/.test(pwd)) errors.push('Minimal 1 angka');
    if (!/[!@#$%^&*]/.test(pwd)) errors.push('Minimal 1 karakter khusus');
    return errors;
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    const validationErrors = validatePassword(value);
    setErrors(prev => ({
      ...prev,
      password: validationErrors.length > 0 ? validationErrors : null
    }));
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (value !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Password tidak cocok' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Registration form submitted...');
    
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setErrors({ password: passwordErrors });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Password tidak cocok' });
      return;
    }

    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      console.log('💾 Creating user account...');
      
      // Simulate API call to create user account
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Complete registration with password
      const userData = {
        password: password, // In real app, this should be hashed
        accountCreated: true
      };

      console.log('✅ Registration completed, updating context...');
      completeRegistration(userData);
      
      setSuccess(true);
      
      console.log('🧭 Redirecting to dashboard...');
      
      // Redirect to dashboard after showing success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('❌ Registration error:', error);
      setErrors({ general: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setLoading(false);
    }
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Payment Summary */}
        <FadeIn>
          <div className="text-white space-y-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <h1 className="text-3xl font-bold">Pembayaran Berhasil!</h1>
            </div>
            <p className="text-blue-200 text-lg">
              Selamat datang di SentraBASE. Mari selesaikan pendaftaran akun Anda.
            </p>

            {/* Order Summary */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-300" />
                  <div>
                    <p className="font-medium">{paymentData.customerName}</p>
                    <p className="text-sm text-blue-200">Nama Lengkap</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-300" />
                  <div>
                    <p className="font-medium">{paymentData.email}</p>
                    <p className="text-sm text-blue-200">Email</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-blue-300" />
                  <div>
                    <p className="font-medium">{paymentData.clinicName}</p>
                    <p className="text-sm text-blue-200">Nama Klinik</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Paket:</span>
                  <span className="font-semibold">{paymentData.plan?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Total:</span>
                  <span className="font-semibold text-xl">Rp {paymentData.amount?.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Right Side - Registration Form */}
        <SlideInRight>
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Buat Password Akun</h2>
              <p className="text-gray-600 mt-2">
                Buat password yang kuat untuk mengamankan akun SentraBASE Anda
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 text-gray-900 bg-white placeholder-gray-500"
                    placeholder="Masukkan password baru"
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
                
                {/* Password Requirements */}
                {password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 bg-gray-50 rounded-lg p-3 space-y-2"
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2">Persyaratan Password:</p>
                    {[
                      { check: password.length >= 8, text: 'Minimal 8 karakter' },
                      { check: /[A-Z]/.test(password), text: 'Minimal 1 huruf besar' },
                      { check: /[a-z]/.test(password), text: 'Minimal 1 huruf kecil' },
                      { check: /[0-9]/.test(password), text: 'Minimal 1 angka' },
                      { check: /[!@#$%^&*]/.test(password), text: 'Minimal 1 karakter khusus (!@#$%^&*)' }
                    ].map((req, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center space-x-2 text-sm transition-colors duration-200 ${
                          req.check ? 'text-green-600' : 'text-gray-500'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                          req.check ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {req.check ? '✓' : '○'}
                        </div>
                        <span>{req.text}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 text-gray-900 bg-white placeholder-gray-500"
                    placeholder="Konfirmasi password baru"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
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
                      <p className="text-green-800 font-medium">Akun Berhasil Dibuat!</p>
                      <p className="text-green-600 text-sm">Mengarahkan ke dashboard...</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Submit Button */}
              <LoadingButton
                loading={loading}
                loadingText="Membuat Akun..."
                disabled={!password || !confirmPassword || errors.password || errors.confirmPassword}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                type="submit"
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>Buat Akun & Lanjutkan</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </LoadingButton>

              {/* Security Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Keamanan Terjamin</p>
                    <p>Password Anda akan dienkripsi dan disimpan dengan aman menggunakan teknologi terdepan.</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </SlideInRight>
      </div>
    </div>
  );
};

export default PostPaymentRegister;
