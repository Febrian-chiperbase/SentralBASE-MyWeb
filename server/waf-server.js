// 🆓 Free WAF Server Implementation for SentraBASE
// Express.js server with comprehensive free WAF protection

import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { body, query, validationResult } from 'express-validator';

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

/**
 * 🛡️ FREE WAF MIDDLEWARE STACK
 */

// 1. Security Headers (Helmet.js)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// 2. CORS Protection
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://sentrabase.id',
      'https://www.sentrabase.id',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`🚫 CORS blocked: ${origin}`);
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
}));

// 3. Compression
app.use(compression());

// 4. Request parsing with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    // Check for malicious JSON
    const body = buf.toString();
    if (body.includes('<script>') || body.includes('javascript:')) {
      throw new Error('Malicious content detected in JSON');
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
  parameterLimit: 100 // Limit number of parameters
}));

// 5. HTTP Parameter Pollution Protection
app.use(hpp({
  whitelist: ['tags', 'categories'] // Allow arrays for specific fields
}));

// 6. Request Logging
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 400 // Only log errors
}));

/**
 * 🚨 CUSTOM SECURITY MIDDLEWARE
 */

// IP Blocking System
const blockedIPs = new Set();
const suspiciousActivity = new Map();

// Malicious pattern detection
const securityPatterns = {
  xss: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /eval\s*\(/gi
  ],
  sqlInjection: [
    /(\b(select|insert|update|delete|drop|create|alter|exec|union)\b)/gi,
    /(union\s+select)/gi,
    /(drop\s+table)/gi,
    /('|(\\')|(;)|(\\;))/gi
  ],
  commandInjection: [
    /(\||;|&|`|\$\(|\${)/g,
    /(nc|netcat|wget|curl)\s/gi
  ],
  pathTraversal: [
    /\.\.\//g,
    /\.\.\\/g,
    /\/etc\/passwd/gi,
    /\/proc\/self/gi
  ]
};

// Security scanner middleware
const securityScanner = (req, res, next) => {
  const clientIP = req.ip;
  const userAgent = req.get('User-Agent') || '';
  const requestData = JSON.stringify({ 
    body: req.body, 
    query: req.query, 
    params: req.params 
  });

  // Check if IP is blocked
  if (blockedIPs.has(clientIP)) {
    console.log(`🚫 Blocked IP attempted access: ${clientIP}`);
    return res.status(403).json({ 
      error: 'Access denied',
      code: 'IP_BLOCKED'
    });
  }

  // Check for malicious bots
  const maliciousBots = ['sqlmap', 'nikto', 'nmap', 'masscan', 'zap', 'w3af'];
  if (maliciousBots.some(bot => userAgent.toLowerCase().includes(bot))) {
    console.log(`🤖 Malicious bot detected: ${userAgent}`);
    blockedIPs.add(clientIP);
    return res.status(403).json({ 
      error: 'Malicious bot detected',
      code: 'BOT_BLOCKED'
    });
  }

  // Scan for attack patterns
  for (const [attackType, patterns] of Object.entries(securityPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(requestData) || pattern.test(userAgent)) {
        console.log(`🚨 ${attackType.toUpperCase()} attack detected from ${clientIP}`);
        
        // Track suspicious activity
        if (!suspiciousActivity.has(clientIP)) {
          suspiciousActivity.set(clientIP, { count: 0, firstSeen: Date.now() });
        }
        
        const activity = suspiciousActivity.get(clientIP);
        activity.count++;
        
        // Block IP after 3 violations
        if (activity.count >= 3) {
          blockedIPs.add(clientIP);
          console.log(`🔒 IP blocked due to repeated violations: ${clientIP}`);
        }
        
        return res.status(400).json({ 
          error: `${attackType} attempt detected`,
          code: attackType.toUpperCase() + '_DETECTED'
        });
      }
    }
  }

  next();
};

// Apply security scanner to all routes
app.use(securityScanner);

/**
 * 📊 RATE LIMITING
 */

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    error: 'Too many requests from this IP',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`⚡ Rate limit exceeded: ${req.ip}`);
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: '15 minutes'
    });
  }
});

// Demo form rate limiting
const demoFormLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // 3 submissions per window
  keyGenerator: (req) => req.ip + ':demo-form',
  handler: (req, res) => {
    console.log(`📝 Demo form rate limit exceeded: ${req.ip}`);
    res.status(429).json({
      error: 'Demo form rate limit exceeded',
      retryAfter: '10 minutes'
    });
  }
});

// Login rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per window
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    console.log(`🔐 Login rate limit exceeded: ${req.ip}`);
    res.status(429).json({
      error: 'Too many login attempts',
      retryAfter: '15 minutes'
    });
  }
});

/**
 * 🛡️ INPUT VALIDATION
 */

// Demo form validation
const demoFormValidation = [
  body('fullName')
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Invalid name format'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Invalid email format'),
  
  body('phone')
    .matches(/^[\+]?[0-9\-\s()]{10,20}$/)
    .withMessage('Invalid phone format'),
  
  body('companyName')
    .isLength({ min: 2, max: 200 })
    .matches(/^[a-zA-Z0-9\s\.\-,]+$/)
    .withMessage('Invalid company name'),
  
  body('message')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Message too long')
];

/**
 * 🚀 API ROUTES
 */

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    waf: 'active',
    timestamp: new Date().toISOString()
  });
});

// Demo form submission with protection
app.post('/api/demo/schedule', 
  demoFormLimiter,
  demoFormValidation,
  (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(`❌ Validation failed: ${req.ip}`, errors.array());
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Simulate demo scheduling
    console.log(`📅 Demo scheduled from ${req.ip}:`, req.body);
    
    res.json({
      success: true,
      message: 'Demo scheduled successfully',
      id: `demo_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  }
);

