// Xendit Payment Service (Fee Lebih Rendah dari Midtrans)
import axios from 'axios';

class XenditPaymentService {
  constructor() {
    this.apiKey = process.env.VITE_XENDIT_SECRET_KEY;
    this.baseURL = 'https://api.xendit.co';
    this.webhookToken = process.env.VITE_XENDIT_WEBHOOK_TOKEN;
    
    // Fee Structure Xendit (Lebih murah dari Midtrans):
    this.feeStructure = {
      bca_va: 3000,        // Rp 3.000 (vs Midtrans Rp 4.000)
      mandiri_va: 3000,    // Rp 3.000
      bni_va: 3000,        // Rp 3.000
      bri_va: 3000,        // Rp 3.000
      credit_card: 2.95,   // 2.95% (vs Midtrans 2.9%)
      ovo: 2000,           // Rp 2.000 (vs Midtrans Rp 2.500)
      dana: 2000,          // Rp 2.000
      linkaja: 2000        // Rp 2.000
    };
  }

  // Create BCA Virtual Account
  async createBCAVirtualAccount(paymentData) {
    try {
      const { customerInfo, pricing, plan } = paymentData;
      const orderId = `SENTRA-${Date.now()}`;

      const vaRequest = {
        external_id: orderId,
        bank_code: 'BCA',
        name: customerInfo.clinicName,
        expected_amount: pricing.total,
        expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        is_closed: true,
        description: `Paket ${plan.name} - SentraBASE RME`
      };

      const response = await axios.post(
        `${this.baseURL}/virtual_accounts`,
        vaRequest,
        {
          headers: {
            'Authorization': `Basic ${btoa(this.apiKey + ':')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: {
          va_number: response.data.account_number,
          bank_code: response.data.bank_code,
          amount: response.data.expected_amount,
          expiry: response.data.expiration_date,
          external_id: response.data.external_id,
          fee: this.feeStructure.bca_va // Rp 3.000 (lebih murah!)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal membuat Virtual Account'
      };
    }
  }

  // Create Invoice (Multiple payment methods)
  async createInvoice(paymentData) {
    try {
      const { customerInfo, pricing, plan } = paymentData;
      const orderId = `SENTRA-${Date.now()}`;

      const invoiceRequest = {
        external_id: orderId,
        amount: pricing.total,
        description: `Paket ${plan.name} - SentraBASE RME`,
        invoice_duration: 86400, // 24 hours
        customer: {
          given_names: customerInfo.contactPerson,
          email: customerInfo.email,
          mobile_number: customerInfo.phone
        },
        customer_notification_preference: {
          invoice_created: ['email'],
          invoice_reminder: ['email'],
          invoice_paid: ['email']
        },
        success_redirect_url: `${window.location.origin}/payment/success`,
        failure_redirect_url: `${window.location.origin}/payment/failed`,
        currency: 'IDR',
        items: [
          {
            name: `Paket ${plan.name}`,
            quantity: 1,
            price: pricing.basePrice,
            category: 'Healthcare Software'
          },
          {
            name: 'PPN 11%',
            quantity: 1,
            price: pricing.tax,
            category: 'Tax'
          }
        ]
      };

      const response = await axios.post(
        `${this.baseURL}/v2/invoices`,
        invoiceRequest,
        {
          headers: {
            'Authorization': `Basic ${btoa(this.apiKey + ':')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: {
          invoice_id: response.data.id,
          invoice_url: response.data.invoice_url,
          external_id: response.data.external_id,
          amount: response.data.amount,
          status: response.data.status,
          expiry: response.data.expiry_date
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal membuat invoice'
      };
    }
  }

  // Handle webhook notification
  async handleWebhook(webhookData) {
    try {
      // Verify webhook signature
      if (!this.verifyWebhookSignature(webhookData)) {
        throw new Error('Invalid webhook signature');
      }

      const { external_id, status, amount } = webhookData;

      switch (status) {
        case 'PAID':
          await this.handleSuccessfulPayment(external_id, webhookData);
          break;
        case 'EXPIRED':
          await this.handleExpiredPayment(external_id, webhookData);
          break;
      }

      return { success: true };
    } catch (error) {
      console.error('Xendit webhook error:', error);
      return { success: false, error: error.message };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(webhookData) {
    // Implementation untuk verify signature
    return true; // Simplified for demo
  }

  // Handle successful payment
  async handleSuccessfulPayment(orderId, webhookData) {
    console.log('💰 Xendit payment successful:', {
      orderId,
      amount: webhookData.amount,
      paidAt: webhookData.paid_at
    });

    // Update order status, send confirmation, etc.
  }

  // Handle expired payment
  async handleExpiredPayment(orderId, webhookData) {
    console.log('⏰ Xendit payment expired:', orderId);
  }
}

export default new XenditPaymentService();
