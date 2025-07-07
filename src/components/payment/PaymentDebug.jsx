import React from 'react';
import { usePayment } from '@/contexts/PaymentContext';

const PaymentDebug = () => {
  const { selectedPlan, customerInfo, paymentMethod, billingCycle } = usePayment();

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 text-white p-4 rounded-lg text-xs max-w-xs z-50 border border-slate-600">
      <h4 className="font-bold mb-2">Payment Debug Info:</h4>
      <div className="space-y-1">
        <p>Selected Plan: {selectedPlan?.name || 'None'}</p>
        <p>Billing: {billingCycle}</p>
        <p>Payment Method: {paymentMethod?.name || 'None'}</p>
        <p>Clinic Name: {customerInfo?.clinicName || 'Empty'}</p>
        <p>Email: {customerInfo?.email || 'Empty'}</p>
        <p>Phone: {customerInfo?.phone || 'Empty'}</p>
      </div>
    </div>
  );
};

export default PaymentDebug;
