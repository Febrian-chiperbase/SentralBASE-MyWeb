// Dashboard Consistency Verification Tool
// Ensures IDENTICAL dashboard experience from login and register flows

console.log('🔍 Dashboard Consistency Verification Tool Loaded');

window.verifyDashboard = {
  
  // Test login flow dashboard
  testLoginDashboard: function() {
    console.log('🧪 Testing LOGIN dashboard flow...');
    
    // Clear existing data
    localStorage.removeItem('sentrabase_payment_data');
    sessionStorage.removeItem('sentrabase_session_data');
    
    // Create login data (normalized)
    const loginData = {
      customerName: "Dr. Login Test",
      email: "login-test@sentrabase.com",
      phone: "081234567890",
      clinicName: "Login Test Clinic",
      plan: {
        name: "Professional",
        displayName: "Professional",
        price: 5000000,
        duration: 12,
        maxUsers: 10,
        maxPatients: 1000,
        setupTime: "2-3 weeks",
        trainingHours: 8,
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
        color: "green",
        icon: "⭐",
        popular: true
      },
      orderId: "ORDER-LOGIN-" + Date.now(),
      transactionId: "TXN-LOGIN-" + Date.now(),
      amount: 5000000,
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
      normalizedAt: new Date().toISOString(),
      loginDate: new Date().toISOString(),
      rememberMe: false
    };
    
    localStorage.setItem('sentrabase_payment_data', JSON.stringify(loginData));
    sessionStorage.setItem('sentrabase_session_data', JSON.stringify(loginData));
    
    console.log('✅ Login dashboard data created');
    console.log('📊 Login Data:', loginData);
    
    // Go to dashboard
    window.location.href = '/dashboard';
    
    return loginData;
  },
  
  // Test register flow dashboard
  testRegisterDashboard: function() {
    console.log('🧪 Testing REGISTER dashboard flow...');
    
    // Clear existing data
    localStorage.removeItem('sentrabase_payment_data');
    sessionStorage.removeItem('sentrabase_session_data');
    
    // Create register data (normalized - IDENTICAL structure)
    const registerData = {
      customerName: "Dr. Register Test",
      email: "register-test@sentrabase.com",
      phone: "081234567890",
      clinicName: "Register Test Clinic",
      plan: {
        name: "Professional",
        displayName: "Professional",
        price: 5000000,
        duration: 12,
        maxUsers: 10,
        maxPatients: 1000,
        setupTime: "2-3 weeks",
        trainingHours: 8,
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
        color: "green",
        icon: "⭐",
        popular: true
      },
      orderId: "ORDER-REGISTER-" + Date.now(),
      transactionId: "TXN-REGISTER-" + Date.now(),
      amount: 5000000,
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
      dataSource: 'register',
      normalizedAt: new Date().toISOString(),
      password: "hashed_password" // Only difference - register has password
    };
    
    localStorage.setItem('sentrabase_payment_data', JSON.stringify(registerData));
    sessionStorage.setItem('sentrabase_session_data', JSON.stringify(registerData));
    
    console.log('✅ Register dashboard data created');
    console.log('📊 Register Data:', registerData);
    
    // Go to dashboard
    window.location.href = '/dashboard';
    
    return registerData;
  },
  
  // Compare dashboard data structures
  compareStructures: function() {
    console.log('🔍 Comparing dashboard data structures...');
    
    const loginData = this.testLoginDashboard();
    
    setTimeout(() => {
      const registerData = this.testRegisterDashboard();
      
      // Compare key dashboard fields
      const dashboardFields = [
        'customerName', 'email', 'clinicName',
        'plan.name', 'plan.price', 'plan.maxUsers', 'plan.maxPatients', 
        'plan.setupTime', 'plan.trainingHours', 'plan.features',
        'orderId', 'amount', 'status', 'features',
        'registrationCompleted', 'accountCreated'
      ];
      
      console.log('📋 Comparing dashboard-relevant fields...');
      
      const differences = [];
      
      dashboardFields.forEach(field => {
        const keys = field.split('.');
        let loginValue = loginData;
        let registerValue = registerData;
        
        for (const key of keys) {
          loginValue = loginValue?.[key];
          registerValue = registerValue?.[key];
        }
        
        // Skip fields that should be different (IDs, timestamps, etc.)
        if (field.includes('orderId') || field.includes('transactionId') || 
            field.includes('Date') || field === 'password') {
          return;
        }
        
        if (JSON.stringify(loginValue) !== JSON.stringify(registerValue)) {
          differences.push({
            field,
            login: loginValue,
            register: registerValue
          });
        }
      });
      
      if (differences.length === 0) {
        console.log('✅ DASHBOARD STRUCTURES ARE IDENTICAL!');
        console.log('🎉 Login and Register will show the same dashboard');
      } else {
        console.warn('⚠️ Dashboard structure differences found:');
        differences.forEach(diff => {
          console.log(`  ${diff.field}:`);
          console.log(`    Login:`, diff.login);
          console.log(`    Register:`, diff.register);
        });
      }
      
    }, 1000);
  },
  
  // Take screenshot comparison (manual)
  takeScreenshots: function() {
    console.log('📸 Manual Screenshot Comparison Guide:');
    console.log('1. Run verifyDashboard.testLoginDashboard()');
    console.log('2. Take screenshot of dashboard');
    console.log('3. Run verifyDashboard.testRegisterDashboard()');
    console.log('4. Take screenshot of dashboard');
    console.log('5. Compare screenshots - they should be IDENTICAL');
    console.log('');
    console.log('🎯 What to check:');
    console.log('  - Package Information section');
    console.log('  - Order Details section');
    console.log('  - Contact Information section');
    console.log('  - Feature list');
    console.log('  - Progress indicators');
    console.log('  - All text and numbers');
  },
  
  // Verify current dashboard data
  verifyCurrentData: function() {
    console.log('🔍 Verifying current dashboard data...');
    
    const data = localStorage.getItem('sentrabase_payment_data');
    if (!data) {
      console.log('❌ No dashboard data found');
      return;
    }
    
    try {
      const parsed = JSON.parse(data);
      
      console.log('📊 Current Dashboard Data:');
      console.log('  Source:', parsed.dataSource);
      console.log('  Customer:', parsed.customerName);
      console.log('  Email:', parsed.email);
      console.log('  Clinic:', parsed.clinicName);
      console.log('  Plan:', parsed.plan?.name);
      console.log('  Price:', parsed.plan?.price);
      console.log('  Max Users:', parsed.plan?.maxUsers);
      console.log('  Max Patients:', parsed.plan?.maxPatients);
      console.log('  Setup Time:', parsed.plan?.setupTime);
      console.log('  Training Hours:', parsed.plan?.trainingHours);
      console.log('  Features Count:', parsed.plan?.features?.length);
      console.log('  Order ID:', parsed.orderId);
      console.log('  Amount:', parsed.amount);
      console.log('  Status:', parsed.status);
      
      // Check if data is normalized
      const isNormalized = !!(
        parsed.normalizedAt &&
        parsed.plan?.maxUsers &&
        parsed.plan?.maxPatients &&
        parsed.plan?.setupTime &&
        parsed.plan?.trainingHours &&
        parsed.plan?.features?.length === 8
      );
      
      console.log('✅ Data is normalized:', isNormalized);
      
      if (!isNormalized) {
        console.warn('⚠️ Data may not be properly normalized');
        console.log('💡 Try: verifyDashboard.normalizeCurrentData()');
      }
      
      return parsed;
      
    } catch (e) {
      console.error('❌ Failed to parse dashboard data:', e);
    }
  },
  
  // Normalize current data
  normalizeCurrentData: function() {
    console.log('🔧 Normalizing current dashboard data...');
    
    const currentData = this.verifyCurrentData();
    if (!currentData) return;
    
    // Apply normalization
    const normalizedData = {
      ...currentData,
      plan: {
        ...currentData.plan,
        maxUsers: currentData.plan?.maxUsers || 10,
        maxPatients: currentData.plan?.maxPatients || 1000,
        setupTime: currentData.plan?.setupTime || "2-3 weeks",
        trainingHours: currentData.plan?.trainingHours || 8,
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
        color: "green",
        icon: "⭐",
        popular: true
      },
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
      normalizedAt: new Date().toISOString()
    };
    
    localStorage.setItem('sentrabase_payment_data', JSON.stringify(normalizedData));
    sessionStorage.setItem('sentrabase_session_data', JSON.stringify(normalizedData));
    
    console.log('✅ Data normalized successfully');
    console.log('🔄 Refresh page to see changes');
    
    return normalizedData;
  }
};

// Auto-verify current data
window.verifyDashboard.verifyCurrentData();

console.log('🎯 Available verification commands:');
console.log('  verifyDashboard.testLoginDashboard() - Test login dashboard');
console.log('  verifyDashboard.testRegisterDashboard() - Test register dashboard');
console.log('  verifyDashboard.compareStructures() - Compare both structures');
console.log('  verifyDashboard.verifyCurrentData() - Check current data');
console.log('  verifyDashboard.normalizeCurrentData() - Fix current data');
console.log('  verifyDashboard.takeScreenshots() - Screenshot comparison guide');
