import React, { createContext, useContext, useState } from 'react';

const PostPaymentContext = createContext();

export const PostPaymentProvider = ({ children }) => {
  const [paymentData, setPaymentData] = useState(null);
  const [registrationStep, setRegistrationStep] = useState('payment'); // payment -> register -> dashboard

  // Store payment data (unified for both payment and login system)
  const storePaymentData = (data) => {
    console.log('💾 PostPaymentContext - Storing payment data AS-IS:', data);
    
    try {
      // Store data exactly as received (no normalization)
      setPaymentData(data);
      
      // Store in localStorage
      localStorage.setItem('sentrabase_payment_data', JSON.stringify(data));
      
      // Store in sessionStorage as backup
      sessionStorage.setItem('sentrabase_session_data', JSON.stringify(data));
      
      console.log('✅ Payment data stored successfully (no modification)');
      return data;
    } catch (error) {
      console.error('❌ Failed to store payment data:', error);
      return false;
    }
  };

  // Get stored payment data (enhanced)
  const getPaymentData = () => {
    if (paymentData) {
      console.log('📊 Returning cached payment data');
      return paymentData;
    }
    
    // Try localStorage first
    const storedLocal = localStorage.getItem('sentrabase_payment_data');
    if (storedLocal) {
      try {
        const data = JSON.parse(storedLocal);
        console.log('📊 Loaded payment data from localStorage');
        setPaymentData(data);
        return data;
      } catch (error) {
        console.error('❌ Failed to parse localStorage data:', error);
      }
    }
    
    // Try sessionStorage as fallback
    const storedSession = sessionStorage.getItem('sentrabase_session_data');
    if (storedSession) {
      try {
        const data = JSON.parse(storedSession);
        console.log('📊 Loaded payment data from sessionStorage');
        setPaymentData(data);
        return data;
      } catch (error) {
        console.error('❌ Failed to parse sessionStorage data:', error);
      }
    }
    
    console.log('❌ No payment data found');
    return null;
  };

  // Complete registration and move to dashboard
  const completeRegistration = (userData) => {
    const updatedData = {
      ...paymentData,
      ...userData,
      registrationCompleted: true,
      registrationDate: new Date().toISOString()
    };
    
    setPaymentData(updatedData);
    localStorage.setItem('sentrabase_payment_data', JSON.stringify(updatedData));
    setRegistrationStep('dashboard');
    
    return updatedData;
  };

  // Clear payment data (enhanced for login system)
  const clearPaymentData = () => {
    console.log('🗑️ Clearing all payment data...');
    
    setPaymentData(null);
    setRegistrationStep('payment');
    
    // Clear all storage
    localStorage.removeItem('sentrabase_payment_data');
    sessionStorage.removeItem('sentrabase_session_data');
    localStorage.removeItem('sentrabase_remembered_email');
    localStorage.removeItem('sentrabase_remembered_password');
    
    console.log('✅ All payment data cleared');
  };

  const value = {
    paymentData,
    registrationStep,
    storePaymentData,
    getPaymentData,
    completeRegistration,
    clearPaymentData,
    setRegistrationStep
  };

  return (
    <PostPaymentContext.Provider value={value}>
      {children}
    </PostPaymentContext.Provider>
  );
};

export const usePostPayment = () => {
  const context = useContext(PostPaymentContext);
  if (!context) {
    throw new Error('usePostPayment must be used within PostPaymentProvider');
  }
  return context;
};
