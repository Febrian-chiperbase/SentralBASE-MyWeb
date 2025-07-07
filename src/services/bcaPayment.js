// BCA Payment Integration Service
import axios from 'axios';

class BCAPaymentService {
  constructor() {
    // BCA API Configuration
    this.baseURL = process.env.VITE_BCA_API_URL || 'https://sandbox.bca.co.id/api';
    this.clientId = process.env.VITE_BCA_CLIENT_ID;
    this.clientSecret = process.env.VITE_BCA_CLIENT_SECRET;
    this.merchantId = process.env.VITE_BCA_MERCHANT_ID;
    this.accountNumber = process.env.VITE_BCA_ACCOUNT_NUMBER; // Rekening BCA Anda
    
    // Midtrans Configuration (Alternative yang lebih mudah)
    this.midtransServerKey = process.env.VITE_MIDTRANS_SERVER_KEY;
    this.midtransClientKey = process.env.VITE_MIDTRANS_CLIENT_KEY;
    this.midtransBaseURL = process.env.VITE_MIDTRANS_SANDBOX === 'true' 
      ? 'https://api.sandbox.midtrans.com/v2' 
      : 'https://api.midtrans.com/v2';
  }

  // Generate BCA Virtual Account
  async createBCAVirtualAccount(paymentData) {
    try {
      const { customerInfo, pricing, plan } = paymentData;
      
      const vaRequest = {
        merchant_id: this.merchantId,
        customer_name: customerInfo.clinicName,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        amount: pricing.total,
        currency: 'IDR',
        order_id: `SENTRA-${Date.now()}`,
        description: `Paket ${plan.name} - SentraBASE RME`,
        callback_url: `${window.location.origin}/payment/callback`,
        return_url: `${window.location.origin}/payment/success`,
        expired_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 jam
        destination_account: this.accountNumber // Rekening BCA tujuan
      };

      const response = await axios.post(`${this.baseURL}/va/create`, vaRequest, {
        headers: {
          'Authorization': `Bearer ${await this.getBCAToken()}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        data: {
          va_number: response.data.va_number,
          amount: response.data.amount,
          expired_time: response.data.expired_time,
          qr_code: response.data.qr_code,
          payment_url: response.data.payment_url
        }
      };
    } catch (error) {
      console.error('BCA VA Creation Error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal membuat Virtual Account BCA'
      };
    }
  }

  // Midtrans Integration (Recommended - Lebih mudah dan reliable)
  async createMidtransPayment(paymentData) {
    try {
      const { customerInfo, pricing, plan, paymentMethod } = paymentData;
      
      const transactionDetails = {
        transaction_details: {
          order_id: `SENTRA-${Date.now()}`,
          gross_amount: pricing.total
        },
        customer_details: {
          first_name: customerInfo.contactPerson,
          email: customerInfo.email,
          phone: customerInfo.phone,
          billing_address: {
            address: customerInfo.address || '',
            city: customerInfo.city || '',
            postal_code: customerInfo.postalCode || ''
          }
        },
        item_details: [{
          id: plan.id,
          price: pricing.basePrice,
          quantity: 1,
          name: `Paket ${plan.name} - SentraBASE RME`,
          category: 'Healthcare Software'
        }, {
          id: 'tax',
          price: pricing.tax,
          quantity: 1,
          name: 'PPN 11%',
          category: 'Tax'
        }],
        enabled_payments: this.getEnabledPayments(paymentMethod),
        callbacks: {
          finish: `${window.location.origin}/payment/success`,
          error: `${window.location.origin}/payment/error`,
          pending: `${window.location.origin}/payment/pending`
        },
        expiry: {
          duration: 24,
          unit: 'hours'
        },
        custom_field1: customerInfo.clinicName,
        custom_field2: plan.name,
        custom_field3: this.accountNumber // Untuk tracking ke rekening mana
      };

      const response = await axios.post(
        `${this.midtransBaseURL}/charge`,
        transactionDetails,
        {
          headers: {
            'Authorization': `Basic ${btoa(this.midtransServerKey + ':')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: {
          token: response.data.token,
          redirect_url: response.data.redirect_url,
          va_numbers: response.data.va_numbers,
          payment_type: response.data.payment_type,
          transaction_id: response.data.transaction_id,
          order_id: response.data.order_id
        }
      };
    } catch (error) {
      console.error('Midtrans Payment Error:', error);
      return {
        success: false,
        error: error.response?.data?.error_messages?.[0] || 'Gagal membuat pembayaran'
      };
    }
  }

  // Get BCA OAuth Token
  async getBCAToken() {
    try {
      const response = await axios.post(`${this.baseURL}/oauth/token`, {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret
      });
      
      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to get BCA token');
    }
  }

  // Configure payment methods based on selection
  getEnabledPayments(paymentMethod) {
    const paymentMethods = [];
    
    switch (paymentMethod.id) {
      case 'bca_va':
        paymentMethods.push('bca_va');
        break;
      case 'bank_transfer':
        paymentMethods.push('bank_transfer');
        break;
      case 'credit_card':
        paymentMethods.push('credit_card');
        break;
      case 'gopay':
        paymentMethods.push('gopay');
        break;
      case 'ovo':
        paymentMethods.push('ovo');
        break;
      case 'dana':
        paymentMethods.push('dana');
        break;
      default:
        // Enable all BCA methods by default
        paymentMethods.push('bca_va', 'bca_klikbca', 'bca_klikpay');
    }
    
    return paymentMethods;
  }

  // Check payment status
  async checkPaymentStatus(orderId) {
    try {
      const response = await axios.get(
        `${this.midtransBaseURL}/${orderId}/status`,
        {
          headers: {
            'Authorization': `Basic ${btoa(this.midtransServerKey + ':')}`
          }
        }
      );

      return {
        success: true,
        status: response.data.transaction_status,
        payment_type: response.data.payment_type,
        gross_amount: response.data.gross_amount,
        transaction_time: response.data.transaction_time,
        settlement_time: response.data.settlement_time
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to check payment status'
      };
    }
  }

  // Handle payment notification/webhook
  async handlePaymentNotification(notification) {
    try {
      const {
        order_id,
        transaction_status,
        payment_type,
        gross_amount,
        signature_key
      } = notification;

      // Verify signature (important for security)
      const expectedSignature = this.generateSignature(order_id, transaction_status, gross_amount);
      
      if (signature_key !== expectedSignature) {
        throw new Error('Invalid signature');
      }

      // Process based on transaction status
      switch (transaction_status) {
        case 'settlement':
        case 'capture':
          // Payment successful - uang sudah masuk ke rekening
          await this.handleSuccessfulPayment(order_id, notification);
          break;
        case 'pending':
          // Payment pending - waiting for customer action
          await this.handlePendingPayment(order_id, notification);
          break;
        case 'deny':
        case 'cancel':
        case 'expire':
          // Payment failed
          await this.handleFailedPayment(order_id, notification);
          break;
      }

      return { success: true };
    } catch (error) {
      console.error('Payment notification error:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate signature for verification
  generateSignature(orderId, status, amount) {
    const string = orderId + status + amount + this.midtransServerKey;
    return require('crypto').createHash('sha512').update(string).digest('hex');
  }

  // Handle successful payment
  async handleSuccessfulPayment(orderId, notification) {
    console.log('💰 Payment successful! Money transferred to BCA account:', {
      orderId,
      amount: notification.gross_amount,
      paymentType: notification.payment_type,
      settlementTime: notification.settlement_time
    });

    // Here you can:
    // 1. Update database
    // 2. Send confirmation email
    // 3. Activate user account
    // 4. Send notification to admin
    
    // Example: Send email notification
    await this.sendPaymentConfirmation(orderId, notification);
  }

  // Send payment confirmation
  async sendPaymentConfirmation(orderId, notification) {
    // Implementation for sending email/SMS confirmation
    console.log('📧 Sending payment confirmation for order:', orderId);
  }

  // Handle pending payment
  async handlePendingPayment(orderId, notification) {
    console.log('⏳ Payment pending for order:', orderId);
  }

  // Handle failed payment
  async handleFailedPayment(orderId, notification) {
    console.log('❌ Payment failed for order:', orderId);
  }
}

export default new BCAPaymentService();
