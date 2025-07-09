import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Download, 
  Calendar, 
  Phone, 
  Mail, 
  Building, 
  CreditCard,
  Package,
  User,
  Settings,
  LogOut,
  Bell,
  FileText,
  Headphones
} from 'lucide-react';
import { usePostPayment } from '@/contexts/PostPaymentContext';
import { FadeIn, SlideInLeft, StaggerContainer, StaggerItem } from '@/components/ui/animations';

const OrderDashboard = () => {
  const { paymentData, clearPaymentData } = usePostPayment();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!paymentData) {
      window.location.href = '/';
    }
  }, [paymentData]);

  const handleDownloadInvoice = () => {
    // Generate and download invoice
    console.log('Downloading invoice...', paymentData);
    // In real implementation, this would generate a PDF
  };

  const handleScheduleDemo = () => {
    // Open calendar scheduling
    window.open('https://calendly.com/sentrabase-demo', '_blank');
  };

  const handleContactSupport = () => {
    // Open support chat or redirect to support
    window.open('https://wa.me/6281234567890?text=Halo, saya butuh bantuan setup SentraBASE', '_blank');
  };

  const handleLogout = () => {
    clearPaymentData();
    window.location.href = '/';
  };

  if (!paymentData) {
    return <div>Loading...</div>;
  }

  const orderStatus = [
    { 
      id: 1, 
      title: 'Pembayaran Berhasil', 
      completed: true, 
      date: paymentData.paymentDate,
      description: 'Pembayaran Anda telah dikonfirmasi'
    },
    { 
      id: 2, 
      title: 'Akun Dibuat', 
      completed: true, 
      date: paymentData.registrationDate,
      description: 'Akun SentraBASE Anda telah aktif'
    },
    { 
      id: 3, 
      title: 'Setup & Konfigurasi', 
      completed: false, 
      date: null,
      description: 'Tim kami akan menghubungi Anda dalam 1x24 jam'
    },
    { 
      id: 4, 
      title: 'Training & Go Live', 
      completed: false, 
      date: null,
      description: 'Pelatihan sistem dan mulai menggunakan'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">SentraBASE Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{paymentData.customerName}</p>
                  <p className="text-xs text-gray-500">{paymentData.clinicName}</p>
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Welcome Section */}
            <FadeIn>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Selamat Datang, {paymentData.customerName}!</h2>
                    <p className="text-blue-100 mt-1">
                      Terima kasih telah bergabung dengan SentraBASE. Mari mulai perjalanan digitalisasi klinik Anda.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Order Progress */}
            <SlideInLeft>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Progress Pesanan</h3>
                
                <div className="space-y-6">
                  {orderStatus.map((status, index) => (
                    <div key={status.id} className="flex items-start space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        status.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {status.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${
                            status.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {status.title}
                          </h4>
                          {status.date && (
                            <span className="text-sm text-gray-500">
                              {new Date(status.date).toLocaleDateString('id-ID')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SlideInLeft>

            {/* Quick Actions */}
            <StaggerContainer>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Langkah Selanjutnya</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StaggerItem>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleScheduleDemo}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Jadwalkan Demo</h4>
                          <p className="text-sm text-gray-600">Lihat demo sistem SentraBASE</p>
                        </div>
                      </div>
                    </motion.button>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleContactSupport}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <Headphones className="w-6 h-6 text-green-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Hubungi Support</h4>
                          <p className="text-sm text-gray-600">Butuh bantuan? Chat dengan tim kami</p>
                        </div>
                      </div>
                    </motion.button>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDownloadInvoice}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <Download className="w-6 h-6 text-purple-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Download Invoice</h4>
                          <p className="text-sm text-gray-600">Unduh bukti pembayaran</p>
                        </div>
                      </div>
                    </motion.button>
                  </StaggerItem>
                  
                  <StaggerItem>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-6 h-6 text-orange-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Panduan Setup</h4>
                          <p className="text-sm text-gray-600">Baca panduan lengkap</p>
                        </div>
                      </div>
                    </motion.button>
                  </StaggerItem>
                </div>
              </div>
            </StaggerContainer>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Pesanan</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ID Pesanan:</span>
                  <span className="font-mono text-sm">{paymentData.orderId}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Paket:</span>
                  <span className="font-medium">{paymentData.plan?.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold text-lg">Rp {paymentData.amount?.toLocaleString('id-ID')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Lunas
                  </span>
                </div>
                
                {paymentData.validUntil && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Berlaku hingga:</span>
                    <span className="text-sm">{new Date(paymentData.validUntil).toLocaleDateString('id-ID')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Kontak</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{paymentData.customerName}</p>
                    <p className="text-sm text-gray-600">Nama Lengkap</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{paymentData.email}</p>
                    <p className="text-sm text-gray-600">Email</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{paymentData.phone}</p>
                    <p className="text-sm text-gray-600">Telepon</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{paymentData.clinicName}</p>
                    <p className="text-sm text-gray-600">Nama Klinik</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="text-center">
                <Headphones className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Butuh Bantuan?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tim support kami siap membantu Anda 24/7
                </p>
                <button 
                  onClick={handleContactSupport}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Hubungi Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;
