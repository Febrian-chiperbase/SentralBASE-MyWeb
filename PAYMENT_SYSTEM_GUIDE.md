# 💳 Payment System Guide - SentraBASE

## 📋 Overview
Sistem pembayaran lengkap untuk platform SentraBASE yang mendukung berbagai metode pembayaran Indonesia dan proses checkout yang user-friendly untuk klinik dan rumah sakit.

## ✅ Fitur Payment System

### 1. **Multi-Step Checkout Process**
- ✅ Step 1: Informasi Klinik & Penanggung Jawab
- ✅ Step 2: Pilihan Metode Pembayaran
- ✅ Step 3: Konfirmasi & Review Pesanan
- ✅ Validasi form real-time
- ✅ Progress indicator yang jelas

### 2. **Metode Pembayaran Lengkap**
```javascript
// Metode pembayaran yang didukung:
- Bank Transfer (Manual)
- Virtual Account (BCA, Mandiri, BNI, BRI)
- Kartu Kredit (Visa, Mastercard, JCB)
- E-Wallet (GoPay, OVO, DANA)
- Biaya admin transparan
- Processing time yang jelas
```

### 3. **Pricing Plans untuk Healthcare**
```javascript
// Paket khusus untuk industri kesehatan:
Starter (Rp 1.5jt/bulan):
- Untuk klinik kecil
- 500 pasien, 3 users, 10GB storage
- Fitur RME dasar

Professional (Rp 3jt/bulan):
- Untuk klinik berkembang  
- 5000 pasien, unlimited users, 100GB
- Fitur lengkap + telemedicine

Enterprise (Custom):
- Untuk rumah sakit
- Unlimited semua
- Customization & dedicated support
```

### 4. **Smart Pricing Features**
- ✅ Toggle bulanan/tahunan dengan discount 17%
- ✅ Kalkulasi PPN 11% otomatis
- ✅ Biaya payment gateway transparan
- ✅ Format mata uang Indonesia (IDR)

## 🛠️ Cara Menggunakan Payment System

### Basic Implementation
```jsx
import { PaymentProvider, usePayment } from '@/contexts/PaymentContext';

function App() {
  return (
    <PaymentProvider>
      <PricingSection />
    </PaymentProvider>
  );
}

function PricingSection() {
  const { selectPlan, pricingPlans } = usePayment();
  
  return (
    <div>
      {pricingPlans.map(plan => (
        <PlanCard 
          key={plan.id}
          plan={plan}
          onSelect={() => selectPlan(plan)}
        />
      ))}
    </div>
  );
}
```

### Advanced Usage dengan Custom Validation
```jsx
import { usePayment } from '@/contexts/PaymentContext';
import { validatePaymentData } from '@/utils/paymentUtils';

function CheckoutForm() {
  const { 
    selectedPlan, 
    customerInfo, 
    updateCustomerInfo,
    processPayment 
  } = usePayment();

  const handleSubmit = async () => {
    const validation = validatePaymentData({
      plan: selectedPlan,
      customerInfo,
      paymentMethod
    });
    
    if (validation.isValid) {
      const result = await processPayment(paymentData);
      // Handle result
    }
  };
}
```

## 💰 Payment Flow Architecture

### 1. **State Management**
```javascript
// PaymentContext mengelola:
- selectedPlan: Paket yang dipilih
- billingCycle: monthly/yearly
- paymentMethod: Metode pembayaran
- customerInfo: Data klinik & kontak
- paymentStatus: idle/processing/success/failed
```

### 2. **Validation Pipeline**
```javascript
// Multi-layer validation:
1. Real-time form validation
2. Payment data validation
3. Payment gateway validation
4. Server-side verification (future)
```

### 3. **Payment Processing**
```javascript
// Payment flow:
1. Collect customer information
2. Select payment method
3. Calculate total (base + tax + fees)
4. Process payment via gateway
5. Send confirmation & invoice
6. Schedule onboarding
```

## 🔧 Configuration & Customization

### Environment Variables
```env
# Payment Gateway Configuration
VITE_PAYMENT_GATEWAY_URL=https://api.payment-gateway.com
VITE_MERCHANT_ID=your-merchant-id
VITE_API_KEY=your-api-key

# Pricing Configuration
VITE_TAX_RATE=0.11
VITE_CURRENCY=IDR
VITE_DEFAULT_BILLING_CYCLE=yearly
```

### Pricing Customization
```javascript
// Edit /src/contexts/PaymentContext.jsx
const pricingPlans = [
  {
    id: 'custom-plan',
    name: 'Custom Plan',
    monthlyPrice: 5000000,
    yearlyPrice: 50000000,
    features: ['Custom features'],
    limits: {
      patients: 'unlimited',
      users: 'unlimited',
      storage: '1TB'
    }
  }
];
```

