import React from 'react';
import { usePostPayment } from '@/contexts/PostPaymentContext';
import PostPaymentRegister from '@/components/auth/PostPaymentRegister';
import OrderDashboardEnhanced from '@/components/dashboard/OrderDashboardEnhanced';

const PostPaymentRouterEnhanced = () => {
  const { registrationStep, paymentData } = usePostPayment();

  // Handle different routes based on current step
  const getCurrentRoute = () => {
    const path = window.location.pathname;
    
    switch (path) {
      case '/register':
        if (!paymentData) {
          // Redirect to home if no payment data
          window.location.href = '/';
          return null;
        }
        return <PostPaymentRegister />;
        
      case '/dashboard':
        if (!paymentData || !paymentData.registrationCompleted) {
          // Redirect to register if not completed
          window.location.href = '/register';
          return null;
        }
        return <OrderDashboardEnhanced />;
        
      default:
        return null;
    }
  };

  return getCurrentRoute();
};

export default PostPaymentRouterEnhanced;
