import React, { createContext, useContext, useState, useReducer } from 'react';
import BCAPaymentService from '@/services/bcaPayment';
import ManualBankTransferService from '@/services/manualBankTransfer';
import XenditPaymentService from '@/services/xenditPayment';
import DOKUPaymentService from '@/services/dokuPayment';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};

// Payment reducer untuk manage state
const paymentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SELECTED_PLAN':
      return { ...state, selectedPlan: action.payload };
    case 'SET_BILLING_CYCLE':
      return { ...state, billingCycle: action.payload };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    case 'SET_PAYMENT_PROVIDER':
      return { ...state, paymentProvider: action.payload };
    case 'SET_CUSTOMER_INFO':
      return { ...state, customerInfo: { ...state.customerInfo, ...action.payload } };
    case 'SET_PAYMENT_STATUS':
      return { ...state, paymentStatus: action.payload };
    case 'SET_PAYMENT_DATA':
      return { ...state, paymentData: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_PAYMENT':
      return initialState;
    default:
      return state;
  }
};

const initialState = {
  selectedPlan: null,
  billingCycle: 'yearly',
  paymentMethod: null,
  paymentProvider: 'manual', // manual, midtrans, xendit, doku
  customerInfo: {
    clinicName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    taxId: ''
  },
  paymentStatus: 'idle',
  paymentData: null,
  loading: false,
  error: null
};

