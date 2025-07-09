// Unified Customer Data Template
// Ensures consistent data structure across login and registration flows

export const createCustomerData = (baseData, source = 'login') => {
  const timestamp = Date.now();
  
  // Base template that matches registration flow
  const customerDataTemplate = {
    // Customer Information
    customerName: baseData.customerName || "Dr. Customer",
    email: baseData.email || "",
    phone: baseData.phone || "081234567890",
    clinicName: baseData.clinicName || "Klinik Customer",
    
    // Plan Information (consistent with payment flow)
    plan: {
      name: baseData.plan?.name || "Professional",
      price: baseData.plan?.price || 5000000,
      features: baseData.plan?.features || [
        "Electronic Medical Records (EMR)",
        "Appointment Management System", 
        "Patient Registration & Check-in",
        "Billing & Invoice Management",
        "Medical Report Generation",
        "Data Security & Backup",
        "Multi-user Access Control",
        "Training & Support"
      ],
      duration: baseData.plan?.duration || 12, // months
      maxUsers: baseData.plan?.maxUsers || 10,
      maxPatients: baseData.plan?.maxPatients || 1000,
      setupTime: baseData.plan?.setupTime || "2-3 weeks",
      trainingHours: baseData.plan?.trainingHours || 8
    },
    
    // Payment Information
    amount: baseData.amount || baseData.plan?.price || 5000000,
    transactionId: baseData.transactionId || `TXN-${timestamp}`,
    orderId: baseData.orderId || `ORDER-${timestamp}`,
    paymentMethod: baseData.paymentMethod || "Bank Transfer",
    paymentDate: baseData.paymentDate || new Date().toISOString(),
    status: baseData.status || "paid",
    
    // Registration Status
    registrationCompleted: true,
    accountCreated: true,
    registrationDate: baseData.registrationDate || new Date().toISOString(),
    
    // Additional Information
    features: baseData.plan?.features || [
      "Electronic Medical Records (EMR)",
      "Appointment Management System", 
      "Patient Registration & Check-in",
      "Billing & Invoice Management",
      "Medical Report Generation",
      "Data Security & Backup",
      "Multi-user Access Control",
      "Training & Support"
    ],
    
    validUntil: baseData.validUntil || new Date(Date.now() + (12 * 30 * 24 * 60 * 60 * 1000)).toISOString(),
    
    // Source tracking
    dataSource: source,
    loginDate: source === 'login' ? new Date().toISOString() : undefined,
    
    // Remember Me (for login)
    rememberMe: baseData.rememberMe || false
  };
  
  return customerDataTemplate;
};

// Demo account data
export const getDemoAccountData = () => {
  return createCustomerData({
    customerName: "Dr. Demo User",
    email: "demo@sentrabase.com",
    phone: "081234567890",
    clinicName: "Demo Clinic SentraBASE",
    plan: {
      name: "Professional Demo",
      price: 5000000,
      features: [
        "Electronic Medical Records (EMR)",
        "Appointment Management System", 
        "Patient Registration & Check-in",
        "Billing & Invoice Management",
        "Medical Report Generation",
        "Data Security & Backup",
        "Multi-user Access Control",
        "Training & Support",
        "Demo Features Access"
      ],
      maxUsers: 10,
      maxPatients: 1000,
      setupTime: "2-3 weeks",
      trainingHours: 8
    },
    amount: 5000000
  }, 'login');
};

// Create custom account data
export const createCustomAccountData = (email, customData = {}) => {
  const username = email.split('@')[0];
  
  return createCustomerData({
    customerName: customData.customerName || `Dr. ${username.charAt(0).toUpperCase() + username.slice(1)}`,
    email: email,
    phone: customData.phone || "081234567890",
    clinicName: customData.clinicName || `Klinik ${username.charAt(0).toUpperCase() + username.slice(1)}`,
    plan: {
      name: customData.plan?.name || "Professional",
      price: customData.plan?.price || 5000000,
      features: customData.plan?.features || [
        "Electronic Medical Records (EMR)",
        "Appointment Management System", 
        "Patient Registration & Check-in",
        "Billing & Invoice Management",
        "Medical Report Generation",
        "Data Security & Backup",
        "Multi-user Access Control",
        "Training & Support"
      ],
      maxUsers: customData.plan?.maxUsers || 10,
      maxPatients: customData.plan?.maxPatients || 1000,
      setupTime: customData.plan?.setupTime || "2-3 weeks",
      trainingHours: customData.plan?.trainingHours || 8
    },
    amount: customData.amount || 5000000,
    ...customData
  }, 'login');
};
