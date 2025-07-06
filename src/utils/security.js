// 🔒 Security Utilities for SentraBASE Healthcare Platform
// Implements healthcare-grade security measures

/**
 * Input Sanitization - Prevent XSS attacks
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Email Validation with Security Checks
 */
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const sanitizedEmail = sanitizeInput(email);
  
  // Check for common malicious patterns
  const maliciousPatterns = [
    /script/i,
    /javascript/i,
    /vbscript/i,
    /onload/i,
    /onerror/i
  ];
  
  const hasMaliciousContent = maliciousPatterns.some(pattern => 
    pattern.test(sanitizedEmail)
  );
  
  return {
    isValid: emailRegex.test(sanitizedEmail) && !hasMaliciousContent,
    sanitized: sanitizedEmail,
    errors: []
  };
};

/**
 * Phone Number Validation and Sanitization
 */
export const validatePhone = (phone) => {
  const sanitized = sanitizeInput(phone).replace(/[^\d+\-\s()]/g, '');
  const phoneRegex = /^[\+]?[0-9\-\s()]{10,15}$/;
  
  return {
    isValid: phoneRegex.test(sanitized),
    sanitized: sanitized,
    errors: sanitized.length < 10 ? ['Phone number too short'] : []
  };
};

/**
 * Content Security Policy Headers
 */
export const getCSPHeaders = () => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.sentrabase.id",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  };
};

/**
 * Rate Limiting for Form Submissions
 */
class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.attempts = new Map();
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }
  
  isAllowed(identifier) {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Clean old attempts
    const recentAttempts = userAttempts.filter(
      timestamp => now - timestamp < this.windowMs
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      return {
        allowed: false,
        remainingTime: Math.ceil((recentAttempts[0] + this.windowMs - now) / 1000)
      };
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return {
      allowed: true,
      attemptsLeft: this.maxAttempts - recentAttempts.length
    };
  }
  
  reset(identifier) {
    this.attempts.delete(identifier);
  }
}

export const demoFormRateLimiter = new RateLimiter(3, 10 * 60 * 1000); // 3 attempts per 10 minutes

/**
 * Secure Session Storage
 */