export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  // Payment providers dengan fee comparison
  const paymentProviders = [
    {
      id: 'manual',
      name: 'Transfer Bank Manual',
      description: '100% GRATIS - Tanpa fee apapun',
      fee: 'Gratis',
      processingTime: '1-2 jam kerja (manual verifikasi)',
      pros: ['100% gratis', 'Langsung ke rekening BCA', 'No setup fee'],
      cons: ['Manual verification', 'Lebih lambat'],
      recommended: true
    },
    {
      id: 'doku',
      name: 'DOKU Payment',
      description: 'Gateway lokal Indonesia - Fee terendah',
      fee: 'Rp 2.500 (BCA VA), Rp 1.500 (E-wallet)',
      processingTime: 'Instan',
      pros: ['Fee paling murah', 'Gateway lokal', 'Support lengkap'],
      cons: ['Perlu setup akun'],
      recommended: true
    },
    {
      id: 'xendit',
      name: 'Xendit',
      description: 'Fee lebih rendah dari Midtrans',
      fee: 'Rp 3.000 (BCA VA), Rp 2.000 (E-wallet)',
      processingTime: 'Instan',
      pros: ['Fee lebih murah dari Midtrans', 'API bagus', 'Dashboard lengkap'],
      cons: ['Perlu setup akun']
    },
    {
      id: 'midtrans',
      name: 'Midtrans',
      description: 'Gateway populer tapi fee lebih tinggi',
      fee: 'Rp 4.000 (BCA VA), Rp 2.500 (E-wallet)',
      processingTime: 'Instan',
      pros: ['Populer', 'Reliable', 'Support bagus'],
      cons: ['Fee lebih mahal']
    }
  ];

  // Payment methods dengan fee yang akurat
  const paymentMethods = [
    {
      id: 'manual_transfer',
      name: 'Transfer Bank Manual',
      description: '100% GRATIS - Transfer langsung ke rekening BCA',
      icon: '🏦',
      processingTime: '1-2 jam kerja',
      fee: 'Gratis',
      feeAmount: 0,
      recommended: true,
      provider: 'manual'
    },
    {
      id: 'bca_va',
      name: 'BCA Virtual Account',
      description: 'Otomatis via Virtual Account BCA',
      icon: '🏦',
      processingTime: 'Instan',
      fee: 'Rp 2.500 - Rp 4.000',
      feeAmount: 2500, // DOKU fee (terendah)
      provider: 'auto'
    },
    {
      id: 'bca_klikbca',
      name: 'BCA KlikBCA',
      description: 'Internet Banking BCA',
      icon: '💻',
      processingTime: 'Instan',
      fee: 'Gratis',
      feeAmount: 0,
      provider: 'auto'
    },
    {
      id: 'credit_card',
      name: 'Kartu Kredit',
      description: 'Visa, Mastercard, JCB',
      icon: '💳',
      processingTime: 'Instan',
      fee: '2.8% - 2.9%',
      feeAmount: 0.028, // Percentage
      provider: 'auto'
    },
    {
      id: 'ovo',
      name: 'OVO',
      description: 'E-wallet OVO',
      icon: '📱',
      processingTime: 'Instan',
      fee: 'Rp 1.500 - Rp 2.500',
      feeAmount: 1500, // DOKU fee (terendah)
      provider: 'auto'
    },
    {
      id: 'dana',
      name: 'DANA',
      description: 'E-wallet DANA',
      icon: '📱',
      processingTime: 'Instan',
      fee: 'Rp 1.500 - Rp 2.500',
      feeAmount: 1500, // DOKU fee (terendah)
      provider: 'auto'
    }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      id: 'starter',
      name: "Starter",
      subtitle: "Untuk Klinik Kecil",
      monthlyPrice: 1500000,
      yearlyPrice: 15000000,
      description: "Solusi RME dasar untuk klinik baru atau praktik mandiri",
      features: [
        "Manajemen Data Pasien",
        "Rekam Medis Elektronik",
        "Jadwal Dokter & Appointment",
        "Resep Digital",
        "Laporan Dasar",
        "Backup Data Harian",
        "Support Email",
        "1 User Admin"
      ],
      limits: {
        patients: 500,
        users: 3,
        storage: "10 GB"
      },
      popular: false,
      color: "gray"
    },
    {
      id: 'professional',
      name: "Professional",
      subtitle: "Untuk Klinik Berkembang",
      monthlyPrice: 3000000,
      yearlyPrice: 30000000,
      description: "Fitur lengkap dengan keamanan dan efisiensi maksimal",
      features: [
        "Semua fitur Starter",
        "Manajemen Inventory Obat",
        "Sistem Antrean Digital",
        "Billing & Invoicing",
        "Laporan Analitik Lanjutan",
        "Integrasi Lab & Radiologi",
        "Telemedicine Basic",
        "Multi-cabang (3 lokasi)",
        "Support Prioritas",
        "Unlimited Users"
      ],
      limits: {
        patients: 5000,
        users: "Unlimited",
        storage: "100 GB"
      },
      popular: true,
      color: "blue"
    },
    {
      id: 'enterprise',
      name: "Enterprise",
      subtitle: "Untuk Rumah Sakit",
      monthlyPrice: null,
      yearlyPrice: null,
      description: "Solusi kustom untuk rumah sakit dan jaringan klinik besar",
      features: [
        "Semua fitur Professional",
        "Customization Unlimited",
        "API Integration",
        "White-label Solution",
        "Dedicated Server",
        "24/7 Phone Support",
        "On-site Training",
        "SLA 99.9% Uptime",
        "Compliance Audit",
        "Disaster Recovery"
      ],
      limits: {
        patients: "Unlimited",
        users: "Unlimited",
        storage: "Unlimited"
      },
      popular: false,
      color: "purple"
    }
  ];

  // Actions
  const selectPlan = (plan) => {
    dispatch({ type: 'SET_SELECTED_PLAN', payload: plan });
  };

  const setBillingCycle = (cycle) => {
    dispatch({ type: 'SET_BILLING_CYCLE', payload: cycle });
  };

  const setPaymentMethod = (method) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const setPaymentProvider = (provider) => {
    dispatch({ type: 'SET_PAYMENT_PROVIDER', payload: provider });
  };

  const updateCustomerInfo = (info) => {
    dispatch({ type: 'SET_CUSTOMER_INFO', payload: info });
  };

  const calculatePrice = (plan, cycle) => {
    if (!plan || !plan.monthlyPrice) return 0;
    
    const basePrice = cycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    const tax = basePrice * 0.11; // PPN 11%
    
    return {
      basePrice,
      tax,
      total: basePrice + tax
    };
  };

  // Process payment dengan multiple providers dan error handling yang lebih baik
  const processPayment = async (paymentData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      console.log('🔄 Processing payment with data:', paymentData);
      let result;
      
      // Route ke provider yang sesuai dengan fallback
      switch (paymentData.paymentMethod.id) {
        case 'manual_transfer':
          console.log('📋 Using manual transfer service');
          try {
            result = ManualBankTransferService.generatePaymentInstructions(paymentData);
            console.log('✅ Manual transfer result:', result);
          } catch (error) {
            console.error('❌ Manual transfer error:', error);
            // Fallback to simple manual instructions
            result = {
              success: true,
              data: {
                orderId: `SENTRA-${Date.now()}`,
                totalAmount: paymentData.pricing.total + Math.floor(Math.random() * 900) + 100,
                bankAccounts: [{
                  bank: 'BCA',
                  accountNumber: '1234567890',
                  accountName: 'PT SENTRABASE INDONESIA'
                }],
                instructions: [
                  "1. Transfer ke rekening BCA di atas",
                  "2. Gunakan jumlah EXACT termasuk 3 digit kode unik",
                  "3. Simpan bukti transfer",
                  "4. Kirim bukti via WhatsApp ke 0812-3456-7890",
                  "5. Konfirmasi dalam 1-2 jam kerja"
                ],
                expiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
              }
            };
          }
          break;
          
        case 'bca_va':
        case 'ovo':
        case 'dana':
          console.log('🏦 Using DOKU service');
          try {
            result = await DOKUPaymentService.createPayment(paymentData);
            console.log('✅ DOKU result:', result);
          } catch (error) {
            console.error('❌ DOKU error:', error);
            // Fallback to manual transfer
            result = {
              success: true,
              data: {
                orderId: `SENTRA-${Date.now()}`,
                payment_url: null,
                fallback_to_manual: true,
                message: 'Sistem otomatis sedang maintenance. Silakan gunakan transfer manual.',
                bankAccounts: [{
                  bank: 'BCA',
                  accountNumber: '1234567890',
                  accountName: 'PT SENTRABASE INDONESIA'
                }]
              }
            };
          }
          break;
          
        default:
          console.log('💳 Using Midtrans service');
          try {
            result = await BCAPaymentService.createMidtransPayment(paymentData);
            console.log('✅ Midtrans result:', result);
          } catch (error) {
            console.error('❌ Midtrans error:', error);
            // Fallback to manual transfer
            result = {
              success: true,
              data: {
                orderId: `SENTRA-${Date.now()}`,
                payment_url: null,
                fallback_to_manual: true,
                message: 'Sistem otomatis sedang maintenance. Silakan gunakan transfer manual.',
                bankAccounts: [{
                  bank: 'BCA',
                  accountNumber: '1234567890',
                  accountName: 'PT SENTRABASE INDONESIA'
                }]
              }
            };
          }
      }
      
      console.log('📊 Final payment result:', result);
      
      if (result && result.success) {
        dispatch({ type: 'SET_PAYMENT_DATA', payload: result.data });
        dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'pending' });
        
        return { 
          success: true, 
          transactionId: result.data.orderId || result.data.order_id || `SENTRA-${Date.now()}`,
          paymentData: result.data,
          message: result.data.fallback_to_manual 
            ? 'Menggunakan transfer manual sebagai alternatif'
            : paymentData.paymentMethod.id === 'manual_transfer' 
            ? 'Instruksi transfer manual telah dibuat'
            : 'Pembayaran berhasil dibuat. Silakan selesaikan pembayaran.'
        };
      } else {
        throw new Error(result?.error || 'Gagal memproses pembayaran');
      }
    } catch (error) {
      console.error('❌ Payment processing error:', error);
      
      // Ultimate fallback - always provide manual transfer option
      const fallbackResult = {
        success: true,
        transactionId: `SENTRA-${Date.now()}`,
        paymentData: {
          orderId: `SENTRA-${Date.now()}`,
          totalAmount: paymentData.pricing.total + Math.floor(Math.random() * 900) + 100,
          bankAccounts: [{
            bank: 'BCA',
            accountNumber: '1234567890',
            accountName: 'PT SENTRABASE INDONESIA',
            branch: 'KCP Jakarta Sudirman'
          }],
          instructions: [
            "1. Transfer ke rekening BCA di atas",
            "2. Gunakan jumlah EXACT termasuk 3 digit kode unik",
            "3. Simpan bukti transfer",
            "4. Kirim bukti via WhatsApp ke 0812-3456-7890",
            "5. Konfirmasi dalam 1-2 jam kerja",
            "6. Akun RME akan diaktivasi setelah konfirmasi"
          ],
          expiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
          fallback_to_manual: true
        },
        message: 'Menggunakan transfer manual (100% gratis) sebagai alternatif'
      };
      
      dispatch({ type: 'SET_PAYMENT_DATA', payload: fallbackResult.paymentData });
      dispatch({ type: 'SET_PAYMENT_STATUS', payload: 'pending' });
      dispatch({ type: 'SET_ERROR', payload: null }); // Clear error since we have fallback
      
      return fallbackResult;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const checkPaymentStatus = async (orderId) => {
    // Implementation untuk check status
    return { success: true, status: 'pending' };
  };

  const resetPayment = () => {
    dispatch({ type: 'RESET_PAYMENT' });
  };

  const value = {
    ...state,
    paymentMethods,
    paymentProviders,
    pricingPlans,
    selectPlan,
    setBillingCycle,
    setPaymentMethod,
    setPaymentProvider,
    updateCustomerInfo,
    calculatePrice,
    processPayment,
    checkPaymentStatus,
    resetPayment
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;
