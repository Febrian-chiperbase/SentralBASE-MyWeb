import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Database,
  ChevronRight,
  Activity,
  BarChart3,
  Sparkles,
  Award,
  Timer,
  CheckCircle2
} from 'lucide-react';
import invoiceService from '@/services/InvoiceService';
import { usePostPayment } from '@/contexts/PostPaymentContext';
import { useProjectProgress } from '@/contexts/ProjectProgressContext';
import { usePackageInfo } from '@/contexts/PackageInfoContext';
import UpgradeModal from './UpgradeModal';
import { 
  FadeIn, 
  ScaleIn, 
  SlideIn, 
  StaggerContainer, 
  StaggerItem,
  HoverScale,
  CountUp
} from '@/components/ui/modern-animations';
import { 
  CircularProgress, 
  LinearProgress, 
  ProgressRing 
} from '@/components/ui/modern-progress';
import { 
  getPackageTheme, 
  getPackageClasses, 
  getPackageCSS,
  getPackageIcon,
  getPackageDisplayInfo 
} from '@/utils/packageTheme';
import { cn } from '@/lib/utils';
import './modern-dashboard.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const ModernDashboard = () => {
  const { paymentData, clearPaymentData } = usePostPayment();
  const { 
    projectProgress, 
    simulateProgress, 
    getCurrentPhase, 
    getNextMilestone 
  } = useProjectProgress();
  const { getPackageInfo, comparePackages } = usePackageInfo();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!paymentData) {
      window.location.href = '/';
    } else {
      // Simulate loading
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [paymentData]);

  useEffect(() => {
    simulateProgress();
  }, [simulateProgress]);

  const handleDownloadInvoice = async () => {
    try {
      // Debug: Log payment data structure
      console.log('💳 Payment data for invoice:', paymentData);
      console.log('📦 Plan info:', paymentData.plan);
      console.log('👤 Customer info:', paymentData.customerInfo);
      console.log('📊 Status:', paymentData.status);
      
      // Show loading state
      const loadingToast = document.createElement('div');
      loadingToast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      loadingToast.textContent = 'Menyiapkan invoice...';
      document.body.appendChild(loadingToast);

      // Generate and download invoice
      const result = await invoiceService.downloadInvoice(paymentData);
      
      // Remove loading toast
      document.body.removeChild(loadingToast);

      if (result.success) {
        // Show success message
        const successToast = document.createElement('div');
        successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        successToast.textContent = '✅ Invoice berhasil dibuka!';
        document.body.appendChild(successToast);
        
        setTimeout(() => {
          if (document.body.contains(successToast)) {
            document.body.removeChild(successToast);
          }
        }, 3000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      
      // Show error message
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorToast.textContent = `❌ Error: ${error.message}`;
      document.body.appendChild(errorToast);
      
      setTimeout(() => {
        if (document.body.contains(errorToast)) {
          document.body.removeChild(errorToast);
        }
      }, 5000);
    }
  };

  const handleScheduleDemo = () => {
    window.open('https://calendly.com/sentrabase-demo', '_blank');
  };

  const handleContactSupport = () => {
    window.open('https://wa.me/6282132115008?text=Halo, saya butuh bantuan setup SentraBASE', '_blank');
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar dari dashboard?');
    
    if (confirmLogout) {
      clearPaymentData();
      window.location.href = '/login';
    }
  };

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleUpgradePackage = () => {
    setShowUpgradeModal(true);
  };

  const handleConfirmUpgrade = (selectedPackage) => {
    // Instead of redirecting to main page, handle upgrade within dashboard context
    const confirmUpgrade = window.confirm(
      `Apakah Anda yakin ingin upgrade ke ${selectedPackage.displayName}?\n\n` +
      `Biaya tambahan: Rp ${new Intl.NumberFormat('id-ID').format(selectedPackage.price - packageInfo.price)}\n\n` +
      `Anda akan diarahkan ke halaman pembayaran untuk melanjutkan upgrade.`
    );
    
    if (confirmUpgrade) {
      // Store upgrade context in localStorage
      const upgradeContext = {
        fromPackage: packageInfo,
        toPackage: selectedPackage,
        upgradeType: 'package_upgrade',
        timestamp: new Date().toISOString(),
        customerId: paymentData.customerInfo?.email || 'unknown'
      };
      
      localStorage.setItem('pendingUpgrade', JSON.stringify(upgradeContext));
      
      // Redirect to payment page with upgrade context
      window.location.href = `/payment?type=upgrade&package=${selectedPackage.id}&from=${packageInfo.id}`;
    }
    
    setShowUpgradeModal(false);
  };

  if (!paymentData || isLoading) {
    return <LoadingSkeleton />;
  }

  const currentPhase = getCurrentPhase();
  const nextMilestone = getNextMilestone();
  const estimatedCompletion = projectProgress.estimatedCompletion;
  const daysRemaining = estimatedCompletion ? 
    Math.ceil((new Date(estimatedCompletion) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

  const packageInfo = getPackageInfo(paymentData.plan?.name);
  const packageComparison = comparePackages(paymentData.plan?.name);
  
  // Get dynamic theme based on package
  const packageTheme = getPackageTheme(paymentData.plan?.name);
  const packageClasses = getPackageClasses(paymentData.plan?.name);
  const packageCSS = getPackageCSS(paymentData.plan?.name);
  const packageDisplayInfo = getPackageDisplayInfo(paymentData.plan?.name);

  return (
    <div className="modern-dashboard">
      {/* Modern Header */}
      <header className="modern-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="header-title">SentraBASE Dashboard</h1>
          </div>
          
          <div className="header-actions">
            {/* Package Status Badge */}
            {packageInfo && (
              <ScaleIn delay={0.3}>
                <div className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1',
                  `header-badge-${packageTheme.name}`
                )}
                >
                  <span className="text-sm">{packageTheme.icon}</span>
                  {packageDisplayInfo.displayName}
                </div>
              </ScaleIn>
            )}
            
            <button className="notification-btn">
              <Bell className="w-5 h-5" />
              <span className="notification-badge"></span>
            </button>
            
            <div className="user-profile">
              <div className="user-avatar">
                <User className="w-4 h-4" />
              </div>
              <div className="user-info">
                <h4>{paymentData.customerName}</h4>
                <p>{paymentData.clinicName}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="notification-btn"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <StaggerContainer staggerDelay={0.1}>
          {/* Welcome Section */}
          <StaggerItem className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Selamat datang kembali, {paymentData.customerName}! 👋
                </h2>
                <p className="text-gray-600">
                  Berikut adalah progress terkini dari setup SentraBASE untuk {paymentData.clinicName}
                </p>
              </div>
              <HoverScale>
                <button
                  onClick={handleScheduleDemo}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Demo
                </button>
              </HoverScale>
            </div>
          </StaggerItem>

          {/* Package Banner */}
          {packageInfo && (
            <StaggerItem>
              <div 
                className={cn('package-banner', `package-banner-${packageTheme.name}`)}
                style={packageCSS}
              >
                <div className="package-content">
                  <div className="package-info">
                    <div className={cn('package-icon', `package-icon-${packageTheme.name}`)}>
                      <span className="text-2xl">{packageTheme.icon}</span>
                    </div>
                    <div className="package-details">
                      <h2>{packageDisplayInfo.displayName}</h2>
                      <p>{packageDisplayInfo.description}</p>
                      <div className="package-features">
                        <div className="package-feature">
                          <Users className="w-4 h-4" />
                          <span>{packageInfo.maxUsers} Users</span>
                        </div>
                        <div className="package-feature">
                          <Database className="w-4 h-4" />
                          <span>{packageInfo.maxPatients} Patients</span>
                        </div>
                        <div className="package-feature">
                          <Zap className="w-4 h-4" />
                          <span>{packageInfo.features.length} Features</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="package-pricing">
                    <h3 className="package-price">
                      Rp <CountUp to={packageInfo.price} duration={2} formatCurrency={true} />
                    </h3>
                    <p className="package-period">per tahun</p>
                    {packageComparison.upgrades.length > 0 && (
                      <HoverScale>
                        <button
                          onClick={handleUpgradePackage}
                          className={cn('upgrade-btn', `package-button-${packageTheme.name}`)}
                        >
                          <TrendingUp className="w-4 h-4 inline mr-2" />
                          Upgrade Available
                        </button>
                      </HoverScale>
                    )}
                  </div>
                </div>
              </div>
            </StaggerItem>
          )}

          {/* Stats Grid */}
          <StaggerItem>
            <div className={cn('stats-grid', `stats-theme-${packageTheme.name}`)}>
              <StatsCard
                icon={<Activity className="w-6 h-6" />}
                iconColor="blue"
                value={`${projectProgress.overallProgress}%`}
                title="Progress Keseluruhan"
                description="Total completion project"
                progress={projectProgress.overallProgress}
                theme={packageTheme.name}
              />
              
              <StatsCard
                icon={<PlayCircle className="w-6 h-6" />}
                iconColor="green"
                value={currentPhase?.name || 'Starting'}
                title="Fase Saat Ini"
                description={`${currentPhase?.progress || 0}% completed`}
                progress={currentPhase?.progress || 0}
                theme={packageTheme.name}
              />
              
              <StatsCard
                icon={<Timer className="w-6 h-6" />}
                iconColor="orange"
                value={`${daysRemaining} hari`}
                title="Estimasi Selesai"
                description="Target go-live"
                showProgress={false}
                theme={packageTheme.name}
              />
              
              <StatsCard
                icon={<Award className="w-6 h-6" />}
                iconColor="purple"
                value={nextMilestone?.name || 'Setup Complete'}
                title="Next Milestone"
                description="Upcoming target"
                showProgress={false}
                theme={packageTheme.name}
              />
            </div>
          </StaggerItem>

          {/* Progress Timeline */}
          <StaggerItem>
            <ProgressTimeline 
              phases={projectProgress.phases}
              currentPhase={currentPhase}
              theme={packageTheme.name}
            />
          </StaggerItem>

          {/* Action Cards */}
          <StaggerItem>
            <ActionCards 
              onDownloadInvoice={handleDownloadInvoice}
              onScheduleDemo={handleScheduleDemo}
              onContactSupport={handleContactSupport}
              theme={packageTheme.name}
            />
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPackage={packageInfo}
        availableUpgrades={packageComparison.upgrades}
        onConfirmUpgrade={handleConfirmUpgrade}
      />
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon, iconColor, value, title, description, progress, showProgress = true, theme = 'starter' }) => (
  <HoverScale>
    <div className={cn('stat-card', `stat-card-${theme}`)}>
      <div className="stat-header">
        <div className={cn('stat-icon', iconColor, `stat-icon-${theme}`)}>
          {icon}
        </div>
        {showProgress && progress !== undefined && (
          <div className="text-right">
            <CircularProgress 
              progress={progress} 
              size={60} 
              strokeWidth={4}
              color={theme === 'starter' ? 'blue' : theme === 'professional' ? 'green' : 'purple'}
              showPercentage={false}
            />
          </div>
        )}
      </div>
      
      <h3 className="stat-title">{title}</h3>
      <p className="stat-description">{description}</p>
      
      {showProgress && progress !== undefined && (
        <div className="mt-4">
          <LinearProgress 
            progress={progress}
            color={theme === 'starter' ? 'blue' : theme === 'professional' ? 'green' : 'purple'}
            height="h-2"
          />
        </div>
      )}
      
      {!showProgress && (
        <div className="mt-2">
          <span className="text-lg font-semibold text-gray-900">{value}</span>
        </div>
      )}
    </div>
  </HoverScale>
);

// Progress Timeline Component
const ProgressTimeline = ({ phases, currentPhase, theme = 'starter' }) => {
  const getThemeColor = (theme) => {
    const colors = {
      starter: 'blue',
      professional: 'green', 
      enterprise: 'purple'
    };
    return colors[theme] || 'blue';
  };

  return (
    <div className={cn('progress-section', `timeline-theme-${theme}`)}>
      <div className="section-header">
        <h3 className="section-title">Project Timeline</h3>
      </div>
      
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <FadeIn
            key={phase.id}
            delay={index * 0.1}
            direction="left"
          >
            <div className={cn(
              'flex items-center p-4 rounded-xl border-2 transition-all duration-200',
              phase.id === currentPhase?.id 
                ? `border-${getThemeColor(theme)}-200 bg-${getThemeColor(theme)}-50` 
                : phase.completed 
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-white'
            )}>
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center mr-4',
                phase.id === currentPhase?.id 
                  ? `bg-${getThemeColor(theme)}-500 text-white timeline-active` 
                  : phase.completed 
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
              )}>
                {phase.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : phase.id === currentPhase?.id ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{phase.name}</h4>
                <p className="text-sm text-gray-600">{phase.description}</p>
                {phase.id === currentPhase?.id && (
                  <div className="mt-2">
                    <LinearProgress 
                      progress={phase.progress}
                      color={getThemeColor(theme)}
                      height="h-2"
                      showLabel={true}
                      label="Progress"
                    />
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  phase.completed 
                    ? 'bg-green-100 text-green-700'
                    : phase.id === currentPhase?.id
                      ? `bg-${getThemeColor(theme)}-100 text-${getThemeColor(theme)}-700`
                      : 'bg-gray-100 text-gray-600'
                )}>
                  {phase.completed ? 'Completed' : phase.id === currentPhase?.id ? 'In Progress' : 'Pending'}
                </span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

// Action Cards Component
const ActionCards = ({ onDownloadInvoice, onScheduleDemo, onContactSupport, theme = 'starter' }) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-3 gap-6', `action-cards-${theme}`)}>
    <ActionCard
      icon={<Download className="w-6 h-6" />}
      title="Download Invoice"
      description="Get your payment receipt"
      onClick={onDownloadInvoice}
      color="blue"
      theme={theme}
    />
    
    <ActionCard
      icon={<Calendar className="w-6 h-6" />}
      title="Schedule Demo"
      description="Book a product walkthrough"
      onClick={onScheduleDemo}
      color="green"
      theme={theme}
    />
    
    <ActionCard
      icon={<Headphones className="w-6 h-6" />}
      title="Contact Support"
      description="Get help from our team"
      onClick={onContactSupport}
      color="purple"
      theme={theme}
    />
  </div>
);

const ActionCard = ({ icon, title, description, onClick, color, theme = 'starter' }) => {
  const getThemeColors = (color, theme) => {
    const themeMap = {
      starter: {
        blue: 'border-blue-200 hover:border-blue-300',
        green: 'border-green-200 hover:border-green-300',
        purple: 'border-purple-200 hover:border-purple-300'
      },
      professional: {
        blue: 'border-green-200 hover:border-green-300',
        green: 'border-green-200 hover:border-green-300',
        purple: 'border-green-200 hover:border-green-300'
      },
      enterprise: {
        blue: 'border-purple-200 hover:border-purple-300',
        green: 'border-purple-200 hover:border-purple-300',
        purple: 'border-purple-200 hover:border-purple-300'
      }
    };
    return themeMap[theme]?.[color] || themeMap.starter[color];
  };

  const getIconColors = (color, theme) => {
    const iconMap = {
      starter: {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600'
      },
      professional: {
        blue: 'bg-green-100 text-green-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-green-100 text-green-600'
      },
      enterprise: {
        blue: 'bg-purple-100 text-purple-600',
        green: 'bg-purple-100 text-purple-600',
        purple: 'bg-purple-100 text-purple-600'
      }
    };
    return iconMap[theme]?.[color] || iconMap.starter[color];
  };

  return (
    <HoverScale>
      <div
        onClick={onClick}
        className={cn(
          'p-6 rounded-xl border-2 cursor-pointer transition-all duration-200',
          'hover:shadow-lg bg-white action-card',
          getThemeColors(color, theme)
        )}
      >
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
          getIconColors(color, theme)
        )}>
          {icon}
        </div>
        
        <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
        <div className={cn(
          'flex items-center text-sm font-medium',
          theme === 'starter' ? 'text-blue-600' :
          theme === 'professional' ? 'text-green-600' :
          'text-purple-600'
        )}>
          <span>Learn more</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </HoverScale>
  );
};

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="modern-dashboard">
    <div className="modern-header">
      <div className="header-content">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg skeleton"></div>
          <div className="w-48 h-6 bg-gray-200 rounded skeleton"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-8 bg-gray-200 rounded-full skeleton"></div>
          <div className="w-10 h-10 bg-gray-200 rounded-full skeleton"></div>
        </div>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="space-y-8">
        <div className="w-full h-32 bg-gray-200 rounded-2xl skeleton"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full h-32 bg-gray-200 rounded-xl skeleton"></div>
          ))}
        </div>
        <div className="w-full h-64 bg-gray-200 rounded-xl skeleton"></div>
      </div>
    </div>
  </div>
);

export default ModernDashboard;
