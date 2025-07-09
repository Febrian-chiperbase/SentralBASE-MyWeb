import React from 'react';
import { usePostPayment } from '@/contexts/PostPaymentContext';

const PaymentDebugger = () => {
  const { paymentData, registrationStep } = usePostPayment();

  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">🔧 Payment Debug Info</h4>
      <div className="space-y-1">
        <div>
          <strong>Current Path:</strong> {window.location.pathname}
        </div>
        <div>
          <strong>Registration Step:</strong> {registrationStep}
        </div>
        <div>
          <strong>Payment Data:</strong> {paymentData ? '✅ Available' : '❌ Missing'}
        </div>
        {paymentData && (
          <div>
            <strong>Customer:</strong> {paymentData.customerName}
          </div>
        )}
        <div>
          <strong>LocalStorage:</strong> {localStorage.getItem('sentrabase_payment_data') ? '✅ Set' : '❌ Empty'}
        </div>
      </div>
      
      <div className="mt-2 space-x-2">
        <button
          onClick={() => {
            const testData = {
              customerName: "Dr. Test Debug",
              email: "debug@test.com",
              phone: "081234567890",
              clinicName: "Debug Clinic",
              plan: { name: "Professional", price: 5000000 },
              amount: 5000000,
              orderId: "DEBUG-" + Date.now()
            };
            localStorage.setItem('sentrabase_payment_data', JSON.stringify(testData));
            window.location.reload();
          }}
          className="bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Set Test Data
        </button>
        
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          className="bg-red-600 px-2 py-1 rounded text-xs"
        >
          Clear & Reset
        </button>
        
        <button
          onClick={() => {
            window.history.pushState({}, '', '/register');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="bg-green-600 px-2 py-1 rounded text-xs"
        >
          Force /register
        </button>
      </div>
    </div>
  );
};

export default PaymentDebugger;
