import React from 'react';
import { usePostPayment } from '@/contexts/PostPaymentContext';
import PostPaymentRegister from '@/components/auth/PostPaymentRegister';
import OrderDashboard from '@/components/dashboard/OrderDashboard';

const PostPaymentRouter = () => {
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
        return <OrderDashboard />;
        
      default:
        return null;
    }
  };

  return getCurrentRoute();
};

export default PostPaymentRouter;
