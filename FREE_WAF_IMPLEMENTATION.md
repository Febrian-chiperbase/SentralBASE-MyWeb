// 🆓 Free WAF Middleware for SentraBASE
// Self-hosted WAF implementation using Express.js middleware

import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import { securityLogger } from '../utils/security.js';
import { SECURITY_EVENTS, RISK_LEVELS } from '../config/security.js';

/**
 * Free WAF Implementation Class
 */
class FreeWAF {
  constructor() {
    this.blockedIPs = new Set();
    this.suspiciousIPs = new Map();
    this.attackPatterns = [
      // XSS Patterns
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      
      // SQL Injection Patterns
      /(\b(select|insert|update|delete|drop|create|alter|exec|union)\b)/gi,
      /(\b(or|and)\b\s+\b\d+\b\s*=\s*\b\d+\b)/gi,
      
      // Command Injection
      /(\||;|&|`|\$\(|\${)/g,
      
      // Path Traversal
      /\.\.\//g,
      /\.\.\\/g,
      
      // File Inclusion
      /(php|asp|jsp|cfm|pl):/gi
    ];
  }

  /**
   * Security Headers Middleware
   */
  securityHeaders() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://api.sentrabase.id"],
          frameAncestors: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"]
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    });
  }

  /**
   * Rate Limiting Middleware
   */
  rateLimiting() {
    return {
      // General API rate limiting
      api: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // 100 requests per window
        message: {
          error: 'Too many requests from this IP',
          retryAfter: '15 minutes'
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
          securityLogger.logSecurityEvent(SECURITY_EVENTS.RATE_LIMIT_EXCEEDED, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
            riskLevel: RISK_LEVELS.MEDIUM
          });
          
          res.status(429).json({
            error: 'Rate limit exceeded',
            retryAfter: '15 minutes'
          });
        }
      }),

      // Demo form specific rate limiting
      demoForm: rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 3, // 3 submissions per window
        message: {
          error: 'Too many demo requests from this IP',
          retryAfter: '10 minutes'
        },
        keyGenerator: (req) => {
          return req.ip + ':demo-form';
        },
        handler: (req, res) => {
          securityLogger.logSecurityEvent(SECURITY_EVENTS.DEMO_FORM_RATE_LIMITED, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            riskLevel: RISK_LEVELS.HIGH
          });
          
          res.status(429).json({
            error: 'Demo form rate limit exceeded',
            retryAfter: '10 minutes'
          });
        }
      }),

      // Login rate limiting
      login: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // 5 login attempts per window
        skipSuccessfulRequests: true,
        handler: (req, res) => {
          securityLogger.logSecurityEvent(SECURITY_EVENTS.LOGIN_RATE_LIMITED, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            riskLevel: RISK_LEVELS.HIGH
          });
          
          res.status(429).json({
            error: 'Too many login attempts',
            retryAfter: '15 minutes'
          });
        }
      })
    };
  }

  /**
   * XSS Protection Middleware
   */
  xssProtection() {
    return (req, res, next) => {
      // Check request body for XSS
      if (req.body) {
        const bodyStr = JSON.stringify(req.body);
        if (this.detectXSS(bodyStr)) {
          securityLogger.logSecurityEvent(SECURITY_EVENTS.XSS_ATTACK_DETECTED, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            payload: bodyStr.substring(0, 200),
            riskLevel: RISK_LEVELS.HIGH
          });
          
          return res.status(400).json({
            error: 'Malicious content detected',
            code: 'XSS_DETECTED'
          });
        }
      }

      // Check query parameters for XSS
      const queryStr = JSON.stringify(req.query);
      if (this.detectXSS(queryStr)) {
        securityLogger.logSecurityEvent(SECURITY_EVENTS.XSS_ATTACK_DETECTED, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          payload: queryStr,
          riskLevel: RISK_LEVELS.HIGH
        });
        
        return res.status(400).json({
          error: 'Malicious query parameters detected',
          code: 'XSS_DETECTED'
        });
      }

      next();
    };
  }

  /**
   * SQL Injection Protection Middleware
   */
  sqlInjectionProtection() {
    return (req, res, next) => {
      const checkData = (data) => {
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
        return this.detectSQLInjection(dataStr);
      };

      // Check request body
      if (req.body && checkData(req.body)) {
        securityLogger.logSecurityEvent(SECURITY_EVENTS.SQL_INJECTION_DETECTED, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          payload: JSON.stringify(req.body).substring(0, 200),
          riskLevel: RISK_LEVELS.CRITICAL
        });
        
        return res.status(400).json({
          error: 'SQL injection attempt detected',
          code: 'SQL_INJECTION_DETECTED'
        });
      }

      // Check query parameters
      if (checkData(req.query)) {
        securityLogger.logSecurityEvent(SECURITY_EVENTS.SQL_INJECTION_DETECTED, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          payload: JSON.stringify(req.query),
          riskLevel: RISK_LEVELS.CRITICAL
        });
        
        return res.status(400).json({
          error: 'SQL injection in query parameters detected',
          code: 'SQL_INJECTION_DETECTED'
        });
      }

      next();
    };
  }

  /**
   * IP Blocking Middleware
   */
  ipBlocking() {
    return (req, res, next) => {
      const clientIP = req.ip;

      // Check if IP is blocked
      if (this.blockedIPs.has(clientIP)) {
        securityLogger.logSecurityEvent(SECURITY_EVENTS.BLOCKED_IP_ACCESS, {
          ip: clientIP,
          userAgent: req.get('User-Agent'),
          riskLevel: RISK_LEVELS.HIGH
        });
        
        return res.status(403).json({
          error: 'Access denied',
          code: 'IP_BLOCKED'
        });
      }

      // Track suspicious activity
      this.trackSuspiciousActivity(clientIP, req);

      next();
    };
  }

  /**
   * Bot Protection Middleware
   */
  botProtection() {
    return (req, res, next) => {
      const userAgent = req.get('User-Agent') || '';
      
      // Known malicious bots
      const maliciousBots = [
        'sqlmap', 'nikto', 'nmap', 'masscan', 'zap', 'w3af',
        'havij', 'pangolin', 'jsql', 'commix'
      ];

      // Check for malicious bots
      const isMaliciousBot = maliciousBots.some(bot => 
        userAgent.toLowerCase().includes(bot)
      );

      if (isMaliciousBot) {
        securityLogger.logSecurityEvent(SECURITY_EVENTS.MALICIOUS_BOT_DETECTED, {
          ip: req.ip,
          userAgent: userAgent,
          riskLevel: RISK_LEVELS.HIGH
        });
        
        // Block the IP
        this.blockedIPs.add(req.ip);
        
        return res.status(403).json({
          error: 'Malicious bot detected',
          code: 'BOT_BLOCKED'
        });
      }

      // Check for suspicious patterns in User-Agent
      if (userAgent.length > 1000 || userAgent.includes('<script>')) {
        securityLogger.logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_USER_AGENT, {
          ip: req.ip,
          userAgent: userAgent.substring(0, 200),
          riskLevel: RISK_LEVELS.MEDIUM
        });
        
        return res.status(400).json({
          error: 'Invalid user agent',
          code: 'INVALID_USER_AGENT'
        });
      }

      next();
    };
  }

  /**
   * CORS Protection
   */
  corsProtection() {
    return cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        // Allowed origins for SentraBASE
        const allowedOrigins = [
          'https://sentrabase.id',
          'https://www.sentrabase.id',
          'http://localhost:5173', // Development
          'http://localhost:3000'  // Development
        ];

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          securityLogger.logSecurityEvent(SECURITY_EVENTS.CORS_VIOLATION, {
            origin: origin,
            riskLevel: RISK_LEVELS.MEDIUM
          });
          
          callback(new Error('CORS policy violation'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
    });
  }

  /**
   * Detect XSS patterns
   */
  detectXSS(input) {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Detect SQL Injection patterns
   */
  detectSQLInjection(input) {
    const sqlPatterns = [
      /(\b(select|insert|update|delete|drop|create|alter|exec|union)\b)/gi,
      /(\b(or|and)\b\s+\b\d+\b\s*=\s*\b\d+\b)/gi,
      /(union\s+select)/gi,
      /(drop\s+table)/gi,
      /('|(\\')|(;)|(\\;))/gi,
      /(exec\s+xp_)/gi
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Track suspicious activity
   */
  trackSuspiciousActivity(ip, req) {
    if (!this.suspiciousIPs.has(ip)) {
      this.suspiciousIPs.set(ip, {
        requests: 0,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        violations: []
      });
    }

    const activity = this.suspiciousIPs.get(ip);
    activity.requests++;
    activity.lastSeen = Date.now();

    // Check for rapid requests (potential DDoS)
    const timeWindow = 60 * 1000; // 1 minute
    const requestThreshold = 100;
    
    if (activity.requests > requestThreshold && 
        (activity.lastSeen - activity.firstSeen) < timeWindow) {
      
      securityLogger.logSecurityEvent(SECURITY_EVENTS.DDOS_ATTEMPT_DETECTED, {
        ip: ip,
        requests: activity.requests,
        timeWindow: timeWindow,
        riskLevel: RISK_LEVELS.CRITICAL
      });
      
      // Block the IP
      this.blockedIPs.add(ip);
    }
  }

  /**
   * Get complete middleware stack
   */
  getMiddlewareStack() {
    const rateLimits = this.rateLimiting();
    
    return {
      // Security headers (apply to all routes)
      securityHeaders: this.securityHeaders(),
      
      // CORS protection
      cors: this.corsProtection(),
      
      // Compression
      compression: compression(),
      
      // IP blocking
      ipBlocking: this.ipBlocking(),
      
      // Bot protection
      botProtection: this.botProtection(),
      
      // XSS protection
      xssProtection: this.xssProtection(),
      
      // SQL injection protection
      sqlInjectionProtection: this.sqlInjectionProtection(),
      
      // Rate limiting
      rateLimiting: {
        api: rateLimits.api,
        demoForm: rateLimits.demoForm,
        login: rateLimits.login
      },
      
      // HTTP Parameter Pollution protection
      hpp: hpp(),
      
      // Request size limiting
      requestSizeLimit: (req, res, next) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (req.headers['content-length'] > maxSize) {
          return res.status(413).json({
            error: 'Request too large',
            maxSize: '10MB'
          });
        }
        next();
      }
    };
  }
}

// Create singleton instance
const freeWAF = new FreeWAF();

export default freeWAF;
export { FreeWAF };
