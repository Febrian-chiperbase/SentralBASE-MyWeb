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

      {/* Next Steps Preview */}
      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-6 text-left">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Langkah Selanjutnya</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium">Buat password akun Anda</p>
              <p className="text-gray-400">untuk mengamankan akses ke sistem</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium">Akses dashboard pesanan</p>
              <p className="text-gray-400">lihat status dan informasi lengkap pesanan Anda</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
              3
            </div>
            <div>
              <p className="font-medium">Tim kami akan menghubungi Anda</p>
              <p className="text-gray-400">dalam 1x24 jam untuk setup sistem</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentSuccessUpdated;
