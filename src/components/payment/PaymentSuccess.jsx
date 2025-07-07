import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Calendar, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentSuccess = ({ transactionData, onClose }) => {
  const handleDownloadInvoice = () => {
    // Generate and download invoice
    console.log('Downloading invoice...', transactionData);
  };

  const handleScheduleDemo = () => {
    // Open calendar scheduling
    console.log('Scheduling demo...', transactionData);
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

      {/* Next Steps */}
      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Langkah Selanjutnya</h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium">Tim kami akan menghubungi Anda dalam 1x24 jam</p>
              <p className="text-gray-400">untuk konfirmasi dan penjadwalan implementasi</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium">Setup sistem RME di klinik Anda</p>
              <p className="text-gray-400">termasuk instalasi, konfigurasi, dan migrasi data</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 mt-0.5">
              3
            </div>
            <div>
              <p className="font-medium">Training untuk tim medis dan admin</p>
              <p className="text-gray-400">pelatihan lengkap penggunaan sistem RME</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleDownloadInvoice}
          variant="outline"
          className="flex-1 border-slate-600 text-gray-300 hover:bg-slate-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Invoice
        </Button>
        <Button
          onClick={handleScheduleDemo}
          className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Jadwalkan Demo
        </Button>
      </div>

      {/* Contact Info */}
      <div className="bg-slate-800 rounded-lg p-4">
        <p className="text-gray-400 text-sm mb-3">Butuh bantuan? Hubungi tim support kami:</p>
        <div className="flex justify-center space-x-6 text-sm">
          <div className="flex items-center text-gray-300">
            <Phone className="w-4 h-4 mr-2" />
            +62-21-1234-5678
          </div>
          <div className="flex items-center text-gray-300">
            <Mail className="w-4 h-4 mr-2" />
            support@sentrabase.com
          </div>
        </div>
      </div>

      {/* Close Button */}
      <Button
        onClick={onClose}
        variant="ghost"
        className="text-gray-400 hover:text-white"
      >
        Tutup
      </Button>
    </motion.div>
  );
};

export default PaymentSuccess;