export const secureStorage = {
  set: (key, value, expirationMinutes = 30) => {
    const item = {
      value: value,
      timestamp: Date.now(),
      expiration: expirationMinutes * 60 * 1000
    };
    
    try {
      sessionStorage.setItem(`secure_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to store secure data:', error);
    }
  },
  
  get: (key) => {
    try {
      const item = JSON.parse(sessionStorage.getItem(`secure_${key}`));
      if (!item) return null;
      
      const now = Date.now();
      if (now - item.timestamp > item.expiration) {
        sessionStorage.removeItem(`secure_${key}`);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.warn('Failed to retrieve secure data:', error);
      return null;
    }
  },
  
  remove: (key) => {
    sessionStorage.removeItem(`secure_${key}`);
  },
  
  clear: () => {
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('secure_')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

/**
 * CSRF Token Generation and Validation
 */
export const csrfProtection = {
  generateToken: () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },
  
  setToken: () => {
    const token = csrfProtection.generateToken();
    secureStorage.set('csrf_token', token, 60); // 1 hour expiration
    return token;
  },
  
  getToken: () => {
    return secureStorage.get('csrf_token');
  },
  
  validateToken: (providedToken) => {
    const storedToken = csrfProtection.getToken();
    return storedToken && storedToken === providedToken;
  }
};

/**
 * Data Encryption for Sensitive Information
 */
export const dataProtection = {
  // Simple obfuscation for client-side (not cryptographically secure)
  obfuscate: (data) => {
    return btoa(encodeURIComponent(JSON.stringify(data)));
  },
  
  deobfuscate: (obfuscatedData) => {
    try {
      return JSON.parse(decodeURIComponent(atob(obfuscatedData)));
    } catch (error) {
      console.warn('Failed to deobfuscate data:', error);
      return null;
    }
  },
  
  // Hash sensitive data for comparison
  hashData: async (data) => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
};

/**
 * Security Headers for API Requests
 */
export const getSecurityHeaders = () => {
  const csrfToken = csrfProtection.getToken();
  
  return {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-Token': csrfToken,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
};

/**
 * Input Validation Schema for Demo Form
 */
export const demoFormValidation = {
  validateStep1: (data) => {
    const errors = {};
    
    // Full Name
    if (!data.fullName || data.fullName.length < 2) {
      errors.fullName = 'Nama lengkap minimal 2 karakter';
    } else if (data.fullName.length > 100) {
      errors.fullName = 'Nama lengkap maksimal 100 karakter';
    }
    
    // Email
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.email = 'Format email tidak valid';
    }
    
    // Phone
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.isValid) {
      errors.phone = 'Format nomor telepon tidak valid';
    }
    
    // Job Title
    if (!data.jobTitle || data.jobTitle.length < 2) {
      errors.jobTitle = 'Jabatan minimal 2 karakter';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData: {
        fullName: sanitizeInput(data.fullName),
        email: emailValidation.sanitized,
        phone: phoneValidation.sanitized,
        jobTitle: sanitizeInput(data.jobTitle)
      }
    };
  },
  
  validateStep2: (data) => {
    const errors = {};
    
    // Company Name
    if (!data.companyName || data.companyName.length < 2) {
      errors.companyName = 'Nama perusahaan minimal 2 karakter';
    } else if (data.companyName.length > 200) {
      errors.companyName = 'Nama perusahaan maksimal 200 karakter';
    }
    
    // Company Size
    const validSizes = ['1-5 klinik', '6-15 klinik', '16-50 klinik', '50+ klinik'];
    if (!validSizes.includes(data.companySize)) {
      errors.companySize = 'Pilih ukuran perusahaan yang valid';
    }
    
    // Location
    if (!data.location || data.location.length < 2) {
      errors.location = 'Lokasi minimal 2 karakter';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData: {
        companyName: sanitizeInput(data.companyName),
        companySize: data.companySize,
        location: sanitizeInput(data.location),
        currentSystem: sanitizeInput(data.currentSystem)
      }
    };
  },
  
  validateStep3: (data) => {
    const errors = {};
    
    // Date validation
    const selectedDate = new Date(data.preferredDate);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    
    if (!data.preferredDate) {
      errors.preferredDate = 'Pilih tanggal demo';
    } else if (selectedDate <= today) {
      errors.preferredDate = 'Tanggal demo harus setelah hari ini';
    } else if (selectedDate > maxDate) {
      errors.preferredDate = 'Tanggal demo maksimal 30 hari ke depan';
    }
    
    // Time validation
    const validTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
    if (!validTimes.includes(data.preferredTime)) {
      errors.preferredTime = 'Pilih waktu yang tersedia';
    }
    
    // Demo type validation
    const validDemoTypes = [
      'Demo Umum (30 menit)',
      'Demo Teknis Mendalam (60 menit)',
      'Konsultasi Kebutuhan (45 menit)',
      'Demo Khusus Fitur Tertentu (30 menit)'
    ];
    if (!validDemoTypes.includes(data.demoType)) {
      errors.demoType = 'Pilih jenis demo yang valid';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData: {
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        demoType: data.demoType,
        specificNeeds: sanitizeInput(data.specificNeeds)
      }
    };
  }
};

/**
 * Security Event Logging
 */
export const securityLogger = {
  logSecurityEvent: (event, details = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: event,
      userAgent: navigator.userAgent,
      url: window.location.href,
      details: details
    };
    
    // In production, send to security monitoring service
    console.warn('Security Event:', logEntry);
    
    // Store locally for debugging (remove in production)
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('security_logs', JSON.stringify(logs));
  },
  
  getSecurityLogs: () => {
    return JSON.parse(localStorage.getItem('security_logs') || '[]');
  },
  
  clearSecurityLogs: () => {
    localStorage.removeItem('security_logs');
  }
};

/**
 * Initialize Security Measures
 */
export const initializeSecurity = () => {
  // Set CSRF token
  csrfProtection.setToken();
  
  // Clear expired secure storage
  secureStorage.clear();
  
  // Log security initialization
  securityLogger.logSecurityEvent('SECURITY_INITIALIZED', {
    timestamp: Date.now(),
    userAgent: navigator.userAgent
  });
  
  // Set up security event listeners
  window.addEventListener('beforeunload', () => {
    secureStorage.clear();
  });
  
  // Monitor for suspicious activity
  let rapidClickCount = 0;
  let lastClickTime = 0;
  
  document.addEventListener('click', () => {
    const now = Date.now();
    if (now - lastClickTime < 100) { // Clicks faster than 100ms
      rapidClickCount++;
      if (rapidClickCount > 10) {
        securityLogger.logSecurityEvent('SUSPICIOUS_RAPID_CLICKS', {
          count: rapidClickCount,
          timeWindow: now - lastClickTime
        });
      }
    } else {
      rapidClickCount = 0;
    }
    lastClickTime = now;
  });
};

export default {
  sanitizeInput,
  validateEmail,
  validatePhone,
  getCSPHeaders,
  demoFormRateLimiter,
  secureStorage,
  csrfProtection,
  dataProtection,
  getSecurityHeaders,
  demoFormValidation,
  securityLogger,
  initializeSecurity
};