// Login endpoint with protection
app.post('/api/auth/login',
  loginLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6, max: 128 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid credentials format',
        details: errors.array()
      });
    }

    // Simulate authentication
    const { email, password } = req.body;
    
    // Demo credentials
    if (email === 'admin@sentrabase.id' && password === 'admin123') {
      res.json({
        success: true,
        token: 'demo_token_' + Date.now(),
        user: { email, role: 'admin' }
      });
    } else {
      res.status(401).json({
        error: 'Invalid credentials'
      });
    }
  }
);

// Security status endpoint
app.get('/api/security/status', (req, res) => {
  res.json({
    waf: {
      status: 'active',
      blockedIPs: blockedIPs.size,
      suspiciousActivity: suspiciousActivity.size,
      features: [
        'XSS Protection',
        'SQL Injection Protection', 
        'Rate Limiting',
        'Bot Protection',
        'CORS Protection',
        'Security Headers'
      ]
    },
    timestamp: new Date().toISOString()
  });
});

// Apply general rate limiting to all API routes
app.use('/api/', apiLimiter);

/**
 * 🚫 ERROR HANDLING
 */

// 404 handler
app.use('*', (req, res) => {
  console.log(`❓ 404 - Not found: ${req.method} ${req.originalUrl} from ${req.ip}`);
  res.status(404).json({
    error: 'Endpoint not found',
    method: req.method,
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`💥 Error: ${err.message} from ${req.ip}`);
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
});

/**
 * 🚀 SERVER STARTUP
 */

app.listen(PORT, () => {
  console.log(`
🛡️  SentraBASE Free WAF Server Started
=====================================
🌐 Port: ${PORT}
🔒 Security: Active
📊 Rate Limiting: Enabled
🚫 IP Blocking: Active
🤖 Bot Protection: Enabled
⚡ Compression: Active
🛡️  Security Headers: Applied

🎯 Protected Endpoints:
- POST /api/demo/schedule (3 req/10min)
- POST /api/auth/login (5 req/15min)
- GET  /api/* (100 req/15min)

🔍 Monitoring:
- Blocked IPs: ${blockedIPs.size}
- Suspicious Activity: ${suspiciousActivity.size}

Ready to protect SentraBASE! 🚀
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 WAF Server shutting down gracefully...');
  process.exit(0);
});

export default app;
