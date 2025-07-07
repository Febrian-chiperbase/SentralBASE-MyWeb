import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error Boundary Caught:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
          <div className="bg-slate-800 rounded-lg p-8 max-w-2xl w-full">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h1>
              <p className="text-gray-400">
                We encountered an error while loading this component. Don't worry, we're here to help!
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Error Details:</h3>
                <pre className="text-sm text-gray-300 overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <details className="mt-4">
                    <summary className="text-sm text-gray-400 cursor-pointer">Stack Trace</summary>
                    <pre className="text-xs text-gray-500 mt-2 overflow-auto max-h-32">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-8 p-4 bg-slate-700/50 rounded-lg">
              <h4 className="font-medium text-white mb-2">💡 Quick Fixes:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Try refreshing the page</li>
                <li>• Clear your browser cache (Ctrl+Shift+Delete)</li>
                <li>• Check your internet connection</li>
                <li>• Try accessing from a different browser</li>
                <li>• Contact support if the problem persists</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
