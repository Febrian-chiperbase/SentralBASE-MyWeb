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
  Headphones,
  TrendingUp,
  Target,
  AlertCircle,
  PlayCircle,
  Star,
  Crown,
  Rocket,
  Zap,
  Shield,
  Users,
  Database
} from 'lucide-react';
import { usePostPayment } from '@/contexts/PostPaymentContext';
import { useProjectProgress } from '@/contexts/ProjectProgressContext';
import { usePackageInfo } from '@/contexts/PackageInfoContext';
import { FadeIn, SlideInLeft, StaggerContainer, StaggerItem } from '@/components/ui/animations';
import { cn } from '@/lib/utils';
import './dashboard-fixes.css';
import { 
  CircularProgress, 
  LinearProgress, 
  PhaseProgressCard, 
  ProjectTimeline,
  MilestoneCard 
} from '@/components/ui/progress-components';
import {
  PackageBadge,
  PackageInfoCard,
  PackageComparison,
  PackageFeaturesList,
  PackageStatusIndicator
} from '@/components/ui/package-components';

const OrderDashboardWithPackage = () => {
  const { paymentData, clearPaymentData } = usePostPayment();
  const { 
    projectProgress, 
    simulateProgress, 
    getCurrentPhase, 
    getNextMilestone 
  } = useProjectProgress();
  const { getPackageInfo, comparePackages } = usePackageInfo();
  
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!paymentData) {
      window.location.href = '/';
    }
  }, [paymentData]);

  useEffect(() => {
    // Start progress simulation when component mounts
    simulateProgress();
  }, [simulateProgress]);

  const handleDownloadInvoice = () => {
    console.log('Downloading invoice...', paymentData);
  };

  const handleScheduleDemo = () => {
    window.open('https://calendly.com/sentrabase-demo', '_blank');
  };

  const handleContactSupport = () => {
    window.open('https://wa.me/6281234567890?text=Halo, saya butuh bantuan setup SentraBASE', '_blank');
  };

  const handleLogout = () => {
    console.log('🚪 Customer logging out...');
    
    // Show confirmation dialog
    const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar dari dashboard?');
    
    if (confirmLogout) {
      // Clear payment data
      clearPaymentData();
      
      console.log('✅ Logout successful, redirecting to login...');
      
      // Redirect to login page instead of home
      window.location.href = '/login';
    }
  };

  const handleUpgradePackage = () => {
    // Handle package upgrade
    console.log('Upgrade package requested');
  };

  if (!paymentData) {
    return <div>Loading...</div>;
  }

  const currentPhase = getCurrentPhase();
  const nextMilestone = getNextMilestone();
  const estimatedCompletion = projectProgress.estimatedCompletion;
  const daysRemaining = estimatedCompletion ? 
    Math.ceil((new Date(estimatedCompletion) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  // Get package information
  const packageInfo = getPackageInfo(paymentData.plan?.name);
  const packageComparison = comparePackages(paymentData.plan?.name);

  // Debug package info
  useEffect(() => {
    console.log('📦 Dashboard Data Debug:', {
      paymentData: paymentData,
      planName: paymentData?.plan?.name,
      packageInfo: packageInfo,
      hasPackageInfo: !!packageInfo,
      dataSource: paymentData?.dataSource,
      registrationCompleted: paymentData?.registrationCompleted,
      accountCreated: paymentData?.accountCreated
    });
    
    // Log full payment data structure for debugging
    if (paymentData) {
      console.log('📊 Full Payment Data Structure:', JSON.stringify(paymentData, null, 2));
    }
  }, [packageInfo, paymentData]);

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
              {/* Package Badge in Header */}
              {packageInfo && (
                <PackageStatusIndicator packageInfo={packageInfo} status="setup" />
              )}
              
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
        
        {/* Package Overview Banner */}
        {packageInfo && (
          <FadeIn>
            <div className={cn(
              'rounded-xl p-6 text-white mb-8',
              packageInfo.color === 'blue' && 'bg-gradient-to-r from-blue-600 to-blue-700',
              packageInfo.color === 'green' && 'bg-gradient-to-r from-green-600 to-green-700',
              packageInfo.color === 'purple' && 'bg-gradient-to-r from-purple-600 to-purple-700'
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                    {packageInfo.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{packageInfo.displayName}</h2>
                    <p className="text-white/80 mt-1">{packageInfo.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{packageInfo.maxUsers} Users</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Database className="w-4 h-4" />
                        <span>{packageInfo.maxPatients} Patients</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4" />
                        <span>{packageInfo.features.length} Features</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    Rp {packageInfo.price.toLocaleString('id-ID')}
                  </div>
                  <div className="text-white/80">per tahun</div>
                  {packageComparison.upgrades.length > 0 && (
                    <button
                      onClick={handleUpgradePackage}
                      className="mt-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      Upgrade Available
                    </button>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        )}
        
        {/* Progress Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <FadeIn>
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <CircularProgress 
                progress={projectProgress.overallProgress} 
                size={80}
                strokeWidth={6}
                color="blue"
              />
              <h3 className="text-lg font-semibold text-gray-900 mt-4">Progress Keseluruhan</h3>
              <p className="text-sm text-gray-600">Total completion project</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {currentPhase?.progress || 0}%
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">{currentPhase?.name}</h3>
              <p className="text-sm text-gray-600">Fase saat ini</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold text-green-600">{daysRemaining}</span>
              </div>
              <h3 className="font-semibold text-gray-900">Hari Tersisa</h3>
              <p className="text-sm text-gray-600">Estimasi penyelesaian</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-sm font-bold text-orange-600">
                  {estimatedCompletion ? new Date(estimatedCompletion).toLocaleDateString('id-ID') : 'TBD'}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Target Selesai</h3>
              <p className="text-sm text-gray-600">Estimasi go-live</p>
            </div>
          </FadeIn>
        </div>

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
                      Project implementasi SentraBASE {packageInfo?.name} sedang berjalan dengan baik.
                    </p>
                  </div>
                </div>
                
                {/* Overall Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-100">Progress Keseluruhan</span>
                    <span className="font-semibold">{projectProgress.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${projectProgress.overallProgress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="bg-white h-3 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Package Features Overview */}
            {packageInfo && (
              <SlideInLeft>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Fitur Package Anda</h3>
                    <PackageBadge packageInfo={packageInfo} />
                  </div>
                  
                  <PackageFeaturesList packageInfo={packageInfo} />
                  
                  {/* Package Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{packageInfo.maxUsers}</div>
                      <div className="text-sm text-gray-600">Max Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {packageInfo.maxPatients === 'Unlimited' ? '∞' : packageInfo.maxPatients.toLocaleString('id-ID')}
                      </div>
                      <div className="text-sm text-gray-600">Max Patients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{packageInfo.trainingHours}h</div>
                      <div className="text-sm text-gray-600">Training Hours</div>
                    </div>
                  </div>
                </div>
              </SlideInLeft>
            )}

            {/* Next Milestone */}
            {nextMilestone && (
              <SlideInLeft>
                <MilestoneCard 
                  milestone={nextMilestone} 
                  daysRemaining={nextMilestone.estimatedDuration}
                />
              </SlideInLeft>
            )}

            {/* Project Timeline */}
            <SlideInLeft>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Timeline Project</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Progress Real-time</span>
                  </div>
                </div>
                
                <ProjectTimeline phases={projectProgress.phases} />
              </div>
            </SlideInLeft>

            {/* Quick Actions */}
            <StaggerContainer>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Aksi Cepat</h3>
                
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
                          <p className="text-sm text-gray-600">Lihat demo sistem {packageInfo?.name}</p>
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
                      onClick={handleUpgradePackage}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Upgrade Package</h4>
                          <p className="text-sm text-gray-600">Tingkatkan ke paket yang lebih tinggi</p>
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
            
            {/* Package Info Card */}
            {packageInfo ? (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 package-info-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="package-info-label">Package:</span>
                    <PackageBadge packageInfo={packageInfo} size="sm" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="package-info-label">Price:</span>
                    <span className="package-info-value">Rp {packageInfo.price.toLocaleString('id-ID')}/year</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="package-info-label">Max Users:</span>
                    <span className="package-info-value">{packageInfo.maxUsers}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="package-info-label">Max Patients:</span>
                    <span className="package-info-value">{packageInfo.maxPatients}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="package-info-label">Setup Time:</span>
                    <span className="package-info-value">{packageInfo.setupTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="package-info-label">Training:</span>
                    <span className="package-info-value">{packageInfo.trainingHours} hours</span>
                  </div>
                </div>

                {packageComparison.upgrades.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleUpgradePackage}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Upgrade Available
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 package-info-card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="package-info-label">Package:</span>
                    <span className="package-info-value">{paymentData.plan?.name || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="package-info-label">Price:</span>
                    <span className="package-info-value">Rp {paymentData.amount?.toLocaleString('id-ID') || '0'}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="font-medium text-yellow-800">Package details loading...</p>
                    <p className="text-yellow-700">Some package information may not be available yet.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Current Status */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Terkini</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <PlayCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Fase Aktif</p>
                      <p className="text-sm text-gray-600">{currentPhase?.name}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {currentPhase?.progress}%
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Tugas Aktif:</p>
                  {currentPhase?.tasks
                    .filter(task => !task.completed)
                    .slice(0, 3)
                    .map((task) => (
                    <div key={task.id} className="flex items-center space-x-2 text-sm">
                      <Clock className="w-3 h-3 text-orange-500" />
                      <span className="text-gray-700">{task.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 order-details-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detail Pesanan</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="order-detail-label">ID Pesanan:</span>
                  <span className="order-detail-value font-mono text-sm">{paymentData.orderId}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="order-detail-label">Paket:</span>
                  <span className="order-detail-value font-medium">{paymentData.plan?.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="order-detail-label">Total:</span>
                  <span className="order-detail-value font-semibold text-lg">Rp {paymentData.amount?.toLocaleString('id-ID')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="order-detail-label">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Lunas
                  </span>
                </div>
                
                {estimatedCompletion && (
                  <div className="flex items-center justify-between">
                    <span className="order-detail-label">Target Selesai:</span>
                    <span className="order-detail-value text-sm font-medium">
                      {new Date(estimatedCompletion).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 contact-info-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Kontak</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="contact-value">{paymentData.customerName}</p>
                    <p className="contact-label text-sm">Nama Lengkap</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="contact-value">{paymentData.email}</p>
                    <p className="contact-label text-sm">Email</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="contact-value">{paymentData.phone}</p>
                    <p className="contact-label text-sm">Telepon</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="contact-value">{paymentData.clinicName}</p>
                    <p className="contact-label text-sm">Nama Klinik</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="text-center">
                <Headphones className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Butuh Update Progress?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Hubungi project manager untuk update terbaru
                </p>
                <button 
                  onClick={handleContactSupport}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Hubungi Project Manager
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDashboardWithPackage;
