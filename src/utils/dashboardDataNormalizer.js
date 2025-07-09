// Dashboard Data Normalizer
// Ensures IDENTICAL data structure for dashboard regardless of source (login/register)

export const normalizeDashboardData = (rawData, source = 'unknown') => {
  console.log(`🔄 Normalizing dashboard data from ${source}...`);
  console.log('📊 Raw data received:', rawData);
  
  // Base timestamp for consistent IDs
  const timestamp = rawData.loginDate || rawData.registrationDate || new Date().toISOString();
  const timestampNum = new Date(timestamp).getTime();
  
  // Normalized data structure - IDENTICAL for all sources
  const normalizedData = {
    // === CUSTOMER INFORMATION ===
    customerName: rawData.customerName || "Dr. Customer",
    email: rawData.email || "",
    phone: rawData.phone || "081234567890",
    clinicName: rawData.clinicName || "Klinik Customer",
    
    // === PLAN INFORMATION ===
    plan: {
      name: rawData.plan?.name || "Professional",
      displayName: rawData.plan?.displayName || rawData.plan?.name || "Professional",
      price: rawData.plan?.price || rawData.amount || 5000000,
      duration: rawData.plan?.duration || 12,
      
      // Package details for dashboard display
      maxUsers: rawData.plan?.maxUsers || 10,
      maxPatients: rawData.plan?.maxPatients || 1000,
      setupTime: rawData.plan?.setupTime || "2-3 weeks",
      trainingHours: rawData.plan?.trainingHours || 8,
      
      // Features array - IDENTICAL for all
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
      
      // Package badge info
      color: getPackageColor(rawData.plan?.name || "Professional"),
      icon: getPackageIcon(rawData.plan?.name || "Professional"),
      popular: rawData.plan?.name === "Professional"
    },
    
    // === ORDER INFORMATION ===
    orderId: rawData.orderId || `ORDER-${timestampNum}`,
    transactionId: rawData.transactionId || `TXN-${timestampNum}`,
    amount: rawData.amount || rawData.plan?.price || 5000000,
    paymentMethod: rawData.paymentMethod || "Bank Transfer",
    paymentDate: rawData.paymentDate || timestamp,
    status: rawData.status || "paid",
    
    // === REGISTRATION STATUS ===
    registrationCompleted: true,
    accountCreated: true,
    registrationDate: rawData.registrationDate || timestamp,
    
    // === FEATURES LIST (for dashboard display) ===
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
    
    // === VALIDITY ===
    validUntil: rawData.validUntil || new Date(timestampNum + (12 * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    
    // === METADATA ===
    dataSource: source,
    normalizedAt: new Date().toISOString(),
    originalSource: rawData.dataSource || source,
    
    // === LOGIN SPECIFIC ===
    loginDate: source === 'login' ? timestamp : rawData.loginDate,
    rememberMe: rawData.rememberMe || false,
    
    // === REGISTER SPECIFIC ===
    password: rawData.password || undefined // Only for register flow
  };
  
  console.log('✅ Data normalized successfully');
  console.log('📋 Normalized data:', normalizedData);
  
  return normalizedData;
};

// Get package color for badge
const getPackageColor = (planName) => {
  const colors = {
    'Basic': 'blue',
    'Professional': 'green', 
    'Enterprise': 'purple',
    'Professional Demo': 'green'
  };
  return colors[planName] || 'blue';
};

// Get package icon for badge
const getPackageIcon = (planName) => {
  const icons = {
    'Basic': '🚀',
    'Professional': '⭐',
    'Enterprise': '👑',
    'Professional Demo': '⭐'
  };
  return icons[planName] || '🚀';
};

// Validate normalized data
export const validateDashboardData = (data) => {
  console.log('🔍 Validating dashboard data...');
  
  const requiredFields = [
    'customerName', 'email', 'clinicName',
    'plan.name', 'plan.price', 'plan.maxUsers', 'plan.maxPatients',
    'orderId', 'amount', 'registrationCompleted'
  ];
  
  const missing = [];
  
  requiredFields.forEach(field => {
    const keys = field.split('.');
    let value = data;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    if (value === undefined || value === null) {
      missing.push(field);
    }
  });
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing required fields:', missing);
    return false;
  }
  
  console.log('✅ Data validation passed');
  return true;
};

// Compare two data structures for dashboard consistency
export const compareDashboardData = (data1, data2) => {
  console.log('🔍 Comparing dashboard data structures...');
  
  const dashboardFields = [
    'customerName', 'email', 'clinicName',
    'plan.name', 'plan.price', 'plan.maxUsers', 'plan.maxPatients', 'plan.setupTime', 'plan.trainingHours',
    'orderId', 'amount', 'status', 'features.length'
  ];
  
  const differences = [];
  
  dashboardFields.forEach(field => {
    const keys = field.split('.');
    let value1 = data1;
    let value2 = data2;
    
    for (const key of keys) {
      value1 = value1?.[key];
      value2 = value2?.[key];
    }
    
    if (JSON.stringify(value1) !== JSON.stringify(value2)) {
      differences.push({
        field,
        data1: value1,
        data2: value2
      });
    }
  });
  
  if (differences.length > 0) {
    console.warn('⚠️ Dashboard data differences found:', differences);
    return false;
  }
  
  console.log('✅ Dashboard data is identical');
  return true;
};

// Create demo data for testing
export const createDemoDashboardData = (source = 'demo') => {
  return normalizeDashboardData({
    customerName: "Dr. Demo User",
    email: "demo@sentrabase.com",
    phone: "081234567890",
    clinicName: "Demo Clinic SentraBASE",
    plan: {
      name: "Professional Demo",
      price: 5000000
    },
    amount: 5000000
  }, source);
};
