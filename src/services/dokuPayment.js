// DOKU Payment Service (Local Indonesian Gateway)
import axios from 'axios';

class DOKUPaymentService {
  constructor() {
    this.clientId = process.env.VITE_DOKU_CLIENT_ID;
    this.sharedKey = process.env.VITE_DOKU_SHARED_KEY;
    this.baseURL = process.env.VITE_DOKU_SANDBOX === 'true' 
      ? 'https://api-sandbox.doku.com' 
      : 'https://api.doku.com';
    
    // DOKU Fee Structure (Competitive):
    this.feeStructure = {
      bca_va: 2500,        // Rp 2.500 (paling murah!)
      mandiri_va: 2500,    // Rp 2.500
      bni_va: 2500,        // Rp 2.500
      bri_va: 2500,        // Rp 2.500
      credit_card: 2.8,    // 2.8% (lebih murah dari Midtrans)
      ovo: 1500,           // Rp 1.500 (paling murah!)
      dana: 1500,          // Rp 1.500
      linkaja: 1500        // Rp 1.500
    };
  }

  // Create payment
  async createPayment(paymentData) {
    try {
      const { customerInfo, pricing, plan, paymentMethod } = paymentData;
      const orderId = `SENTRA-${Date.now()}`;

      const paymentRequest = {
        order: {
          invoice_number: orderId,
          amount: pricing.total,
          currency: 'IDR',
          callback_url: `${window.location.origin}/api/webhook/doku`,
          auto_redirect: true
        },
        payment: {
          payment_due_date: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
          payment_method_types: [this.mapPaymentMethod(paymentMethod.id)]
        },
        customer: {
          id: customerInfo.email,
          name: customerInfo.contactPerson,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address || '',
          country: 'ID'
        },
        additional_info: {
          integration: 'SNAP',
          success_redirect_url: `${window.location.origin}/payment/success`,
          failed_redirect_url: `${window.location.origin}/payment/failed`
        }
      };

      const response = await axios.post(
        `${this.baseURL}/v1/payment-codes`,
        paymentRequest,
        {
          headers: {
            'Authorization': `Basic ${btoa(this.clientId + ':' + this.sharedKey)}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: {
          payment_url: response.data.payment_url,
          order_id: orderId,
          amount: pricing.total,
          fee: this.getFee(paymentMethod.id, pricing.total)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Gagal membuat pembayaran'
      };
    }
  }

  // Map payment method
  mapPaymentMethod(methodId) {
    const mapping = {
      'bca_va': 'VIRTUAL_ACCOUNT_BCA',
      'mandiri_va': 'VIRTUAL_ACCOUNT_MANDIRI',
      'bni_va': 'VIRTUAL_ACCOUNT_BNI',
      'bri_va': 'VIRTUAL_ACCOUNT_BRI',
      'credit_card': 'CREDIT_CARD',
      'ovo': 'OVO',
      'dana': 'DANA',
      'linkaja': 'LINKAJA'
    };
    return mapping[methodId] || 'VIRTUAL_ACCOUNT_BCA';
  }

  // Get fee
  getFee(methodId, amount) {
    const feeRate = this.feeStructure[methodId];
    if (typeof feeRate === 'number' && feeRate < 10) {
      // Percentage fee
      return amount * (feeRate / 100);
    } else {
      // Fixed fee
      return feeRate || 0;
    }
  }
}

export default new DOKUPaymentService();
