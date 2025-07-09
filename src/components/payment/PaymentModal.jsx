import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, CreditCard, Building, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePayment } from '@/contexts/PaymentContext';
import { toast } from '@/components/ui/use-toast';
import PaymentSuccess from './PaymentSuccess';

const PaymentModal = ({ isOpen, onClose }) => {
  const {
    selectedPlan,
    billingCycle,
    paymentMethod,
    customerInfo,
    paymentMethods,
    loading,
    error,
    setPaymentMethod,
    updateCustomerInfo,
    calculatePrice,
    processPayment
  } = usePayment();

  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  // Show PaymentSuccess if payment completed
  if (paymentCompleted && transactionData) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <PaymentSuccess 
                transactionData={transactionData} 
                onClose={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!isOpen || !selectedPlan) return null;

  const pricing = calculatePrice(selectedPlan, billingCycle);
  const steps = ['Informasi Klinik', 'Metode Pembayaran', 'Konfirmasi'];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const validateForm = () => {
    const errors = {};
    const required = ['clinicName', 'contactPerson', 'email', 'phone'];
    
    console.log('Validating form with customerInfo:', customerInfo);
    
    required.forEach(field => {
      if (!customerInfo[field]?.trim()) {
        errors[field] = 'Field ini wajib diisi';
      }
    });

    if (customerInfo.email && !/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = 'Format email tidak valid';
    }

    if (customerInfo.phone && !/^(\+62|62|0)[0-9]{9,13}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      errors.phone = 'Format nomor telepon tidak valid';
    }

    console.log('Validation errors:', errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    console.log('🔄 handleNext called, currentStep:', currentStep);
    console.log('📋 customerInfo:', customerInfo);
    console.log('💳 paymentMethod:', paymentMethod);
    
    if (currentStep === 1) {
      // Validate form on step 1
      if (!validateForm()) {
        console.log('❌ Form validation failed');
        toast({
          title: "Form Tidak Lengkap",
          description: "Mohon lengkapi semua field yang wajib diisi",
          variant: "destructive"
        });
        return;
      }
      console.log('✅ Form validation passed');
    }
    
    if (currentStep === 2) {
      // Validate payment method selection on step 2
      if (!paymentMethod) {
        console.log('❌ No payment method selected');
        toast({
          title: "Pilih Metode Pembayaran",
          description: "Silakan pilih metode pembayaran terlebih dahulu",
          variant: "destructive"
        });
        return;
      }
      console.log('✅ Payment method selected:', paymentMethod.name);
    }
    
    // Move to next step
    const nextStep = Math.min(currentStep + 1, 3);
    console.log('➡️ Moving to step:', nextStep);
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field, value) => {
    updateCustomerInfo({ [field]: value });
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePayment = async () => {
    const paymentData = {
      plan: selectedPlan,
      billingCycle,
      paymentMethod,
      customerInfo,
      pricing
    };

    const result = await processPayment(paymentData);
    
    if (result.success) {
      // Prepare transaction data for PaymentSuccess component
      const transactionInfo = {
        transactionId: result.transactionId || `TXN-${Date.now()}`,
        customerInfo: customerInfo,
        plan: selectedPlan,
        pricing: pricing,
        paymentMethod: paymentMethod,
        timestamp: new Date().toISOString()
      };
      
      setTransactionData(transactionInfo);
      setPaymentCompleted(true);
      
      // Track payment completion
      if (window.trackCustomerActivity) {
        window.trackCustomerActivity({
          type: 'payment_completed',
          customerInfo: customerInfo,
          plan: selectedPlan,
          amount: pricing.total,
          timestamp: Date.now()
        });
      }
    } else {
      toast({
        title: "Pembayaran Gagal",
        description: result.error || "Terjadi kesalahan, silakan coba lagi",
        variant: "destructive"
      });
    }
  };

  const getPaymentIcon = (methodId) => {
    switch (methodId) {
      case 'bank_transfer':
      case 'virtual_account':
        return <Building className="w-6 h-6" />;
      case 'credit_card':
        return <CreditCard className="w-6 h-6" />;
      default:
        return <Smartphone className="w-6 h-6" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-white">Checkout - {selectedPlan.name}</h2>
              <p className="text-gray-400">Step {currentStep} dari {steps.length}: {steps[currentStep - 1]}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-slate-900">
            <div className="flex items-center">
              {steps.map((step, index) => (
                <React.Fragment key={index}>
                  <div className={`flex items-center ${index + 1 <= currentStep ? 'text-cyan-400' : 'text-gray-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      index + 1 <= currentStep ? 'bg-cyan-500 text-white' : 'bg-gray-600'
                    }`}>
                      {index + 1 < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className="ml-2 text-sm font-medium">{step}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${index + 1 < currentStep ? 'bg-cyan-500' : 'bg-gray-600'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="flex min-h-full">
              {/* Main Content */}
              <div className="flex-1 p-6">
                {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Informasi Klinik</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clinicName" className="text-gray-300">Nama Klinik *</Label>
                      <Input
                        id="clinicName"
                        value={customerInfo.clinicName}
                        onChange={(e) => handleInputChange('clinicName', e.target.value)}
                        className={`bg-slate-700 border-slate-600 text-white ${formErrors.clinicName ? 'border-red-500' : ''}`}
                        placeholder="Klinik Sehat Bersama"
                      />
                      {formErrors.clinicName && <p className="text-red-400 text-sm mt-1">{formErrors.clinicName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="contactPerson" className="text-gray-300">Nama Penanggung Jawab *</Label>
                      <Input
                        id="contactPerson"
                        value={customerInfo.contactPerson}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        className={`bg-slate-700 border-slate-600 text-white ${formErrors.contactPerson ? 'border-red-500' : ''}`}
                        placeholder="Dr. John Doe"
                      />
                      {formErrors.contactPerson && <p className="text-red-400 text-sm mt-1">{formErrors.contactPerson}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`bg-slate-700 border-slate-600 text-white ${formErrors.email ? 'border-red-500' : ''}`}
                        placeholder="admin@kliniksehat.com"
                      />
                      {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-300">Nomor Telepon *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`bg-slate-700 border-slate-600 text-white ${formErrors.phone ? 'border-red-500' : ''}`}
                        placeholder="0812-3456-7890"
                      />
                      {formErrors.phone && <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="text-gray-300">Alamat Klinik</Label>
                      <Input
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Jl. Kesehatan No. 123"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-gray-300">Kota</Label>
                      <Input
                        id="city"
                        value={customerInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="Jakarta"
                      />
                    </div>

                    <div>
                      <Label htmlFor="taxId" className="text-gray-300">NPWP (Opsional)</Label>
                      <Input
                        id="taxId"
                        value={customerInfo.taxId}
                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="12.345.678.9-012.345"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Pilih Metode Pembayaran</h3>
                  
                  <div className="grid gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          paymentMethod?.id === method.id
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{method.icon}</div>
                            <div>
                              <h4 className="font-semibold text-white">{method.name}</h4>
                              <p className="text-sm text-gray-400">{method.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Biaya: {method.fee}</p>
                            <p className="text-xs text-gray-500">{method.processingTime}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Konfirmasi Pemesanan</h3>
                  
                  <div className="bg-slate-700 rounded-lg p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Klinik:</span>
                      <span className="text-white font-semibold">{customerInfo.clinicName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Paket:</span>
                      <span className="text-white font-semibold">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Billing:</span>
                      <span className="text-white">{billingCycle === 'yearly' ? 'Tahunan' : 'Bulanan'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Metode Pembayaran:</span>
                      <span className="text-white">{paymentMethod?.name}</span>
                    </div>
                    <hr className="border-slate-600" />
                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal:</span>
                      <span className="text-white">{formatPrice(pricing.basePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">PPN 11%:</span>
                      <span className="text-white">{formatPrice(pricing.tax)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total:</span>
                      <span className="text-cyan-400">{formatPrice(pricing.total)}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                      <span className="text-red-400">{error}</span>
                    </div>
                  )}
                </motion.div>
              )}
              </div>

              {/* Sidebar - Order Summary */}
              <div className="w-80 bg-slate-900 p-6 border-l border-slate-700 min-h-full">
                <div className="sticky top-0">
                  <h4 className="text-lg font-semibold text-white mb-4">Ringkasan Pesanan</h4>
              
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <h5 className="font-semibold text-cyan-400">{selectedPlan.name}</h5>
                  <p className="text-sm text-gray-400 mb-2">{selectedPlan.subtitle}</p>
                  <div className="text-2xl font-bold text-white">
                    {selectedPlan.monthlyPrice ? formatPrice(billingCycle === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice) : 'Custom'}
                  </div>
                  <p className="text-sm text-gray-400">
                    {selectedPlan.monthlyPrice ? `/${billingCycle === 'yearly' ? 'tahun' : 'bulan'}` : 'Hubungi Sales'}
                  </p>
                </div>

                {selectedPlan.monthlyPrice && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal:</span>
                      <span>{formatPrice(pricing.basePrice)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>PPN 11%:</span>
                      <span>{formatPrice(pricing.tax)}</span>
                    </div>
                    <hr className="border-slate-700" />
                    <div className="flex justify-between text-lg font-bold text-white">
                      <span>Total:</span>
                      <span className="text-cyan-400">{formatPrice(pricing.total)}</span>
                    </div>
                  </div>
                )}

                  <div className="text-xs text-gray-500 bg-slate-800 p-3 rounded">
                    <p>✓ Garansi uang kembali 30 hari</p>
                    <p>✓ Setup dan training gratis</p>
                    <p>✓ Support 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Navigation Buttons */}
          <div className="flex items-center justify-between p-6 border-t border-slate-700 bg-slate-900 flex-shrink-0">
            {/* Back Button */}
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentStep === 1}
              className="border-slate-600 text-gray-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>

            {/* Next/Submit Button */}
            <div className="flex items-center space-x-3">
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-2 font-semibold shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Validating...
                    </>
                  ) : (
                    <>
                      Lanjutkan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handlePayment}
                  disabled={loading || !paymentMethod}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Bayar Sekarang
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
