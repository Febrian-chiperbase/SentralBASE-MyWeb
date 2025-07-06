// 🧪 WAF Security Testing Script
// Comprehensive testing for free WAF implementation

import http from 'http';
import https from 'https';

const WAF_SERVER = 'http://localhost:3001';
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

class WAFTester {
  constructor() {
    this.testResults = [];
    this.passedTests = 0;
    this.failedTests = 0;
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async makeRequest(method, path, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
      const url = new URL(WAF_SERVER + path);
      const options = {
        method,
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'WAF-Tester/1.0',
          ...headers
        }
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        });
      });

      req.on('error', reject);

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  async runTest(testName, testFunction) {
    try {
      this.log(`\n🧪 Testing: ${testName}`, 'blue');
      const result = await testFunction();
      
      if (result.passed) {
        this.log(`✅ PASSED: ${testName}`, 'green');
        this.passedTests++;
      } else {
        this.log(`❌ FAILED: ${testName} - ${result.reason}`, 'red');
        this.failedTests++;
      }
      
      this.testResults.push({
        name: testName,
        passed: result.passed,
        reason: result.reason,
        details: result.details
      });
    } catch (error) {
      this.log(`💥 ERROR: ${testName} - ${error.message}`, 'red');
      this.failedTests++;
      this.testResults.push({
        name: testName,
        passed: false,
        reason: error.message,
        details: null
      });
    }
  }

  // Test 1: Basic Health Check
  async testHealthCheck() {
    const response = await this.makeRequest('GET', '/health');
    return {
      passed: response.statusCode === 200,
      reason: response.statusCode === 200 ? 'Health check passed' : `Expected 200, got ${response.statusCode}`,
      details: response.body
    };
  }

  // Test 2: XSS Protection
  async testXSSProtection() {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src="x" onerror="alert(1)">',
      '<iframe src="javascript:alert(1)"></iframe>'
    ];

    for (const payload of xssPayloads) {
      const response = await this.makeRequest('POST', '/api/demo/schedule', {
        fullName: payload,
        email: 'test@example.com',
        phone: '1234567890',
        companyName: 'Test Company'
      });

      if (response.statusCode !== 400) {
        return {
          passed: false,
          reason: `XSS payload not blocked: ${payload}`,
          details: response.body
        };
      }
    }

    return {
      passed: true,
      reason: 'All XSS payloads blocked successfully',
      details: `Tested ${xssPayloads.length} XSS payloads`
    };
  }

  // Test 3: SQL Injection Protection
  async testSQLInjectionProtection() {
    const sqlPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' UNION SELECT * FROM users --",
      "admin'--",
      "' OR 1=1 --"
    ];

    for (const payload of sqlPayloads) {
      const response = await this.makeRequest('POST', '/api/demo/schedule', {
        fullName: 'Test User',
        email: payload,
        phone: '1234567890',
        companyName: 'Test Company'
      });

      if (response.statusCode !== 400) {
        return {
          passed: false,
          reason: `SQL injection payload not blocked: ${payload}`,
          details: response.body
        };
      }
    }

    return {
      passed: true,
      reason: 'All SQL injection payloads blocked successfully',
      details: `Tested ${sqlPayloads.length} SQL injection payloads`
    };
  }

  // Test 4: Rate Limiting
  async testRateLimiting() {
    const requests = [];
    
    // Make 5 rapid requests to demo form (limit is 3)
    for (let i = 0; i < 5; i++) {
      requests.push(
        this.makeRequest('POST', '/api/demo/schedule', {
          fullName: `Test User ${i}`,
          email: `test${i}@example.com`,
          phone: '1234567890',
          companyName: 'Test Company'
        })
      );
    }

    const responses = await Promise.all(requests);
    const rateLimitedResponses = responses.filter(r => r.statusCode === 429);

    return {
      passed: rateLimitedResponses.length >= 2, // At least 2 should be rate limited
      reason: rateLimitedResponses.length >= 2 
        ? `Rate limiting working: ${rateLimitedResponses.length} requests blocked`
        : `Rate limiting failed: only ${rateLimitedResponses.length} requests blocked`,
      details: responses.map(r => r.statusCode)
    };
  }

  // Test 5: Malicious Bot Detection
  async testBotProtection() {
    const maliciousBots = [
      'sqlmap/1.0',
      'nikto/2.1.6',
      'nmap/7.80',
      'masscan/1.0'
    ];

    for (const botUA of maliciousBots) {
      const response = await this.makeRequest('GET', '/health', null, {
        'User-Agent': botUA
      });

      if (response.statusCode !== 403) {
        return {
          passed: false,
          reason: `Malicious bot not blocked: ${botUA}`,
          details: response.body
        };
      }
    }

    return {
      passed: true,
      reason: 'All malicious bots blocked successfully',
      details: `Tested ${maliciousBots.length} malicious bot user agents`
    };
  }

  // Test 6: Security Headers
  async testSecurityHeaders() {
    const response = await this.makeRequest('GET', '/health');
    const headers = response.headers;
    
    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection',
      'strict-transport-security'
    ];

    const missingHeaders = requiredHeaders.filter(header => !headers[header]);

    return {
      passed: missingHeaders.length === 0,
      reason: missingHeaders.length === 0 
        ? 'All security headers present'
        : `Missing headers: ${missingHeaders.join(', ')}`,
      details: Object.keys(headers).filter(h => h.startsWith('x-') || h.includes('security'))
    };
  }

  // Test 7: Input Validation
  async testInputValidation() {
    const invalidInputs = [
      { fullName: '', email: 'test@example.com', phone: '1234567890', companyName: 'Test' },
      { fullName: 'Test', email: 'invalid-email', phone: '1234567890', companyName: 'Test' },
      { fullName: 'Test', email: 'test@example.com', phone: 'invalid-phone', companyName: 'Test' },
      { fullName: 'A'.repeat(101), email: 'test@example.com', phone: '1234567890', companyName: 'Test' }
    ];

    for (const input of invalidInputs) {
      const response = await this.makeRequest('POST', '/api/demo/schedule', input);
      
      if (response.statusCode !== 400) {
        return {
          passed: false,
          reason: `Invalid input not rejected: ${JSON.stringify(input)}`,
          details: response.body
        };
      }
    }

    return {
      passed: true,
      reason: 'All invalid inputs properly rejected',
      details: `Tested ${invalidInputs.length} invalid input combinations`
    };
  }

  // Test 8: CORS Protection
  async testCORSProtection() {
    const response = await this.makeRequest('OPTIONS', '/api/demo/schedule', null, {
      'Origin': 'https://malicious-site.com',
      'Access-Control-Request-Method': 'POST'
    });

    // Should either block or not include malicious origin in response
    const allowedOrigin = response.headers['access-control-allow-origin'];
    
    return {
      passed: !allowedOrigin || allowedOrigin !== 'https://malicious-site.com',
      reason: !allowedOrigin || allowedOrigin !== 'https://malicious-site.com'
        ? 'CORS properly configured'
        : 'CORS allows malicious origins',
      details: { allowedOrigin }
    };
  }

  // Run all tests
  async runAllTests() {
    this.log('🛡️  Starting WAF Security Tests', 'blue');
    this.log('================================', 'blue');

    await this.runTest('Health Check', () => this.testHealthCheck());
    await this.runTest('XSS Protection', () => this.testXSSProtection());
    await this.runTest('SQL Injection Protection', () => this.testSQLInjectionProtection());
    await this.runTest('Rate Limiting', () => this.testRateLimiting());
    await this.runTest('Bot Protection', () => this.testBotProtection());
    await this.runTest('Security Headers', () => this.testSecurityHeaders());
    await this.runTest('Input Validation', () => this.testInputValidation());
    await this.runTest('CORS Protection', () => this.testCORSProtection());

    this.printSummary();
  }

  printSummary() {
    this.log('\n📊 WAF Test Summary', 'blue');
    this.log('==================', 'blue');
    this.log(`✅ Passed: ${this.passedTests}`, 'green');
    this.log(`❌ Failed: ${this.failedTests}`, 'red');
    this.log(`📈 Success Rate: ${Math.round((this.passedTests / (this.passedTests + this.failedTests)) * 100)}%`, 'yellow');

    if (this.failedTests > 0) {
      this.log('\n🚨 Failed Tests:', 'red');
      this.testResults
        .filter(test => !test.passed)
        .forEach(test => {
          this.log(`  - ${test.name}: ${test.reason}`, 'red');
        });
    }

    this.log('\n🎯 Security Assessment:', 'blue');
    const securityScore = Math.round((this.passedTests / (this.passedTests + this.failedTests)) * 10);
    this.log(`Security Score: ${securityScore}/10`, securityScore >= 8 ? 'green' : securityScore >= 6 ? 'yellow' : 'red');
    
    if (securityScore >= 8) {
      this.log('🏆 WAF Security: EXCELLENT', 'green');
    } else if (securityScore >= 6) {
      this.log('⚠️  WAF Security: GOOD', 'yellow');
    } else {
      this.log('🚨 WAF Security: NEEDS IMPROVEMENT', 'red');
    }
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new WAFTester();
  
  // Wait a bit for server to be ready
  setTimeout(() => {
    tester.runAllTests().catch(console.error);
  }, 1000);
}

export default WAFTester;
