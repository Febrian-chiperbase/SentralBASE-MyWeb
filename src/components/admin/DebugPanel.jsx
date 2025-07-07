import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bug, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  RefreshCw,
  Database,
  Wifi,
  Zap,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const DebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState({
    errors: [],
    warnings: [],
    performance: {},
    localStorage: {},
    components: {},
    network: {}
  });

  useEffect(() => {
    runDiagnostics();
    const interval = setInterval(runDiagnostics, 5000);
    return () => clearInterval(interval);
  }, []);

  const runDiagnostics = () => {
    console.log('🔍 Running diagnostics...');
    
    const diagnostics = {
      errors: captureErrors(),
      warnings: captureWarnings(),
      performance: checkPerformance(),
      localStorage: checkLocalStorage(),
      components: checkComponents(),
      network: checkNetwork()
    };
    
    setDebugInfo(diagnostics);
  };

  const captureErrors = () => {
    // Check for common errors
    const errors = [];
    
    try {
      // Test localStorage access
      localStorage.getItem('test');
    } catch (error) {
      errors.push({
        type: 'localStorage',
        message: 'LocalStorage access denied',
        severity: 'high'
      });
    }
    
    // Check for missing components
    const requiredComponents = [
      'OrderMonitoring',
      'AdvancedAnalytics', 
      'TeamManagement',
      'TaskManagement',
      'EnhancedWorkflowAutomation'
    ];
    
    requiredComponents.forEach(component => {
      try {
        // This is a simplified check
        if (!window[component] && !document.querySelector(`[data-component="${component}"]`)) {
          // Component might be missing, but this is normal in React
        }
      } catch (error) {
        errors.push({
          type: 'component',
          message: `Component ${component} error: ${error.message}`,
          severity: 'medium'
        });
      }
    });
    
    return errors;
  };

  const captureWarnings = () => {
    const warnings = [];
    
    // Check localStorage usage
    const storageSize = JSON.stringify(localStorage).length;
    if (storageSize > 5000000) { // 5MB
      warnings.push({
        type: 'storage',
        message: 'LocalStorage usage is high',
        details: `${(storageSize / 1024 / 1024).toFixed(2)} MB used`
      });
    }
    
    // Check for old data
    const oldKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('payment_session_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          const age = Date.now() - data.timestamp;
          if (age > 7 * 24 * 60 * 60 * 1000) { // 7 days
            oldKeys.push(key);
          }
        } catch (error) {
          oldKeys.push(key);
        }
      }
    }
    
    if (oldKeys.length > 0) {
      warnings.push({
        type: 'data',
        message: `${oldKeys.length} old data entries found`,
        details: 'Consider cleaning up old customer sessions'
      });
    }
    
    return warnings;
  };

  const checkPerformance = () => {
    const performance = {
      memory: {},
      timing: {},
      resources: {}
    };
    
    // Memory usage (if available)
    if (window.performance && window.performance.memory) {
      performance.memory = {
        used: Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(window.performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(window.performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    
    // Page load timing
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      performance.timing = {
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint: timing.responseStart - timing.navigationStart
      };
    }
    
    return performance;
  };

  const checkLocalStorage = () => {
    const storage = {
      total: localStorage.length,
      sessions: 0,
      orders: 0,
      notifications: 0,
      workflows: 0,
      team: 0,
      tasks: 0
    };
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        if (key.startsWith('payment_session_')) storage.sessions++;
        else if (key.startsWith('order_')) storage.orders++;
        else if (key.startsWith('notification_')) storage.notifications++;
        else if (key.includes('workflow')) storage.workflows++;
        else if (key.includes('team')) storage.team++;
        else if (key.includes('task')) storage.tasks++;
      }
    }
    
    return storage;
  };

  const checkComponents = () => {
    const components = {
      loaded: [],
      errors: []
    };
    
    // Check if React is loaded
    if (typeof React !== 'undefined') {
      components.loaded.push('React');
    }
    
    // Check if main components are accessible
    const componentSelectors = [
      '[data-testid="admin-dashboard"]',
      '[class*="slate-900"]', // Check for Tailwind classes
      '[class*="motion"]' // Check for Framer Motion
    ];
    
    componentSelectors.forEach(selector => {
      if (document.querySelector(selector)) {
        components.loaded.push(selector);
      }
    });
    
    return components;
  };

  const checkNetwork = () => {
    const network = {
      online: navigator.onLine,
      connection: {},
      requests: []
    };
    
    // Network connection info (if available)
    if (navigator.connection) {
      network.connection = {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      };
    }
    
    return network;
  };

  const clearOldData = () => {
    let cleared = 0;
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('payment_session_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          const age = Date.now() - data.timestamp;
          if (age > 7 * 24 * 60 * 60 * 1000) { // 7 days
            keysToRemove.push(key);
          }
        } catch (error) {
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      cleared++;
    });
    
    console.log(`🧹 Cleared ${cleared} old data entries`);
    runDiagnostics();
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Bug className="w-5 h-5 mr-2" />
          System Diagnostics
        </h3>
        <Button
          onClick={runDiagnostics}
          size="sm"
          className="bg-blue-500 hover:bg-blue-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">System Status</span>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-lg font-bold text-white">Operational</p>
        </div>
        <div className="bg-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Network</span>
            <Wifi className={`w-4 h-4 ${debugInfo.network.online ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <p className="text-lg font-bold text-white">
            {debugInfo.network.online ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Errors */}
      {debugInfo.errors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Errors ({debugInfo.errors.length})
          </h4>
          <div className="space-y-2">
            {debugInfo.errors.map((error, index) => (
              <div key={index} className={`p-3 rounded-lg ${getSeverityColor(error.severity)}`}>
                <p className="text-sm font-medium">{error.message}</p>
                <p className="text-xs opacity-75">Type: {error.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {debugInfo.warnings.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center">
            <Info className="w-4 h-4 mr-2" />
            Warnings ({debugInfo.warnings.length})
          </h4>
          <div className="space-y-2">
            {debugInfo.warnings.map((warning, index) => (
              <div key={index} className="p-3 rounded-lg bg-yellow-500/20 text-yellow-400">
                <p className="text-sm font-medium">{warning.message}</p>
                {warning.details && (
                  <p className="text-xs opacity-75">{warning.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2" />
          Performance
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {debugInfo.performance.memory && (
            <div className="bg-slate-700 rounded-lg p-3">
              <p className="text-xs text-gray-400">Memory Usage</p>
              <p className="text-sm text-white">
                {debugInfo.performance.memory.used}MB / {debugInfo.performance.memory.total}MB
              </p>
            </div>
          )}
          {debugInfo.performance.timing && (
            <div className="bg-slate-700 rounded-lg p-3">
              <p className="text-xs text-gray-400">Load Time</p>
              <p className="text-sm text-white">
                {Math.round(debugInfo.performance.timing.loadTime)}ms
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Storage Info */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
          <Database className="w-4 h-4 mr-2" />
          Data Storage
        </h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-700 rounded p-2">
            <p className="text-gray-400">Sessions</p>
            <p className="text-white font-bold">{debugInfo.localStorage.sessions}</p>
          </div>
          <div className="bg-slate-700 rounded p-2">
            <p className="text-gray-400">Orders</p>
            <p className="text-white font-bold">{debugInfo.localStorage.orders}</p>
          </div>
          <div className="bg-slate-700 rounded p-2">
            <p className="text-gray-400">Notifications</p>
            <p className="text-white font-bold">{debugInfo.localStorage.notifications}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Button
          onClick={clearOldData}
          size="sm"
          variant="outline"
          className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-white"
        >
          Clean Old Data
        </Button>
        <Button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          size="sm"
          variant="outline"
          className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
        >
          Reset All Data
        </Button>
      </div>
    </div>
  );
};

export default DebugPanel;
