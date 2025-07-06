import React, { createContext, useContext, useState, useEffect } from 'react';
import { secureStorage, dataProtection, securityLogger } from '../../utils/security';
import { SECURITY_EVENTS, RISK_LEVELS } from '../../config/security';

// Authentication Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// User roles for RBAC
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer',
  DEMO_USER: 'demo_user'
};

// Permissions mapping
export const PERMISSIONS = {
  'demo:create': [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.DEMO_USER],
  'demo:view': [USER_ROLES.ADMIN, USER_ROLES.USER, USER_ROLES.VIEWER, USER_ROLES.DEMO_USER],
  'admin:access': [USER_ROLES.ADMIN],
  'user:manage': [USER_ROLES.ADMIN],
  'system:configure': [USER_ROLES.ADMIN]
};

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check for existing session
      const savedSession = secureStorage.get('auth_session');
      const savedUser = secureStorage.get('auth_user');
      
      if (savedSession && savedUser) {
        // Validate session
        const isValidSession = await validateSession(savedSession);
        if (isValidSession) {
          setUser(savedUser);
          setIsAuthenticated(true);
          setSessionId(savedSession.sessionId);
          
          securityLogger.logSecurityEvent(SECURITY_EVENTS.SESSION_RESTORED, {
            userId: savedUser.id,
            sessionId: savedSession.sessionId,
            timestamp: Date.now()
          });
        } else {
          // Invalid session, clear storage
          await logout();
        }
      } else {
        // No existing session, create demo user for demo functionality
        await createDemoUser();
      }
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.AUTH_INITIALIZATION_FAILED, {
        error: error.message,
        riskLevel: RISK_LEVELS.MEDIUM
      });
      
      // Fallback to demo user
      await createDemoUser();
    } finally {
      setIsLoading(false);
    }
  };

  const createDemoUser = async () => {
    const demoUser = {
      id: 'demo_user',
      email: 'demo@sentrabase.id',
      name: 'Demo User',
      role: USER_ROLES.DEMO_USER,
      permissions: PERMISSIONS['demo:create'].concat(PERMISSIONS['demo:view']),
      createdAt: Date.now(),
      sessionType: 'demo'
    };

    const demoSession = {
      sessionId: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: demoUser.id,
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 60 * 1000), // 30 minutes
      type: 'demo'
    };

    // Store demo session
    secureStorage.set('auth_session', demoSession, 30);
    secureStorage.set('auth_user', demoUser, 30);

    setUser(demoUser);
    setIsAuthenticated(true);
    setSessionId(demoSession.sessionId);

    securityLogger.logSecurityEvent(SECURITY_EVENTS.DEMO_SESSION_CREATED, {
      sessionId: demoSession.sessionId,
      timestamp: Date.now()
    });
  };

  const validateSession = async (session) => {
    try {
      // Check session expiration
      if (Date.now() > session.expiresAt) {
        securityLogger.logSecurityEvent(SECURITY_EVENTS.SESSION_EXPIRED, {
          sessionId: session.sessionId,
          expiredAt: session.expiresAt
        });
        return false;
      }

      // Additional session validation can be added here
      // For now, we'll consider non-expired sessions as valid
      return true;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.SESSION_VALIDATION_FAILED, {
        sessionId: session?.sessionId,
        error: error.message
      });
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.LOGIN_ATTEMPT, {
        email: credentials.email,
        timestamp: Date.now()
      });

      // Simulate authentication (replace with real API call)
      const authResult = await authenticateUser(credentials);
      
      if (authResult.success) {
        const newSession = {
          sessionId: `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: authResult.user.id,
          createdAt: Date.now(),
          expiresAt: Date.now() + (8 * 60 * 60 * 1000), // 8 hours
          type: 'authenticated'
        };

        // Store authenticated session
        secureStorage.set('auth_session', newSession, 480); // 8 hours
        secureStorage.set('auth_user', authResult.user, 480);

        setUser(authResult.user);
        setIsAuthenticated(true);
        setSessionId(newSession.sessionId);

        securityLogger.logSecurityEvent(SECURITY_EVENTS.LOGIN_SUCCESS, {
          userId: authResult.user.id,
          sessionId: newSession.sessionId,
          timestamp: Date.now()
        });

        return { success: true, user: authResult.user };
      } else {
        securityLogger.logSecurityEvent(SECURITY_EVENTS.LOGIN_FAILED, {
          email: credentials.email,
          reason: authResult.error,
          timestamp: Date.now(),
          riskLevel: RISK_LEVELS.MEDIUM
        });

        return { success: false, error: authResult.error };
      }
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.LOGIN_ERROR, {
        email: credentials.email,
        error: error.message,
        timestamp: Date.now(),
        riskLevel: RISK_LEVELS.HIGH
      });

      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.LOGOUT_INITIATED, {
        userId: user?.id,
        sessionId: sessionId,
        timestamp: Date.now()
      });

      // Clear secure storage
      secureStorage.remove('auth_session');
      secureStorage.remove('auth_user');

      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      setSessionId(null);

      // Create new demo user for continued demo functionality
      await createDemoUser();

      securityLogger.logSecurityEvent(SECURITY_EVENTS.LOGOUT_SUCCESS, {
        timestamp: Date.now()
      });
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.LOGOUT_ERROR, {
        error: error.message,
        timestamp: Date.now()
      });
    }
  };

  const authenticateUser = async (credentials) => {
    // Simulate API authentication
    // In production, this would be a real API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Demo authentication logic
        if (credentials.email === 'admin@sentrabase.id' && credentials.password === 'admin123') {
          resolve({
            success: true,
            user: {
              id: 'admin_001',
              email: 'admin@sentrabase.id',
              name: 'Admin User',
              role: USER_ROLES.ADMIN,
              permissions: Object.values(PERMISSIONS).flat(),
              createdAt: Date.now()
            }
          });
        } else if (credentials.email === 'user@sentrabase.id' && credentials.password === 'user123') {
          resolve({
            success: true,
            user: {
              id: 'user_001',
              email: 'user@sentrabase.id',
              name: 'Regular User',
              role: USER_ROLES.USER,
              permissions: PERMISSIONS['demo:create'].concat(PERMISSIONS['demo:view']),
              createdAt: Date.now()
            }
          });
        } else {
          resolve({
            success: false,
            error: 'Invalid email or password'
          });
        }
      }, 1000); // Simulate network delay
    });
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission) || PERMISSIONS[permission]?.includes(user.role);
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const refreshSession = async () => {
    try {
      const currentSession = secureStorage.get('auth_session');
      if (currentSession) {
        const newExpirationTime = Date.now() + (30 * 60 * 1000); // Extend by 30 minutes
        const updatedSession = {
          ...currentSession,
          expiresAt: newExpirationTime,
          lastRefresh: Date.now()
        };

        secureStorage.set('auth_session', updatedSession, 30);

        securityLogger.logSecurityEvent(SECURITY_EVENTS.SESSION_REFRESHED, {
          sessionId: currentSession.sessionId,
          newExpiration: newExpirationTime,
          timestamp: Date.now()
        });

        return true;
      }
      return false;
    } catch (error) {
      securityLogger.logSecurityEvent(SECURITY_EVENTS.SESSION_REFRESH_FAILED, {
        error: error.message,
        timestamp: Date.now()
      });
      return false;
    }
  };

  // Auto-refresh session before expiration
  useEffect(() => {
    if (isAuthenticated && sessionId) {
      const refreshInterval = setInterval(() => {
        refreshSession();
      }, 25 * 60 * 1000); // Refresh every 25 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated, sessionId]);

  const authContextValue = {
    // State
    user,
    isAuthenticated,
    isLoading,
    sessionId,
    
    // Actions
    login,
    logout,
    refreshSession,
    
    // Authorization
    hasPermission,
    hasRole,
    
    // User info
    getUserRole: () => user?.role,
    getUserId: () => user?.id,
    getUserName: () => user?.name,
    getSessionType: () => user?.sessionType || 'authenticated',
    
    // Session info
    getSessionId: () => sessionId,
    isDemo: () => user?.sessionType === 'demo',
    isAdmin: () => hasRole(USER_ROLES.ADMIN)
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// HOC for components that require authentication
export const withAuth = (WrappedComponent, requiredPermission = null) => {
  return function AuthWrappedComponent(props) {
    const auth = useAuth();
    
    if (auth.isLoading) {
      return <div className="flex items-center justify-center p-8">Loading...</div>;
    }
    
    if (requiredPermission && !auth.hasPermission(requiredPermission)) {
      return <div className="flex items-center justify-center p-8 text-red-600">Access Denied</div>;
    }
    
    return <WrappedComponent {...props} auth={auth} />;
  };
};

// Route protection component
export const ProtectedRoute = ({ children, requiredPermission, fallback = null }) => {
  const auth = useAuth();
  
  if (auth.isLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }
  
  if (requiredPermission && !auth.hasPermission(requiredPermission)) {
    return fallback || <div className="flex items-center justify-center p-8 text-red-600">Access Denied</div>;
  }
  
  return children;
};

export default AuthProvider;
