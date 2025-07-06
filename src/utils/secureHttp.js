// 🔒 Secure HTTP Client for SentraBASE
// Healthcare-grade HTTP security with encryption and monitoring

import { getSecurityHeaders, csrfProtection, securityLogger } from './security';
import { SECURITY_CONFIG, SECURITY_EVENTS, RISK_LEVELS } from '../config/security';

/**
 * Secure HTTP Client Class
 * Implements healthcare-grade security for API communications
 */
class SecureHttpClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://api.sentrabase.id';
    this.timeout = SECURITY_CONFIG.API_SECURITY.TIMEOUT;
    this.maxRetries = SECURITY_CONFIG.API_SECURITY.MAX_RETRIES;
    this.backoffMultiplier = SECURITY_CONFIG.API_SECURITY.BACKOFF_MULTIPLIER;
  }

  /**
   * Create secure request headers
   */
  createSecureHeaders(additionalHeaders = {}) {
    const securityHeaders = getSecurityHeaders();
    const csrfToken = csrfProtection.getToken();
    
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-Token': csrfToken,
      'X-Client-Version': process.env.REACT_APP_VERSION || '1.0.0',
      'X-Request-ID': this.generateRequestId(),
      'X-Timestamp': Date.now().toString(),
      ...securityHeaders,
      ...additionalHeaders,
    };
  }

  /**
   * Generate unique request ID for tracking
   */
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate response for security threats
   */
  validateResponse(response, data) {
    // Check for suspicious response patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+=/i,
    ];

    const responseText = JSON.stringify(data);
    const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
      pattern.test(responseText)
    );

    if (hasSuspiciousContent) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.MALICIOUS_INPUT_DETECTED, {
        source: 'API_RESPONSE',
        url: response.url,
        riskLevel: RISK_LEVELS.HIGH,
        patterns: suspiciousPatterns.filter(p => p.test(responseText))
      });
      
      throw new Error('Suspicious content detected in API response');
    }

    // Validate required security headers in response
    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection'
    ];

    const missingHeaders = requiredHeaders.filter(header => 
      !response.headers.get(header)
    );

    if (missingHeaders.length > 0) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.COMPLIANCE_CHECK_FAILED, {
        source: 'API_RESPONSE_HEADERS',
        missingHeaders,
        url: response.url,
        riskLevel: RISK_LEVELS.MEDIUM
      });
    }

    return true;
  }

  /**
   * Secure fetch with retry logic and security monitoring
   */
  async secureFetch(url, options = {}, retryCount = 0) {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      // Prepare secure request
      const secureOptions = {
        ...options,
        headers: this.createSecureHeaders(options.headers),
        credentials: 'same-origin',
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'error', // Prevent automatic redirects for security
      };

      // Add timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      secureOptions.signal = controller.signal;

      // Log request start
      securityLogger.logSecurityEvent(SECURITY_EVENTS.API_REQUEST_STARTED, {
        requestId,
        url,
        method: options.method || 'GET',
        timestamp: startTime
      });

      // Make request
      const response = await fetch(url, secureOptions);
      clearTimeout(timeoutId);

      // Check response status
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse response
      const data = await response.json();

      // Validate response security
      this.validateResponse(response, data);

      // Log successful request
      const duration = Date.now() - startTime;
      securityLogger.logSecurityEvent(SECURITY_EVENTS.API_REQUEST_SUCCESS, {
        requestId,
        url,
        duration,
        status: response.status
      });

      return {
        data,
        status: response.status,
        headers: response.headers,
        requestId
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Log error
      securityLogger.logSecurityEvent(SECURITY_EVENTS.API_REQUEST_FAILED, {
        requestId,
        url,
        error: error.message,
        duration,
        retryCount,
        riskLevel: error.name === 'AbortError' ? RISK_LEVELS.LOW : RISK_LEVELS.MEDIUM
      });

      // Retry logic for transient errors
      if (retryCount < this.maxRetries && this.shouldRetry(error)) {
        const delay = Math.pow(this.backoffMultiplier, retryCount) * 1000;
        
        securityLogger.logSecurityEvent(SECURITY_EVENTS.API_REQUEST_RETRY, {
          requestId,
          url,
          retryCount: retryCount + 1,
          delay
        });

        await new Promise(resolve => setTimeout(resolve, delay));
        return this.secureFetch(url, options, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * Determine if request should be retried
   */
  shouldRetry(error) {
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      error.name === 'AbortError' ||
      error.name === 'TypeError' ||
      error.message.includes('500') ||
      error.message.includes('502') ||
      error.message.includes('503') ||
      error.message.includes('504')
    );
  }

  /**
   * Secure GET request
   */
  async get(url, options = {}) {
    return this.secureFetch(url, { ...options, method: 'GET' });
  }

  /**
   * Secure POST request
   */
  async post(url, data, options = {}) {
    return this.secureFetch(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Secure PUT request
   */
  async put(url, data, options = {}) {
    return this.secureFetch(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Secure DELETE request
   */
  async delete(url, options = {}) {
    return this.secureFetch(url, { ...options, method: 'DELETE' });
  }

  /**
   * Submit demo form securely
   */
  async submitDemoForm(formData) {
    const endpoint = `${this.baseURL}/api/v1/demo/schedule`;
    
    // Add security metadata
    const secureFormData = {
      ...formData,
      security: {
        csrfToken: csrfProtection.getToken(),
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        sessionId: formData.sessionId
      }
    };

    // Log form submission attempt
    securityLogger.logSecurityEvent(SECURITY_EVENTS.FORM_SUBMISSION_STARTED, {
      sessionId: formData.sessionId,
      endpoint,
      timestamp: Date.now()
    });

    try {
      const response = await this.post(endpoint, secureFormData);
      
      securityLogger.logSecurityEvent(SECURITY_EVENTS.FORM_SUBMISSION_SUCCESS, {
        sessionId: formData.sessionId,
        requestId: response.requestId,
        timestamp: Date.now()
      });

      return response;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.FORM_SUBMISSION_FAILED, {
        sessionId: formData.sessionId,
        error: error.message,
        timestamp: Date.now(),
        riskLevel: RISK_LEVELS.MEDIUM
      });
      
      throw error;
    }
  }
}

// Create singleton instance
const secureHttp = new SecureHttpClient();

// Export convenience methods
export const secureGet = (url, options) => secureHttp.get(url, options);
export const securePost = (url, data, options) => secureHttp.post(url, data, options);
export const securePut = (url, data, options) => secureHttp.put(url, data, options);
export const secureDelete = (url, options) => secureHttp.delete(url, options);
export const submitDemoForm = (formData) => secureHttp.submitDemoForm(formData);

export default secureHttp;