## 📊 Payment Analytics & Tracking

### Conversion Tracking
```javascript
// Google Analytics events
gtag('event', 'begin_checkout', {
  currency: 'IDR',
  value: pricing.total,
  items: [{
    item_id: selectedPlan.id,
    item_name: selectedPlan.name,
    category: 'Healthcare Software',
    quantity: 1,
    price: pricing.basePrice
  }]
});

gtag('event', 'purchase', {
  transaction_id: transactionId,
  value: pricing.total,
  currency: 'IDR'
});
```

### Payment Method Analytics
```javascript
// Track payment method preferences
const paymentMethodStats = {
  bank_transfer: 45%, // Most popular for B2B
  virtual_account: 30%,
  credit_card: 15%,
  e_wallet: 10%
};
```

## 🔒 Security & Compliance

### Data Protection
- ✅ PCI DSS compliance ready
- ✅ Encrypted payment data
- ✅ No card data storage
- ✅ Secure payment gateway integration

### Healthcare Compliance
- ✅ HIPAA-ready infrastructure
- ✅ Indonesian healthcare regulations
- ✅ Data residency compliance
- ✅ Audit trail untuk transactions

## 📱 Mobile Payment Experience

### Mobile-First Design
- ✅ Touch-friendly payment forms
- ✅ Mobile wallet integration
- ✅ Responsive checkout flow
- ✅ One-handed operation support

### Progressive Web App Features
- ✅ Offline payment form caching
- ✅ Push notifications untuk payment status
- ✅ Add to home screen capability

## 🚀 Integration dengan Payment Gateways

### Supported Gateways
```javascript
// Indonesian Payment Gateways:
1. Midtrans (Recommended)
   - Virtual Account semua bank
   - Credit card processing
   - E-wallet integration

2. Xendit
   - Comprehensive payment methods
   - Good API documentation
   - Competitive pricing

3. DOKU
   - Local Indonesian gateway
   - Government-friendly
   - Bank partnerships

4. OVO for Business
   - Direct OVO integration
   - Instant settlement
   - QR code payments
```

### Gateway Integration Example
```javascript
// Midtrans integration
import { snap } from '@/utils/midtrans';

const processPayment = async (paymentData) => {
  const snapToken = await createSnapToken(paymentData);
  
  snap.pay(snapToken, {
    onSuccess: (result) => {
      handlePaymentSuccess(result);
    },
    onPending: (result) => {
      handlePaymentPending(result);
    },
    onError: (result) => {
      handlePaymentError(result);
    }
  });
};
```

## 📈 Business Intelligence & Reporting

### Revenue Analytics
- 📊 Monthly Recurring Revenue (MRR)
- 📈 Annual Recurring Revenue (ARR)
- 💰 Customer Lifetime Value (CLV)
- 📉 Churn rate tracking

### Payment Insights
- 🏥 Revenue by clinic size
- 📍 Geographic revenue distribution
- 💳 Payment method preferences
- ⏰ Payment timing patterns

## 🎯 Future Enhancements

### Short Term (1-2 bulan)
1. ✅ Real payment gateway integration
2. ✅ Automated invoice generation
3. ✅ Payment reminder system
4. ✅ Refund management

### Medium Term (3-6 bulan)
1. 📱 Mobile app payment integration
2. 🔄 Subscription management portal
3. 💰 Dynamic pricing based on usage
4. 🎁 Promotional codes & discounts

### Long Term (6-12 bulan)
1. 🤖 AI-powered pricing optimization
2. 🌐 Multi-currency support
3. 🏦 Direct bank integration
4. 📊 Advanced payment analytics

## 📞 Support & Troubleshooting

### Common Issues
```javascript
// Payment failures:
1. Invalid card details → Clear error messages
2. Insufficient funds → Suggest alternative methods
3. Network timeout → Retry mechanism
4. Gateway downtime → Fallback options
```

### Customer Support Integration
- 💬 Live chat untuk payment issues
- 📞 Dedicated payment support line
- 📧 Email support dengan SLA
- 🎥 Video call untuk complex issues

## 📚 Resources & Documentation

### Developer Resources
- `/docs/payment-api/` - API documentation
- `/examples/payment/` - Code examples
- `/tests/payment/` - Test cases
- Payment gateway documentation links

### Business Resources
- Pricing strategy guidelines
- Payment method recommendations
- Conversion optimization tips
- Healthcare industry best practices

---

**Payment Focus:** Healthcare RME Solutions
**Target Market:** Klinik, Rumah Sakit, Praktik Medis
**Last Updated:** January 2025
**Maintained by:** SentraBASE Payment Team
