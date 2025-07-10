import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { usePostPayment } from '@/contexts/PostPaymentContext';

const PaymentSuccessUpdated = ({ transactionData, onClose }) => {
  const { storePaymentData } = usePostPayment();

  useEffect(() => {
    // Store payment data and redirect after 3 seconds
    if (transactionData) {
      const paymentInfo = {
        customerName: transactionData.customerInfo?.contactPerson || transactionData.customerInfo?.name,
        email: transactionData.customerInfo?.email,
        phone: transactionData.customerInfo?.phone,
        clinicName: transactionData.customerInfo?.clinicName,
        transactionId: transactionData.transactionId,
        plan: transactionData.plan,
        amount: transactionData.pricing?.total,
        paymentMethod: transactionData.paymentMethod,
        orderId: `ORDER-${Date.now()}`
      };

      // Store data in context
      storePaymentData(paymentInfo);

      // Auto redirect after 3 seconds
      const timer = setTimeout(() => {
        window.location.href = '/register';
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [transactionData, storePaymentData]);

  const handleContinue = () => {
    window.location.href = '/register';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center"
      >
        <CheckCircle className="w-10 h-10 text-white" />
      </motion.div>

      {/* Success Message */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Pembayaran Berhasil!</h2>
        <p className="text-gray-300 text-lg">
          Terima kasih telah memilih SentraBASE untuk sistem RME klinik Anda
        </p>
      </div>

      {/* Transaction Details */}
      <div className="bg-slate-800 rounded-lg p-6 text-left">
        <h3 className="text-lg font-semibold text-white mb-4">Detail Transaksi</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">ID Transaksi:</span>
            <span className="text-white font-mono">{transactionData?.transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Paket:</span>
            <span className="text-white">{transactionData?.plan?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Klinik:</span>
            <span className="text-white">{transactionData?.customerInfo?.clinicName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Pembayaran:</span>
            <span className="text-green-400 font-semibold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(transactionData?.pricing?.total || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Auto Redirect Notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          Anda akan diarahkan ke halaman pendaftaran dalam beberapa detik...
        </p>
      </div>

      {/* Continue Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleContinue}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        <span>Lanjutkan ke Pendaftaran</span>
        <ArrowRight className="w-5 h-5" />
      </motion.button>

      {/* Next Steps Preview - Enhanced Design */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm text-left"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-cyan-400">Langkah Selanjutnya</h3>
        </div>
        
        <div className="space-y-4">
          {/* Step 1 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white text-lg mb-1">Buat Password Akun Anda</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Amankan akses ke sistem SentraBASE dengan password yang kuat untuk melindungi data klinik Anda
              </p>
            </div>
            <div className="text-cyan-400 opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white text-lg mb-1">Akses Dashboard Pesanan</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Pantau status implementasi, timeline project, dan informasi lengkap pesanan Anda secara real-time
              </p>
            </div>
            <div className="text-blue-400 opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white text-lg mb-1">Tim Kami Akan Menghubungi Anda</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Dalam <span className="text-green-400 font-semibold">1×24 jam</span>, tim technical support kami akan menghubungi untuk memulai setup sistem dan training
              </p>
            </div>
            <div className="text-green-400 opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Timeline Indicator */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Estimasi waktu setup lengkap:</span>
            <span className="text-cyan-400 font-semibold">3-5 hari kerja</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentSuccessUpdated;
