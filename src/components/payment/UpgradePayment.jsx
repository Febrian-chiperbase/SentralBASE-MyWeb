import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Check, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/contexts/PaymentContext';

const UpgradePayment = () => {
  const [upgradeContext, setUpgradeContext] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { paymentMethods, processPayment } = usePayment();

  useEffect(() => {
    // Get upgrade context from localStorage
    const pendingUpgrade = localStorage.getItem('pendingUpgrade');
    if (pendingUpgrade) {
      setUpgradeContext(JSON.parse(pendingUpgrade));
    } else {
      // If no upgrade context, redirect back to dashboard
      window.location.href = '/dashboard';
    }
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const calculateUpgradeCost = () => {
    if (!upgradeContext) return 0;
    return upgradeContext.toPackage.price - upgradeContext.fromPackage.price;
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !upgradeContext) return;

    setIsProcessing(true);

    try {
      const upgradeCost = calculateUpgradeCost();
      
      const paymentData = {
        type: 'upgrade',
        fromPackage: upgradeContext.fromPackage,
        toPackage: upgradeContext.toPackage,
        amount: upgradeCost,
        paymentMethod: selectedPaymentMethod,
        customerId: upgradeContext.customerId,
        upgradeDate: new Date().toISOString()
      };

      const result = await processPayment(paymentData);

      if (result.success) {
        // Clear pending upgrade
        localStorage.removeItem('pendingUpgrade');
        
        // Update customer package info
        const updatedCustomerData = {
          ...JSON.parse(localStorage.getItem('customerPaymentData') || '{}'),
          plan: upgradeContext.toPackage,
          upgradeHistory: [
            ...(JSON.parse(localStorage.getItem('customerPaymentData') || '{}').upgradeHistory || []),
            {
              from: upgradeContext.fromPackage.name,
              to: upgradeContext.toPackage.name,
              date: new Date().toISOString(),
              amount: upgradeCost
            }
          ]
        };
        
        localStorage.setItem('customerPaymentData', JSON.stringify(updatedCustomerData));
        
        // Redirect to success page
        window.location.href = '/payment-success?type=upgrade';
      } else {
        alert('Pembayaran gagal: ' + result.error);
      }
    } catch (error) {
      console.error('Upgrade payment error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran upgrade');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToDashboard = () => {
    // Clear pending upgrade and go back
    localStorage.removeItem('pendingUpgrade');
    window.location.href = '/dashboard';
  };

  if (!upgradeContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading upgrade information...</p>
        </div>
      </div>
    );
  }

  const upgradeCost = calculateUpgradeCost();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Package Upgrade</h1>
            <p className="text-gray-600">Tingkatkan paket Anda untuk mendapatkan fitur yang lebih lengkap</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upgrade Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Ringkasan Upgrade</h2>
              
              {/* From Package */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Paket Saat Ini</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{upgradeContext.fromPackage.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{upgradeContext.fromPackage.displayName}</h4>
                      <p className="text-sm text-gray-600">Rp {formatPrice(upgradeContext.fromPackage.price)}/tahun</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-center mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
              </div>

              {/* To Package */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Upgrade ke</h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      upgradeContext.toPackage.id === 'professional' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                        : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                    }`}>
                      <span className="text-white font-bold">{upgradeContext.toPackage.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{upgradeContext.toPackage.displayName}</h4>
                      <p className="text-sm text-gray-600">Rp {formatPrice(upgradeContext.toPackage.price)}/tahun</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="font-semibold text-gray-900 mb-3">Biaya Upgrade</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paket Baru:</span>
                    <span className="font-medium">Rp {formatPrice(upgradeContext.toPackage.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paket Saat Ini:</span>
                    <span className="font-medium">- Rp {formatPrice(upgradeContext.fromPackage.price)}</span>
                  </div>
                  <hr className="border-yellow-200" />
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Biaya Tambahan:</span>
                    <span className="text-blue-600">Rp {formatPrice(upgradeCost)}</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Keuntungan Upgrade</h3>
                <div className="space-y-2">
                  {upgradeContext.toPackage.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Metode Pembayaran</h2>
              
              <div className="space-y-3 mb-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {method.id === 'bank_transfer' && <Building2 className="w-6 h-6 text-blue-600" />}
                        {method.id === 'credit_card' && <CreditCard className="w-6 h-6 text-purple-600" />}
                        {(method.id === 'ovo' || method.id === 'dana') && <Smartphone className="w-6 h-6 text-green-600" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Fee: {method.fee}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedPaymentMethod === method.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === method.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || isProcessing}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 text-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Memproses...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Bayar Upgrade Rp {formatPrice(upgradeCost)}
                  </div>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan upgrade paket
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePayment;
