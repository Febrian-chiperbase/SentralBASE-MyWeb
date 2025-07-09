import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Circular Progress Component
export const CircularProgress = ({ 
  progress = 0, 
  size = 120, 
  strokeWidth = 8, 
  color = 'blue',
  showPercentage = true,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    red: 'text-red-600'
  };

  const strokeColors = {
    blue: '#3b82f6',
    green: '#10b981',
    orange: '#f59e0b',
    purple: '#8b5cf6',
    red: '#ef4444'
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColors[color]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={cn('text-2xl font-bold', colorClasses[color])}
          >
            {progress}%
          </motion.span>
        </div>
      )}
    </div>
  );
};

// Linear Progress Component
export const LinearProgress = ({ 
  progress = 0, 
  color = 'blue',
  height = 'h-2',
  showLabel = false,
  label = '',
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500'
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
      )}
      
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', height)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn('h-full rounded-full', colorClasses[color])}
        />
      </div>
    </div>
  );
};

// Step Progress Component
export const StepProgress = ({ 
  steps = [], 
  currentStep = 0,
  className = ''
}) => {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id || index}>
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200',
                index <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              )}
            >
              {index < currentStep ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </motion.div>
            
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={cn(
                'mt-2 text-xs text-center max-w-20',
                index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
              )}
            >
              {step.name || step.title}
            </motion.span>
          </div>
          
          {index < steps.length - 1 && (
            <div className="flex-1 mx-4">
              <div className="h-0.5 bg-gray-200 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: index < currentStep ? '100%' : '0%' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full bg-blue-600"
                />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Radial Progress Component
export const RadialProgress = ({ 
  progress = 0, 
  size = 100,
  thickness = 8,
  color = 'blue',
  backgroundColor = '#f3f4f6',
  children,
  className = ''
}) => {
  const strokeColors = {
    blue: '#3b82f6',
    green: '#10b981',
    orange: '#f59e0b',
    purple: '#8b5cf6',
    red: '#ef4444'
  };

  return (
    <div 
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - thickness) / 2}
          stroke={backgroundColor}
          strokeWidth={thickness}
          fill="none"
        />
        
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={(size - thickness) / 2}
          stroke={strokeColors[color]}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * ((size - thickness) / 2)}`}
          initial={{ strokeDashoffset: 2 * Math.PI * ((size - thickness) / 2) }}
          animate={{ 
            strokeDashoffset: 2 * Math.PI * ((size - thickness) / 2) * (1 - progress / 100)
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

// Progress Ring Component
export const ProgressRing = ({ 
  progress = 0,
  size = 120,
  strokeWidth = 10,
  color = 'blue',
  label = '',
  value = '',
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color === 'blue' ? '#3b82f6' : '#10b981'} />
            <stop offset="100%" stopColor={color === 'blue' ? '#1d4ed8' : '#059669'} />
          </linearGradient>
        </defs>
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          {value && (
            <div className="text-2xl font-bold text-gray-900">{value}</div>
          )}
          {label && (
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
