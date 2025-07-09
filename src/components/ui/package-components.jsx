import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  Users, 
  Database, 
  Clock, 
  Zap,
  Shield,
  Headphones,
  TrendingUp,
  Award,
  Crown,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Package Badge Component
export const PackageBadge = ({ packageInfo, size = 'md', showIcon = true }) => {
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const colors = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200'
  };

  const icons = {
    '🚀': <Rocket className="w-4 h-4" />,
    '⭐': <Star className="w-4 h-4" />,
    '👑': <Crown className="w-4 h-4" />
  };

  return (
    <div className={cn(
      'inline-flex items-center space-x-2 rounded-full border font-medium',
      sizes[size],
      colors[packageInfo?.color || 'blue']
    )}>
      {showIcon && packageInfo?.icon && (
        <span className="text-sm">{packageInfo.icon}</span>
      )}
      <span>{packageInfo?.displayName || packageInfo?.name}</span>
      {packageInfo?.popular && (
        <Star className="w-3 h-3 fill-current" />
      )}
    </div>
  );
};

// Package Info Card
export const PackageInfoCard = ({ packageInfo, showUpgrade = false, onUpgrade }) => {
  if (!packageInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center text-2xl',
            packageInfo.color === 'blue' && 'bg-blue-100',
            packageInfo.color === 'green' && 'bg-green-100',
            packageInfo.color === 'purple' && 'bg-purple-100'
          )}>
            {packageInfo.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {packageInfo.displayName}
            </h3>
            <p className="text-sm text-gray-600">{packageInfo.description}</p>
          </div>
        </div>
        
        {packageInfo.popular && (
          <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            Most Popular
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">
            Rp {packageInfo.price.toLocaleString('id-ID')}
          </span>
          <span className="text-gray-600">/{packageInfo.billingCycle}</span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Users className="w-5 h-5 text-gray-600 mx-auto mb-1" />
          <div className="text-sm font-medium text-gray-900">
            {packageInfo.maxUsers === 'Unlimited' ? 'Unlimited' : `${packageInfo.maxUsers} Users`}
          </div>
          <div className="text-xs text-gray-600">Max Users</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Database className="w-5 h-5 text-gray-600 mx-auto mb-1" />
          <div className="text-sm font-medium text-gray-900">
            {packageInfo.maxPatients === 'Unlimited' ? 'Unlimited' : `${packageInfo.maxPatients.toLocaleString('id-ID')} Patients`}
          </div>
          <div className="text-xs text-gray-600">Max Patients</div>
        </div>
      </div>

      {/* Setup Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <div>
            <div className="text-sm font-medium text-gray-900">{packageInfo.setupTime}</div>
            <div className="text-xs text-gray-600">Setup Time</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-gray-500" />
          <div>
            <div className="text-sm font-medium text-gray-900">{packageInfo.trainingHours}h</div>
            <div className="text-xs text-gray-600">Training</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Fitur Utama:</h4>
        <div className="space-y-2">
          {packageInfo.features.slice(0, 6).map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
          {packageInfo.features.length > 6 && (
            <div className="text-sm text-gray-500 ml-6">
              +{packageInfo.features.length - 6} fitur lainnya
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Button */}
      {showUpgrade && (
        <button
          onClick={onUpgrade}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Upgrade Package
        </button>
      )}
    </motion.div>
  );
};

// Package Comparison Component
export const PackageComparison = ({ currentPackage, availableUpgrades }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Package Comparison</h3>
      
      <div className="space-y-4">
        {/* Current Package */}
        <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-gray-900">Current: {currentPackage?.displayName}</span>
            </div>
            <span className="text-green-600 font-semibold">
              Rp {currentPackage?.price.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Users: </span>
              <span className="font-medium">{currentPackage?.maxUsers}</span>
            </div>
            <div>
              <span className="text-gray-600">Patients: </span>
              <span className="font-medium">{currentPackage?.maxPatients}</span>
            </div>
            <div>
              <span className="text-gray-600">Features: </span>
              <span className="font-medium">{currentPackage?.features.length}</span>
            </div>
          </div>
        </div>

        {/* Available Upgrades */}
        {availableUpgrades?.map((upgrade) => (
          <div key={upgrade.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Upgrade to {upgrade.displayName}</span>
              </div>
              <div className="text-right">
                <div className="text-blue-600 font-semibold">
                  +Rp {(upgrade.price - currentPackage.price).toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-gray-500">additional/year</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
              <div>
                <span className="text-gray-600">Users: </span>
                <span className="font-medium text-blue-600">{upgrade.maxUsers}</span>
              </div>
              <div>
                <span className="text-gray-600">Patients: </span>
                <span className="font-medium text-blue-600">{upgrade.maxPatients}</span>
              </div>
              <div>
                <span className="text-gray-600">Features: </span>
                <span className="font-medium text-blue-600">{upgrade.features.length}</span>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              Upgrade Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Package Features List
export const PackageFeaturesList = ({ packageInfo, showAll = false }) => {
  const [expanded, setExpanded] = React.useState(showAll);
  const displayFeatures = expanded ? packageInfo.features : packageInfo.features.slice(0, 8);

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Fitur yang Tersedia:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {displayFeatures.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center space-x-2"
          >
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </motion.div>
        ))}
      </div>
      
      {packageInfo.features.length > 8 && !showAll && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {expanded ? 'Show Less' : `Show ${packageInfo.features.length - 8} More Features`}
        </button>
      )}
    </div>
  );
};

// Package Status Indicator
export const PackageStatusIndicator = ({ packageInfo, status = 'active' }) => {
  const statusConfig = {
    active: {
      color: 'green',
      text: 'Active',
      icon: <Check className="w-4 h-4" />
    },
    setup: {
      color: 'blue',
      text: 'Setting Up',
      icon: <Clock className="w-4 h-4" />
    },
    pending: {
      color: 'yellow',
      text: 'Pending',
      icon: <Clock className="w-4 h-4" />
    }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-2">
      <PackageBadge packageInfo={packageInfo} size="sm" />
      <div className={cn(
        'inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
        config.color === 'green' && 'bg-green-100 text-green-800',
        config.color === 'blue' && 'bg-blue-100 text-blue-800',
        config.color === 'yellow' && 'bg-yellow-100 text-yellow-800'
      )}>
        {config.icon}
        <span>{config.text}</span>
      </div>
    </div>
  );
};
