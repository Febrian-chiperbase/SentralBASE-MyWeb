import React from 'react';
import { cn } from '@/lib/utils';

// Spinner Loading
const Spinner = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size],
        className
      )}
    />
  );
};

// Pulse Loading
const PulseLoader = ({ className }) => (
  <div className={cn('flex space-x-2', className)}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

// Progress Bar
const ProgressBar = ({ progress, className }) => (
  <div className={cn('w-full bg-gray-200 rounded-full h-2', className)}>
    <div
      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
);

// Full Screen Loading
const FullScreenLoader = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center space-y-4">
      <Spinner size="xl" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
);

// Button Loading State
const LoadingButton = ({ loading, children, disabled, className, loadingText, ...props }) => (
  <button
    disabled={loading || disabled}
    className={cn(
      'relative inline-flex items-center justify-center transition-all duration-200',
      loading && 'cursor-not-allowed',
      disabled && !loading && 'opacity-50 cursor-not-allowed',
      className
    )}
    {...props}
  >
    {loading ? (
      <div className="flex items-center space-x-2">
        <Spinner size="sm" className="border-t-white border-gray-300" />
        <span>{loadingText || 'Loading...'}</span>
      </div>
    ) : (
      children
    )}
  </button>
);

export { Spinner, PulseLoader, ProgressBar, FullScreenLoader, LoadingButton };
