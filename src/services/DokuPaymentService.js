/**
 * DOKU Payment Gateway Service
 * Cheapest payment gateway in Indonesia (Rp 2.500 per transaction)
 */

class DokuPaymentService {
  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://pay.doku.com' 
      : 'https://staging.doku.com';
    
    this.config = {
      merchantId: process.env.DOKU_MERCHANT_ID || 'SENTRABASE001',
      sharedKey: process.env.DOKU_SHARED_KEY || 'your-shared-key',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  /**
   * Generate signature for DOKU API
   */
  generateSignature(data) {
    const crypto = require('crypto');
    const signatureString = `${data.amount}${this.config.merchantId}${data.invoiceNumber}${this.config.sharedKey}`;
    return crypto.createHash('sha1').update(signatureString).digest('hex');
  }

  /**
   * Create Virtual Account payment
   * Fee: Rp 2.500 per transaction (cheapest!)
   */
  async createVirtualAccount(paymentData) {
    try {
      const invoiceNumber = `SENTRA-${Date.now()}`;
      const amount = paymentData.amount;
      
      const requestData = {
        merchantId: this.config.merchantId,
        invoiceNumber: invoiceNumber,
        amount: amount,
        currency: 'IDR',
        paymentChannel: 'VIRTUAL_ACCOUNT_BCA',
        customerName: paymentData.customerInfo.contactPerson,
        customerEmail: paymentData.customerInfo.email,
        customerPhone: paymentData.customerInfo.phone,
        description: `SentraBASE ${paymentData.plan.name} Package`,
        expiredTime: 24 * 60 * 60, // 24 hours
        callbackUrl: `${window.location.origin}/payment-callback`,
        redirectUrl: `${window.location.origin}/payment-success`
      };

      // Generate signature
      requestData.signature = this.generateSignature(requestData);

      // For demo purposes, simulate DOKU response
      const mockResponse = {
        success: true,
        invoiceNumber: invoiceNumber,
        virtualAccountNumber: `8808${Math.random().toString().substr(2, 10)}`,
        amount: amount,
        expiredTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        paymentUrl: `${this.baseUrl}/payment/${invoiceNumber}`,
        qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
        fee: 2500, // Rp 2.500 - cheapest in market!
        instructions: [
          'Buka aplikasi mobile banking BCA',
          'Pilih menu Transfer > Virtual Account',
          `Masukkan nomor VA: ${requestData.virtualAccountNumber}`,
          `Nominal: Rp ${new Intl.NumberFormat('id-ID').format(amount)}`,
          'Konfirmasi dan selesaikan pembayaran',
          'Simpan bukti transfer'
        ]
      };

      console.log('🏦 DOKU Virtual Account created:', mockResponse);
      return mockResponse;

    } catch (error) {
      console.error('DOKU VA creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create E-wallet payment (OVO/DANA)
   * Fee: Rp 1.500 per transaction (even cheaper!)
   */
  async createEwalletPayment(paymentData, walletType = 'OVO') {
    try {
      const invoiceNumber = `SENTRA-EW-${Date.now()}`;
      const amount = paymentData.amount;
      
      const requestData = {
        merchantId: this.config.merchantId,
        invoiceNumber: invoiceNumber,
        amount: amount,
        currency: 'IDR',
        paymentChannel: `EWALLET_${walletType}`,
        customerName: paymentData.customerInfo.contactPerson,
        customerEmail: paymentData.customerInfo.email,
        customerPhone: paymentData.customerInfo.phone,
        description: `SentraBASE ${paymentData.plan.name} Package`,
        expiredTime: 15 * 60, // 15 minutes for e-wallet
        callbackUrl: `${window.location.origin}/payment-callback`,
        redirectUrl: `${window.location.origin}/payment-success`
      };

      // Generate signature
      requestData.signature = this.generateSignature(requestData);

      // Mock e-wallet response
      const mockResponse = {
        success: true,
        invoiceNumber: invoiceNumber,
        paymentUrl: `${walletType.toLowerCase()}://payment?invoice=${invoiceNumber}`,
        deepLink: `${walletType.toLowerCase()}://pay/${invoiceNumber}`,
        qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`,
        amount: amount,
        expiredTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        fee: 1500, // Rp 1.500 - cheapest e-wallet fee!
        instructions: [
          `Buka aplikasi ${walletType}`,
          'Scan QR Code di atas',
          'Atau klik link pembayaran',
          `Konfirmasi pembayaran Rp ${new Intl.NumberFormat('id-ID').format(amount)}`,
          'Selesaikan dengan PIN/biometrik'
        ]
      };

      console.log(`📱 DOKU ${walletType} payment created:`, mockResponse);
      return mockResponse;

    } catch (error) {
      console.error(`DOKU ${walletType} creation error:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(invoiceNumber) {
    try {
      // Mock status check
      const mockStatus = {
        success: true,
        invoiceNumber: invoiceNumber,
        status: Math.random() > 0.5 ? 'PAID' : 'PENDING',
        paidAmount: 0,
        paidTime: null,
        transactionId: `TXN-${Date.now()}`
      };

      if (mockStatus.status === 'PAID') {
        mockStatus.paidTime = new Date().toISOString();
        mockStatus.paidAmount = 30000000; // Example amount
      }

      console.log('🔍 DOKU payment status:', mockStatus);
      return mockStatus;

    } catch (error) {
      console.error('DOKU status check error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calculate total cost including DOKU fee
   */
  calculateTotalCost(baseAmount, paymentMethod = 'virtual_account') {
    const fees = {
      virtual_account: 2500, // Cheapest VA fee in Indonesia
      ewallet_ovo: 1500,     // Cheapest e-wallet fee
      ewallet_dana: 1500,    // Same as OVO
      credit_card: Math.round(baseAmount * 0.025) // 2.5% for credit card
    };

    const fee = fees[paymentMethod] || fees.virtual_account;
    const total = baseAmount + fee;

    return {
      baseAmount: baseAmount,
      fee: fee,
      total: total,
      feePercentage: ((fee / baseAmount) * 100).toFixed(3)
    };
  }

  /**
   * Get payment methods with DOKU fees
   */
  getPaymentMethods() {
    return [
      {
        id: 'doku_va_bca',
        name: 'BCA Virtual Account',
        description: 'Transfer via Virtual Account BCA',
        icon: '🏦',
        fee: 'Rp 2.500',
        feeAmount: 2500,
        processingTime: 'Instan',
        provider: 'doku',
        recommended: true,
        cheapest: true
      },
      {
        id: 'doku_ewallet_ovo',
        name: 'OVO',
        description: 'Bayar dengan OVO (Termurah!)',
        icon: '📱',
        fee: 'Rp 1.500',
        feeAmount: 1500,
        processingTime: 'Instan',
        provider: 'doku',
        recommended: true,
        cheapest: true
      },
      {
        id: 'doku_ewallet_dana',
        name: 'DANA',
        description: 'Bayar dengan DANA (Termurah!)',
        icon: '📱',
        fee: 'Rp 1.500',
        feeAmount: 1500,
        processingTime: 'Instan',
        provider: 'doku',
        recommended: true,
        cheapest: true
      },
      {
        id: 'manual_transfer',
        name: 'Transfer Bank Manual',
        description: '100% GRATIS - Transfer langsung',
        icon: '🏦',
        fee: 'Gratis',
        feeAmount: 0,
        processingTime: '1-2 jam kerja',
        provider: 'manual',
        recommended: true,
        cheapest: true
      }
    ];
  }

  /**
   * Process payment based on method
   */
  async processPayment(paymentData) {
    const { paymentMethod } = paymentData;

    try {
      switch (paymentMethod) {
        case 'doku_va_bca':
          return await this.createVirtualAccount(paymentData);
        
        case 'doku_ewallet_ovo':
          return await this.createEwalletPayment(paymentData, 'OVO');
        
        case 'doku_ewallet_dana':
          return await this.createEwalletPayment(paymentData, 'DANA');
        
        case 'manual_transfer':
          return {
            success: true,
            paymentMethod: 'manual_transfer',
            bankDetails: {
              bankName: 'BCA',
              accountNumber: '1234567890',
              accountName: 'PT SentraBASE Indonesia',
              amount: paymentData.amount,
              fee: 0
            },
            instructions: [
              'Transfer ke rekening BCA di atas',
              `Nominal: Rp ${new Intl.NumberFormat('id-ID').format(paymentData.amount)}`,
              'Gunakan kode booking sebagai berita transfer',
              'Kirim bukti transfer via WhatsApp ke 082132115008',
              'Aktivasi dalam 1-2 jam kerja'
            ]
          };
        
        default:
          throw new Error('Payment method not supported');
      }
    } catch (error) {
      console.error('DOKU payment processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
const dokuPaymentService = new DokuPaymentService();
export default dokuPaymentService;
