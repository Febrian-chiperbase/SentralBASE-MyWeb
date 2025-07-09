import React from 'react';
import { usePostPayment } from '@/contexts/PostPaymentContext';
import PostPaymentRegister from '@/components/auth/PostPaymentRegister';
import CustomerLogin from '@/components/auth/CustomerLogin';
import ModernDashboard from '@/components/dashboard/ModernDashboard';
import OrderDashboardWithPackage from '@/components/dashboard/OrderDashboardWithPackage';

const PostPaymentRouterFinal = () => {
  const { registrationStep, paymentData } = usePostPayment();

  // Handle different routes based on current step
  const getCurrentRoute = () => {
    const path = window.location.pathname;
    
    console.log('🧭 Router - Current path:', path);
    console.log('📊 Router - Payment data:', !!paymentData);
    console.log('📋 Router - Registration completed:', paymentData?.registrationCompleted);
    
    switch (path) {
      case '/login':
        return <CustomerLogin />;
        
      case '/register':
        if (!paymentData) {
          console.log('⚠️ No payment data, redirecting to home');
          window.location.href = '/';
          return null;
        }
        return <PostPaymentRegister />;
        
      case '/dashboard':
        // Enhanced dashboard protection with multiple checks
        const hasPaymentData = paymentData && (paymentData.registrationCompleted || paymentData.accountCreated);
        const hasSessionData = sessionStorage.getItem('sentrabase_session_data');
        const hasLocalData = localStorage.getItem('sentrabase_payment_data');
        
        console.log('🔍 Dashboard access check:', {
          hasPaymentData,
          hasSessionData: !!hasSessionData,
          hasLocalData: !!hasLocalData
        });
        
        if (!hasPaymentData && !hasSessionData && !hasLocalData) {
          console.log('❌ No authentication data, redirecting to login');
          window.location.href = '/login';
          return null;
        }
        
        // If we have local/session data but not in context, try to restore it
        if (!hasPaymentData && (hasSessionData || hasLocalData)) {
          console.log('🔄 Attempting to restore data from storage...');
          try {
            const storedData = JSON.parse(hasSessionData || hasLocalData);
            if (storedData && storedData.registrationCompleted) {
              console.log('✅ Data restored from storage');
              // Note: In a real app, you'd want to validate this data with the server
            }
          } catch (error) {
            console.error('❌ Failed to restore data:', error);
            window.location.href = '/login';
            return null;
          }
        }
        
        // Use the new modern dashboard
        return <ModernDashboard />;
        
      default:
        return null;
    }
  };

  return getCurrentRoute();
};

export default PostPaymentRouterFinal;
