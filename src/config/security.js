// 🔒 Security Configuration for SentraBASE Healthcare Platform
// Healthcare-grade security settings and policies

export const SECURITY_CONFIG = {
  // Rate Limiting Configuration
  RATE_LIMITS: {
    DEMO_FORM: {
      maxAttempts: 3,
      windowMs: 10 * 60 * 1000, // 10 minutes
    },
    FORM_VALIDATION: {
      maxAttempts: 10,
      windowMs: 5 * 60 * 1000, // 5 minutes
    },
    FORM_SUBMISSION: {
      maxAttempts: 2,
      windowMs: 15 * 60 * 1000, // 15 minutes
    }
  },

  // Session Management
  SESSION: {
    TIMEOUT: 30 * 60 * 1000, // 30 minutes
    CSRF_TOKEN_EXPIRY: 60 * 60 * 1000, // 1 hour
    AUTO_SAVE_INTERVAL: 30 * 1000, // 30 seconds
  },

  // Input Validation Limits
  INPUT_LIMITS: {
    NAME_MAX_LENGTH: 100,
    EMAIL_MAX_LENGTH: 255,
    PHONE_MAX_LENGTH: 20,
    COMPANY_MAX_LENGTH: 200,
    TEXTAREA_MAX_LENGTH: 2000,
    GENERAL_INPUT_MAX_LENGTH: 500,
  },

  // Content Security Policy
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: [
      "'self'",
      "'unsafe-inline'", // Required for React inline styles
      "https://cdn.jsdelivr.net",
    ],
    STYLE_SRC: [
      "'self'",
      "'unsafe-inline'", // Required for Tailwind CSS
      "https://fonts.googleapis.com",
    ],
    FONT_SRC: [
      "'self'",
      "https://fonts.gstatic.com",
    ],
    IMG_SRC: [
      "'self'",
      "data:",
      "https:",
    ],
    CONNECT_SRC: [
      "'self'",
      "https://api.sentrabase.id",
      "https://analytics.sentrabase.id",
    ],
    FRAME_ANCESTORS: ["'none'"],
    BASE_URI: ["'self'"],
    FORM_ACTION: ["'self'"],
  },

  // Security Headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  },

  // Suspicious Activity Detection
  THREAT_DETECTION: {
    RAPID_CLICKS: {
      threshold: 10,
      timeWindow: 1000, // 1 second
    },
    LARGE_INPUT: {
      threshold: 1000, // characters
    },
    MALICIOUS_PATTERNS: [
      /script/i,
      /javascript/i,
      /vbscript/i,
      /onload/i,
      /onerror/i,
      /onclick/i,
      /onmouseover/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /eval\(/i,
      /document\.cookie/i,
      /document\.write/i,
    ],
  },

  // Healthcare Compliance Settings
  HEALTHCARE_COMPLIANCE: {
    // HIPAA-like requirements for healthcare data
    DATA_RETENTION: {
      FORM_DATA: 24 * 60 * 60 * 1000, // 24 hours
      SECURITY_LOGS: 30 * 24 * 60 * 60 * 1000, // 30 days
      SESSION_DATA: 30 * 60 * 1000, // 30 minutes
    },
    
    ENCRYPTION: {
      ALGORITHM: 'AES-256-GCM',
      KEY_ROTATION: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    
    AUDIT_REQUIREMENTS: {
      LOG_ALL_ACCESS: true,
      LOG_DATA_CHANGES: true,
      LOG_SECURITY_EVENTS: true,
      RETENTION_PERIOD: 90 * 24 * 60 * 60 * 1000, // 90 days
    }
  },

  // API Security
  API_SECURITY: {
    TIMEOUT: 30000, // 30 seconds
    MAX_RETRIES: 3,
    BACKOFF_MULTIPLIER: 2,
    REQUIRED_HEADERS: [
      'X-Requested-With',
      'X-CSRF-Token',
      'Content-Type',
    ],
  },

  // Development vs Production Settings
  ENVIRONMENT: {
    DEVELOPMENT: {
      SHOW_SECURITY_INDICATOR: true,
      LOG_SECURITY_EVENTS: true,
      STRICT_CSP: false,
    },
    PRODUCTION: {
      SHOW_SECURITY_INDICATOR: false,
      LOG_SECURITY_EVENTS: true,
      STRICT_CSP: true,
      FORCE_HTTPS: true,
      HSTS_MAX_AGE: 31536000, // 1 year
    }
  }
};

// Security Event Types for Logging
export const SECURITY_EVENTS = {
  // Authentication & Authorization
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  SESSION_CREATED: 'SESSION_CREATED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Form Security
  FORM_OPENED: 'FORM_OPENED',
  FORM_VALIDATION_FAILED: 'FORM_VALIDATION_FAILED',
  FORM_SUBMISSION_SUCCESS: 'FORM_SUBMISSION_SUCCESS',
  FORM_SUBMISSION_FAILED: 'FORM_SUBMISSION_FAILED',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  RATE_LIMIT_WARNING: 'RATE_LIMIT_WARNING',
  
  // Threat Detection
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  MALICIOUS_INPUT_DETECTED: 'MALICIOUS_INPUT_DETECTED',
  RAPID_CLICKS_DETECTED: 'RAPID_CLICKS_DETECTED',
  
  // System Security
  SECURITY_INITIALIZED: 'SECURITY_INITIALIZED',
  CSRF_TOKEN_GENERATED: 'CSRF_TOKEN_GENERATED',
  CSRF_TOKEN_VALIDATED: 'CSRF_TOKEN_VALIDATED',
  CSRF_TOKEN_INVALID: 'CSRF_TOKEN_INVALID',
  
  // Data Protection
  DATA_ENCRYPTED: 'DATA_ENCRYPTED',
  DATA_DECRYPTED: 'DATA_DECRYPTED',
  SECURE_STORAGE_CLEARED: 'SECURE_STORAGE_CLEARED',
  
  // Compliance
  AUDIT_LOG_CREATED: 'AUDIT_LOG_CREATED',
  COMPLIANCE_CHECK_PASSED: 'COMPLIANCE_CHECK_PASSED',
  COMPLIANCE_CHECK_FAILED: 'COMPLIANCE_CHECK_FAILED',
};

// Security Risk Levels
export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

// Helper function to get environment-specific config
export const getSecurityConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const baseConfig = { ...SECURITY_CONFIG };
  
  if (isDevelopment) {
    return {
      ...baseConfig,
      ...baseConfig.ENVIRONMENT.DEVELOPMENT,
    };
  }
  
  return {
    ...baseConfig,
    ...baseConfig.ENVIRONMENT.PRODUCTION,
  };
};

export default SECURITY_CONFIG;
