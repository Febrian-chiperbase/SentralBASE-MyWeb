// Payment utility functions

export const formatCurrency = (amount, currency = 'IDR') => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0
  }).format(amount);
};

export const calculateTax = (amount, taxRate = 0.11) => {
  return Math.round(amount * taxRate);
};

export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `SB${timestamp}${random}`;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Indonesian phone number validation
  const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const formatPhoneNumber = (phone) => {
  // Format Indonesian phone number
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('62')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+62${cleaned.substring(1)}`;
  }
  
  return `+62${cleaned}`;
};

export const getPaymentMethodIcon = (methodId) => {
  const icons = {
    bank_transfer: '🏦',
    virtual_account: '💳',
    credit_card: '💳',
    gopay: '📱',
    ovo: '📱',
    dana: '📱',
    shopeepay: '🛒',
    linkaja: '🔗'
  };
  
  return icons[methodId] || '💰';
};

export const getPaymentMethodFee = (methodId, amount) => {
  const fees = {
    bank_transfer: 0,
    virtual_account: 4000,
    credit_card: Math.max(amount * 0.029 + 2000, 2000),
    gopay: 2500,
    ovo: 2500,
    dana: 2500,
    shopeepay: 2500,
    linkaja: 2500
  };
  
  return fees[methodId] || 0;
};

export const getProcessingTime = (methodId) => {
  const times = {
    bank_transfer: '1-2 hari kerja',
    virtual_account: 'Instan',
    credit_card: 'Instan',
    gopay: 'Instan',
    ovo: 'Instan',
    dana: 'Instan',
    shopeepay: 'Instan',
    linkaja: 'Instan'
  };
  
  return times[methodId] || 'Tidak diketahui';
};

export const generateInvoiceData = (paymentData) => {
  return {
    invoiceNumber: generateTransactionId(),
    date: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    customer: paymentData.customerInfo,
    items: [
      {
        description: `Paket ${paymentData.plan.name} - ${paymentData.billingCycle === 'yearly' ? 'Tahunan' : 'Bulanan'}`,
        quantity: 1,
        unitPrice: paymentData.pricing.basePrice,
        total: paymentData.pricing.basePrice
      }
    ],
    subtotal: paymentData.pricing.basePrice,
    tax: paymentData.pricing.tax,
    total: paymentData.pricing.total,
    paymentMethod: paymentData.paymentMethod,
    notes: `Terima kasih telah memilih SentraBASE untuk sistem RME klinik ${paymentData.customerInfo.clinicName}`
  };
};

export const validatePaymentData = (paymentData) => {
  const errors = [];
  
  // Validate customer info
  if (!paymentData.customerInfo.clinicName) {
    errors.push('Nama klinik wajib diisi');
  }
  
  if (!paymentData.customerInfo.contactPerson) {
    errors.push('Nama penanggung jawab wajib diisi');
  }
  
  if (!paymentData.customerInfo.email || !validateEmail(paymentData.customerInfo.email)) {
    errors.push('Email valid wajib diisi');
  }
  
  if (!paymentData.customerInfo.phone || !validatePhone(paymentData.customerInfo.phone)) {
    errors.push('Nomor telepon valid wajib diisi');
  }
  
  // Validate payment method
  if (!paymentData.paymentMethod) {
    errors.push('Metode pembayaran wajib dipilih');
  }
  
  // Validate plan
  if (!paymentData.plan) {
    errors.push('Paket wajib dipilih');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const simulatePaymentGateway = async (paymentData) => {
  // Simulate payment gateway API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate random success/failure for demo
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        resolve({
          success: true,
          transactionId: generateTransactionId(),
          status: 'completed',
          amount: paymentData.pricing.total,
          paymentMethod: paymentData.paymentMethod.id,
          timestamp: new Date().toISOString()
        });
      } else {
        reject(new Error('Pembayaran gagal. Silakan coba lagi.'));
      }
    }, 2000); // Simulate 2 second processing time
  });
};

export const sendPaymentNotification = async (paymentResult, customerInfo) => {
  // Simulate sending email notification
  console.log('Sending payment notification:', {
    to: customerInfo.email,
    subject: 'Konfirmasi Pembayaran SentraBASE',
    transactionId: paymentResult.transactionId,
    amount: paymentResult.amount
  });
  
  // In real implementation, this would call email service
  return Promise.resolve({ sent: true });
};

export default {
  formatCurrency,
  calculateTax,
  calculateDiscount,
  generateTransactionId,
  validateEmail,
  validatePhone,
  formatPhoneNumber,
  getPaymentMethodIcon,
  getPaymentMethodFee,
  getProcessingTime,
  generateInvoiceData,
  validatePaymentData,
  simulatePaymentGateway,
  sendPaymentNotification
};
