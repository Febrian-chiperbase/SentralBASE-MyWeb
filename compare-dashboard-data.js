// Dashboard Data Comparison Tool
// Run in browser console to compare data from login vs register

console.log('🔍 Dashboard Data Comparison Tool Loaded');

window.compareDashboardData = {
  
  // Check current dashboard data
  checkCurrentData: function() {
    console.log('📊 Checking current dashboard data...');
    
    const localStorage_data = localStorage.getItem('sentrabase_payment_data');
    const sessionStorage_data = sessionStorage.getItem('sentrabase_session_data');
    
    if (localStorage_data) {
      try {
        const data = JSON.parse(localStorage_data);
        console.log('📋 Current Data Structure:');
        console.log('  Source:', data.dataSource || 'unknown');
        console.log('  Customer Name:', data.customerName);
        console.log('  Email:', data.email);
        console.log('  Clinic Name:', data.clinicName);
        console.log('  Plan Name:', data.plan?.name);
        console.log('  Plan Features:', data.plan?.features?.length || 0, 'features');
        console.log('  Amount:', data.amount);
        console.log('  Registration Completed:', data.registrationCompleted);
        console.log('  Account Created:', data.accountCreated);
        console.log('  Has Package Info:', !!(data.plan?.maxUsers && data.plan?.maxPatients));
        
        console.log('📊 Full Data:', data);
        return data;
      } catch (e) {
        console.error('❌ Failed to parse data:', e);
      }
    } else {
      console.log('❌ No data found in localStorage');
    }
  },
  
  // Simulate register flow data
  createRegisterData: function() {
    console.log('🔄 Creating register flow data...');
    
    const registerData = {
      // From payment flow
      customerName: "Dr. Register User",
      email: "register@sentrabase.com",
      phone: "081234567890",
      clinicName: "Register Clinic",
      transactionId: "TXN-REG-" + Date.now(),
      plan: {
        name: "Professional",
        price: 5000000,
        features: [
          "Electronic Medical Records (EMR)",
          "Appointment Management System", 
          "Patient Registration & Check-in",
          "Billing & Invoice Management",
          "Medical Report Generation",
          "Data Security & Backup",
          "Multi-user Access Control",
          "Training & Support"
        ],
        duration: 12,
        maxUsers: 10,
        maxPatients: 1000,
        setupTime: "2-3 weeks",
        trainingHours: 8
      },
      amount: 5000000,
      paymentMethod: "Bank Transfer",
      paymentDate: new Date().toISOString(),
      orderId: "ORDER-REG-" + Date.now(),
      status: "paid",
      features: [
        "Electronic Medical Records (EMR)",
        "Appointment Management System", 
        "Patient Registration & Check-in",
        "Billing & Invoice Management",
        "Medical Report Generation",
        "Data Security & Backup",
        "Multi-user Access Control",
        "Training & Support"
      ],
      validUntil: new Date(Date.now() + (12 * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      
      // From registration completion
      registrationCompleted: true,
      registrationDate: new Date().toISOString(),
      accountCreated: true,
      password: "hashed_password",
      
      dataSource: 'register'
    };
    
    localStorage.setItem('sentrabase_payment_data', JSON.stringify(registerData));
    console.log('✅ Register data created and stored');
    console.log('📊 Register Data:', registerData);
    
    return registerData;
  },
  
  // Simulate login flow data
  createLoginData: function() {
    console.log('🔄 Creating login flow data...');
    
    const loginData = {
      customerName: "Dr. Login User",
      email: "login@sentrabase.com",
      phone: "081234567890",
      clinicName: "Login Clinic",
      plan: {
        name: "Professional",
        price: 5000000,
        features: [
          "Electronic Medical Records (EMR)",
          "Appointment Management System", 
          "Patient Registration & Check-in",
          "Billing & Invoice Management",
          "Medical Report Generation",
          "Data Security & Backup",
          "Multi-user Access Control",
          "Training & Support"
        ],
        duration: 12,
        maxUsers: 10,
        maxPatients: 1000,
        setupTime: "2-3 weeks",
        trainingHours: 8
      },
      amount: 5000000,
      transactionId: "TXN-LOGIN-" + Date.now(),
      orderId: "ORDER-LOGIN-" + Date.now(),
      paymentMethod: "Bank Transfer",
      paymentDate: new Date().toISOString(),
      status: "paid",
      registrationCompleted: true,
      accountCreated: true,
      registrationDate: new Date().toISOString(),
      features: [
        "Electronic Medical Records (EMR)",
        "Appointment Management System", 
        "Patient Registration & Check-in",
        "Billing & Invoice Management",
        "Medical Report Generation",
        "Data Security & Backup",
        "Multi-user Access Control",
        "Training & Support"
      ],
      validUntil: new Date(Date.now() + (12 * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      dataSource: 'login',
      loginDate: new Date().toISOString(),
      rememberMe: false
    };
    
    localStorage.setItem('sentrabase_payment_data', JSON.stringify(loginData));
    console.log('✅ Login data created and stored');
    console.log('📊 Login Data:', loginData);
    
    return loginData;
  },
  
  // Compare two data structures
  compareData: function(data1, data2) {
    console.log('🔍 Comparing data structures...');
    
    const keys1 = Object.keys(data1);
    const keys2 = Object.keys(data2);
    
    console.log('📋 Key Differences:');
    console.log('  Data 1 keys:', keys1.length);
    console.log('  Data 2 keys:', keys2.length);
    
    const missingInData2 = keys1.filter(key => !keys2.includes(key));
    const missingInData1 = keys2.filter(key => !keys1.includes(key));
    
    if (missingInData2.length > 0) {
      console.log('  Missing in Data 2:', missingInData2);
    }
    
    if (missingInData1.length > 0) {
      console.log('  Missing in Data 1:', missingInData1);
    }
    
    console.log('📊 Value Differences:');
    keys1.forEach(key => {
      if (keys2.includes(key)) {
        if (JSON.stringify(data1[key]) !== JSON.stringify(data2[key])) {
          console.log(`  ${key}:`);
          console.log(`    Data 1:`, data1[key]);
          console.log(`    Data 2:`, data2[key]);
        }
      }
    });
  },
  
  // Test dashboard with different data
  testDashboard: function(dataType = 'login') {
    console.log(`🧪 Testing dashboard with ${dataType} data...`);
    
    if (dataType === 'register') {
      this.createRegisterData();
    } else {
      this.createLoginData();
    }
    
    console.log('🧭 Redirecting to dashboard...');
    window.location.href = '/dashboard';
  },
  
  // Fix data structure to match register flow
  fixDataStructure: function() {
    console.log('🔧 Fixing data structure...');
    
    const currentData = this.checkCurrentData();
    if (!currentData) return;
    
    // Ensure all required fields are present
    const fixedData = {
      ...currentData,
      
      // Ensure plan has all required fields
      plan: {
        ...currentData.plan,
        duration: currentData.plan?.duration || 12,
        maxUsers: currentData.plan?.maxUsers || 10,
        maxPatients: currentData.plan?.maxPatients || 1000,
        setupTime: currentData.plan?.setupTime || "2-3 weeks",
        trainingHours: currentData.plan?.trainingHours || 8,
        features: currentData.plan?.features || [
          "Electronic Medical Records (EMR)",
          "Appointment Management System", 
          "Patient Registration & Check-in",
          "Billing & Invoice Management",
          "Medical Report Generation",
          "Data Security & Backup",
          "Multi-user Access Control",
          "Training & Support"
        ]
      },
      
      // Ensure other required fields
      features: currentData.features || currentData.plan?.features || [
        "Electronic Medical Records (EMR)",
        "Appointment Management System", 
        "Patient Registration & Check-in",
        "Billing & Invoice Management",
        "Medical Report Generation",
        "Data Security & Backup",
        "Multi-user Access Control",
        "Training & Support"
      ],
      
      validUntil: currentData.validUntil || new Date(Date.now() + (12 * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      paymentMethod: currentData.paymentMethod || "Bank Transfer",
      status: currentData.status || "paid"
    };
    
    localStorage.setItem('sentrabase_payment_data', JSON.stringify(fixedData));
    sessionStorage.setItem('sentrabase_session_data', JSON.stringify(fixedData));
    
    console.log('✅ Data structure fixed');
    console.log('📊 Fixed Data:', fixedData);
    
    return fixedData;
  }
};

// Auto-check current data
window.compareDashboardData.checkCurrentData();

console.log('🎯 Available commands:');
console.log('  compareDashboardData.checkCurrentData() - Check current data');
console.log('  compareDashboardData.createRegisterData() - Create register flow data');
console.log('  compareDashboardData.createLoginData() - Create login flow data');
console.log('  compareDashboardData.testDashboard("register") - Test with register data');
console.log('  compareDashboardData.testDashboard("login") - Test with login data');
console.log('  compareDashboardData.fixDataStructure() - Fix current data structure');
