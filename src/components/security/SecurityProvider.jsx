import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  initializeSecurity, 
  securityLogger, 
  csrfProtection,
  demoFormRateLimiter,
  secureStorage 
} from '../../utils/security';

// Security Context
const SecurityContext = createContext();

// Custom hook to use security context
export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

// Security Provider Component
export const SecurityProvider = ({ children }) => {
  const [isSecurityInitialized, setIsSecurityInitialized] = useState(false);
  const [securityStatus, setSecurityStatus] = useState({
    csrfToken: null,
    rateLimitStatus: { allowed: true, attemptsLeft: 3 },
    lastSecurityCheck: null
  });

  // Initialize security on mount
  useEffect(() => {
    try {
      initializeSecurity();
      
      setSecurityStatus(prev => ({
        ...prev,
        csrfToken: csrfProtection.getToken(),
        lastSecurityCheck: new Date().toISOString()
      }));
      
      setIsSecurityInitialized(true);
      
      securityLogger.logSecurityEvent('SECURITY_PROVIDER_INITIALIZED');
    } catch (error) {
      console.error('Failed to initialize security:', error);
      securityLogger.logSecurityEvent('SECURITY_INITIALIZATION_FAILED', {
        error: error.message
      });
    }
  }, []);

  // Security functions
  const checkRateLimit = (identifier = 'demo_form') => {
    const result = demoFormRateLimiter.isAllowed(identifier);
    
    setSecurityStatus(prev => ({
      ...prev,
      rateLimitStatus: result
    }));
    
    if (!result.allowed) {
      securityLogger.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
        identifier,
        remainingTime: result.remainingTime
      });
    }
    
    return result;
  };

  const refreshCSRFToken = () => {
    try {
      const newToken = csrfProtection.setToken();
      setSecurityStatus(prev => ({
        ...prev,
        csrfToken: newToken
      }));
      return newToken;
    } catch (error) {
      securityLogger.logSecurityEvent('CSRF_TOKEN_REFRESH_FAILED', {
        error: error.message
      });
      return null;
    }
  };

  const logSecurityEvent = (event, details = {}) => {
    securityLogger.logSecurityEvent(event, {
      ...details,
      securityStatus: securityStatus
    });
  };

  const clearSecureData = () => {
    secureStorage.clear();
    logSecurityEvent('SECURE_DATA_CLEARED');
  };

  // Validate form data with security checks
  const validateSecureForm = (formData, validationSchema) => {
    try {
      // Check rate limiting first
      const rateLimitCheck = checkRateLimit('form_validation');
      if (!rateLimitCheck.allowed) {
        return {
          isValid: false,
          errors: { 
            _security: `Terlalu banyak percobaan. Coba lagi dalam ${rateLimitCheck.remainingTime} detik.` 
          },
          rateLimited: true
        };
      }

      // Run validation schema
      const validation = validationSchema(formData);
      
      if (!validation.isValid) {
        logSecurityEvent('FORM_VALIDATION_FAILED', {
          errors: Object.keys(validation.errors),
          formType: 'demo_form'
        });
      }

      return validation;
    } catch (error) {
      logSecurityEvent('FORM_VALIDATION_ERROR', {
        error: error.message
      });
      
      return {
        isValid: false,
        errors: { _security: 'Terjadi kesalahan validasi. Silakan coba lagi.' }
      };
    }
  };

  // Security context value
  const securityContextValue = {
    // Status
    isSecurityInitialized,
    securityStatus,
    
    // Functions
    checkRateLimit,
    refreshCSRFToken,
    logSecurityEvent,
    clearSecureData,
    validateSecureForm,
    
    // Utilities
    getCSRFToken: () => securityStatus.csrfToken,
    isRateLimited: () => !securityStatus.rateLimitStatus.allowed,
    getRemainingAttempts: () => securityStatus.rateLimitStatus.attemptsLeft || 0
  };

  // Security status indicator (for development)
  const SecurityStatusIndicator = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white p-2 rounded text-xs">
        <div>🔒 Security: {isSecurityInitialized ? '✅' : '❌'}</div>
        <div>CSRF: {securityStatus.csrfToken ? '✅' : '❌'}</div>
        <div>Rate Limit: {securityStatus.rateLimitStatus.allowed ? '✅' : '❌'}</div>
      </div>
    );
  };

  return (
    <SecurityContext.Provider value={securityContextValue}>
      {children}
      <SecurityStatusIndicator />
    </SecurityContext.Provider>
  );
};

// HOC for components that need security
export const withSecurity = (WrappedComponent) => {
  return function SecurityWrappedComponent(props) {
    const security = useSecurity();
    
    return <WrappedComponent {...props} security={security} />;
  };
};

export default SecurityProvider;
