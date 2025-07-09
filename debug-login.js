// Debug Login System - Run in Browser Console
// This script helps debug login issues

console.log('🔧 Login Debug Script Loaded');

// Debug Functions
window.debugLogin = {
  
  // Check current authentication state
  checkAuth: function() {
    console.log('🔍 Checking authentication state...');
    
    const localStorage_data = localStorage.getItem('sentrabase_payment_data');
    const sessionStorage_data = sessionStorage.getItem('sentrabase_session_data');
    const remembered_email = localStorage.getItem('sentrabase_remembered_email');
    const remembered_password = localStorage.getItem('sentrabase_remembered_password');
    
    console.log('📊 Authentication Data:');
    console.log('  localStorage:', localStorage_data ? 'EXISTS' : 'MISSING');
    console.log('  sessionStorage:', sessionStorage_data ? 'EXISTS' : 'MISSING');
    console.log('  remembered_email:', remembered_email || 'NONE');
    console.log('  remembered_password:', remembered_password ? 'EXISTS' : 'NONE');
    
    if (localStorage_data) {
      try {
        const parsed = JSON.parse(localStorage_data);
        console.log('  localStorage data:', parsed);
      } catch (e) {
        console.error('  localStorage data is corrupted:', e);
      }
    }
    
    if (sessionStorage_data) {
      try {
        const parsed = JSON.parse(sessionStorage_data);
        console.log('  sessionStorage data:', parsed);
      } catch (e) {
        console.error('  sessionStorage data is corrupted:', e);
      }
    }
  },
  
  // Force login with demo data
  forceLogin: function() {
    console.log('🔐 Force login with demo data...');
    
    const demoData = {
      customerName: "Dr. Debug User",
      email: "debug@sentrabase.com",
      phone: "081234567890",
      clinicName: "Debug Clinic SentraBASE",
      plan: {
        name: "Professional",
        price: 5000000,
        features: ["EMR System", "Appointment Management", "Billing System"]
      },
      amount: 5000000,
      orderId: "ORDER-DEBUG-" + Date.now(),
      transactionId: "TXN-DEBUG-" + Date.now(),
      registrationCompleted: true,
      accountCreated: true,
      loginDate: new Date().toISOString(),
      debugMode: true
    };
    
    // Store in all locations
    localStorage.setItem('sentrabase_payment_data', JSON.stringify(demoData));
    sessionStorage.setItem('sentrabase_session_data', JSON.stringify(demoData));
    
    console.log('✅ Demo data stored, redirecting to dashboard...');
    window.location.href = '/dashboard';
  },
  
  // Clear all data
  clearAll: function() {
    console.log('🗑️ Clearing all authentication data...');
    
    localStorage.removeItem('sentrabase_payment_data');
    sessionStorage.removeItem('sentrabase_session_data');
    localStorage.removeItem('sentrabase_remembered_email');
    localStorage.removeItem('sentrabase_remembered_password');
    
    console.log('✅ All data cleared');
  },
  
  // Test login flow
  testLogin: function(email = 'demo@sentrabase.com', password = 'demo123') {
    console.log('🧪 Testing login flow...');
    console.log('  Email:', email);
    console.log('  Password:', password);
    
    // Simulate login process
    const mockData = {
      customerName: email === 'demo@sentrabase.com' ? "Dr. Demo User" : `Dr. ${email.split('@')[0]}`,
      email: email,
      phone: "081234567890",
      clinicName: email === 'demo@sentrabase.com' ? "Demo Clinic SentraBASE" : `Klinik ${email.split('@')[0]}`,
      plan: {
        name: "Professional",
        price: 5000000,
        features: ["EMR System", "Appointment Management", "Billing System"]
      },
      amount: 5000000,
      orderId: "ORDER-TEST-" + Date.now(),
      transactionId: "TXN-TEST-" + Date.now(),
      registrationCompleted: true,
      accountCreated: true,
      loginDate: new Date().toISOString(),
      testMode: true
    };
    
    localStorage.setItem('sentrabase_payment_data', JSON.stringify(mockData));
    sessionStorage.setItem('sentrabase_session_data', JSON.stringify(mockData));
    
    console.log('✅ Test login data stored');
    console.log('📊 Mock data:', mockData);
    
    return mockData;
  },
  
  // Navigate to different pages
  goTo: function(page) {
    const pages = {
      home: '/',
      login: '/login',
      dashboard: '/dashboard',
      register: '/register'
    };
    
    const url = pages[page] || page;
    console.log('🧭 Navigating to:', url);
    window.location.href = url;
  },
  
  // Check current page and suggest actions
  diagnose: function() {
    const path = window.location.pathname;
    console.log('🔍 Current page:', path);
    
    switch (path) {
      case '/login':
        console.log('💡 You are on login page');
        console.log('   Try: debugLogin.testLogin() to simulate login');
        console.log('   Or: Use demo@sentrabase.com / demo123');
        break;
        
      case '/dashboard':
        console.log('💡 You are on dashboard page');
        console.log('   Try: debugLogin.checkAuth() to verify data');
        break;
        
      case '/':
        console.log('💡 You are on home page');
        console.log('   Try: debugLogin.goTo("login") to go to login');
        break;
        
      default:
        console.log('💡 Unknown page');
        console.log('   Try: debugLogin.goTo("login") to go to login');
    }
    
    this.checkAuth();
  }
};

// Auto-diagnose on load
window.debugLogin.diagnose();

console.log('🎯 Available debug commands:');
console.log('  debugLogin.checkAuth() - Check authentication state');
console.log('  debugLogin.forceLogin() - Force login with demo data');
console.log('  debugLogin.clearAll() - Clear all data');
console.log('  debugLogin.testLogin() - Test login with demo credentials');
console.log('  debugLogin.goTo("login") - Navigate to login page');
console.log('  debugLogin.diagnose() - Diagnose current state');
