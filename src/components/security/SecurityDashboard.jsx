import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  Lock,
  Eye,
  RefreshCw,
  Download,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSecurity } from './SecurityProvider';
import { useAuth } from '../auth/AuthProvider';
import { performSecurityScan, getScanResults, exportScanResults } from '../../utils/securityScanner';

const SecurityDashboard = () => {
  const security = useSecurity();
  const auth = useAuth();
  const [scanResults, setScanResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(null);

  useEffect(() => {
    // Load previous scan results if available
    const savedResults = getScanResults();
    if (savedResults.lastScanTime) {
      setScanResults(savedResults);
      setLastScanTime(savedResults.lastScanTime);
    }
  }, []);

  const handleSecurityScan = async () => {
    setIsScanning(true);
    try {
      const results = await performSecurityScan();
      setScanResults(results);
      setLastScanTime(results.scanTime);
      
      security.logSecurityEvent('SECURITY_DASHBOARD_SCAN_COMPLETED', {
        complianceScore: results.complianceScore,
        userId: auth.getUserId()
      });
    } catch (error) {
      console.error('Security scan failed:', error);
      security.logSecurityEvent('SECURITY_DASHBOARD_SCAN_FAILED', {
        error: error.message,
        userId: auth.getUserId()
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleExportResults = () => {
    if (!scanResults) return;
    
    const exportData = exportScanResults('json');
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-scan-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    security.logSecurityEvent('SECURITY_REPORT_EXPORTED', {
      userId: auth.getUserId(),
      timestamp: Date.now()
    });
  };

  const getComplianceColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceStatus = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const SecurityMetric = ({ icon: Icon, title, value, status, description }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-6 shadow-lg border border-gray-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon className={`w-6 h-6 ${status === 'good' ? 'text-green-500' : status === 'warning' ? 'text-yellow-500' : 'text-red-500'}`} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );

  const SecurityAlert = ({ severity, title, description, count }) => {
    const severityColors = {
      CRITICAL: 'bg-red-50 border-red-200 text-red-800',
      HIGH: 'bg-orange-50 border-orange-200 text-orange-800',
      MEDIUM: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      LOW: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    const severityIcons = {
      CRITICAL: XCircle,
      HIGH: AlertTriangle,
      MEDIUM: AlertTriangle,
      LOW: CheckCircle
    };

    const Icon = severityIcons[severity];

    return (
      <div className={`p-4 rounded-lg border ${severityColors[severity]} mb-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5" />
            <span className="font-medium">{title}</span>
          </div>
          <span className="text-sm font-bold">{count}</span>
        </div>
        <p className="text-sm mt-1">{description}</p>
      </div>
    );
  };

  if (!auth.hasPermission('admin:access') && !auth.isDemo()) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">You don't have permission to view the security dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="w-8 h-8 text-cyan-500 mr-3" />
            Security Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Monitor and manage security compliance</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={handleSecurityScan}
            disabled={isScanning}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Run Security Scan'}</span>
          </Button>
          {scanResults && (
            <Button
              variant="outline"
              onClick={handleExportResults}
              className="flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </Button>
          )}
        </div>
      </div>

      {/* Security Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SecurityMetric
          icon={Shield}
          title="Security Status"
          value={security.isSecurityInitialized ? 'Active' : 'Inactive'}
          status={security.isSecurityInitialized ? 'good' : 'error'}
          description="Overall security system status"
        />
        <SecurityMetric
          icon={Lock}
          title="CSRF Protection"
          value={security.getCSRFToken() ? 'Enabled' : 'Disabled'}
          status={security.getCSRFToken() ? 'good' : 'error'}
          description="Cross-site request forgery protection"
        />
        <SecurityMetric
          icon={Activity}
          title="Rate Limiting"
          value={security.isRateLimited() ? 'Limited' : 'Active'}
          status={security.isRateLimited() ? 'warning' : 'good'}
          description="Request rate limiting status"
        />
        <SecurityMetric
          icon={Eye}
          title="Session Type"
          value={auth.getSessionType()}
          status={auth.isDemo() ? 'warning' : 'good'}
          description="Current authentication session"
        />
      </div>

      {/* Compliance Score */}
      {scanResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">OWASP Compliance Score</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Last scan: {new Date(lastScanTime).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getComplianceColor(scanResults.complianceScore)}`}>
                {scanResults.complianceScore}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {getComplianceStatus(scanResults.complianceScore)}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    scanResults.complianceScore >= 90 ? 'bg-green-500' :
                    scanResults.complianceScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${scanResults.complianceScore}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{scanResults.summary.passedChecks}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{scanResults.summary.failedChecks}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{scanResults.summary.criticalIssues}</div>
              <div className="text-sm text-gray-600">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{scanResults.summary.highIssues}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Security Alerts */}
      {scanResults && scanResults.summary.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-lg border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Recommendations</h2>
          
          {scanResults.summary.recommendations.map((rec, index) => (
            <SecurityAlert
              key={index}
              severity={rec.priority}
              title={rec.title}
              description={rec.description}
              count={rec.issues.length}
            />
          ))}
        </motion.div>
      )}

      {/* Detailed Results */}
      {scanResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-lg border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Security Checks</h2>
          
          <div className="space-y-3">
            {scanResults.results.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  result.status === 'PASS' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {result.status === 'PASS' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{result.name}</div>
                    <div className="text-sm text-gray-600">{result.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    result.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    result.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    result.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {result.severity}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    result.status === 'PASS' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {result.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Initial State */}
      {!scanResults && !isScanning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-12 shadow-lg border border-gray-200 text-center"
        >
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Security Scan Not Available</h2>
          <p className="text-gray-600 mb-6">
            Run a comprehensive security scan to assess your application's security posture against OWASP Top 10 vulnerabilities.
          </p>
          <Button onClick={handleSecurityScan} className="flex items-center space-x-2 mx-auto">
            <RefreshCw className="w-4 h-4" />
            <span>Run First Security Scan</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default SecurityDashboard;
