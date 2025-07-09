// Simulate payment test data
const testPaymentData = {
  customerName: "Dr. Test User",
  email: "test@sentrabase.com",
  phone: "081234567890",
  clinicName: "Klinik Test SentraBASE",
  transactionId: "TXN-TEST-" + Date.now(),
  plan: {
    name: "Professional",
    price: 5000000,
    features: [
      "Rekam Medis Elektronik",
      "Integrasi BPJS",
      "Farmasi & Inventory",
      "Laboratorium",
      "Radiologi"
    ]
  },
  amount: 5000000,
  paymentMethod: "Bank Transfer",
  orderId: "ORDER-TEST-" + Date.now(),
  status: "paid",
  paymentDate: new Date().toISOString()
};

// Test localStorage functionality
console.log('🧪 Testing localStorage with payment data...');

try {
  // Store test data
  localStorage.setItem('sentrabase_payment_data', JSON.stringify(testPaymentData));
  console.log('✅ Payment data stored successfully');
  
  // Retrieve test data
  const retrieved = JSON.parse(localStorage.getItem('sentrabase_payment_data'));
  console.log('✅ Payment data retrieved successfully');
  
  // Verify data integrity
  if (retrieved.customerName === testPaymentData.customerName) {
    console.log('✅ Data integrity verified');
  } else {
    console.log('❌ Data integrity failed');
  }
  
  console.log('📊 Test Payment Data:', retrieved);
  
} catch (error) {
  console.error('❌ localStorage test failed:', error);
}

// Instructions for manual testing
console.log('\n🎯 MANUAL TEST INSTRUCTIONS:');
console.log('1. Open browser console on http://localhost:5173/');
console.log('2. Run this script to set test payment data');
console.log('3. Navigate to /register to test registration flow');
console.log('4. Navigate to /dashboard to test dashboard');

// Export for browser console use
if (typeof window !== 'undefined') {
  window.testPaymentData = testPaymentData;
  window.setTestPaymentData = () => {
    localStorage.setItem('sentrabase_payment_data', JSON.stringify(testPaymentData));
    console.log('✅ Test payment data set! Navigate to /register');
  };
  window.clearTestData = () => {
    localStorage.removeItem('sentrabase_payment_data');
    console.log('✅ Test data cleared!');
  };
}
