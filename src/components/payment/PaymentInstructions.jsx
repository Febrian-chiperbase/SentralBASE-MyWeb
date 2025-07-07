import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Copy, ExternalLink, RefreshCw, AlertTriangle, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePayment } from '@/contexts/PaymentContext';

const PaymentInstructions = ({ paymentData, onClose }) => {
  const { checkPaymentStatus } = usePayment();
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeLeft, setTimeLeft] = useState(null);

  // Auto-check payment status (only for non-manual payments)
  useEffect(() => {
    if (!paymentData?.orderId || paymentData?.fallback_to_manual) return;

    const checkStatus = async () => {
      try {
        const result = await checkPaymentStatus(paymentData.orderId);
        if (result.success && result.status === 'settlement') {
          setPaymentStatus('success');
        }
      } catch (error) {
        console.log('Status check error (non-critical):', error);
      }
    };

    // Check immediately
    checkStatus();

    // Check every 30 seconds for automated payments
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [paymentData?.orderId, paymentData?.fallback_to_manual, checkPaymentStatus]);

  // Countdown timer
  useEffect(() => {
    if (!paymentData?.expiry) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(paymentData.expiry).getTime();
      const difference = expiry - now;

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('Expired');
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [paymentData?.expiry]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (paymentStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Pembayaran Berhasil!</h2>
          <p className="text-gray-300 text-lg">
            💰 Uang telah masuk ke rekening BCA Anda
          </p>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">Pembayaran Dikonfirmasi</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>✅ Pembayaran telah diterima dan diproses</p>
            <p>✅ Uang telah ditransfer ke rekening BCA</p>
            <p>✅ Tim kami akan menghubungi Anda dalam 1x24 jam</p>
            <p>✅ Akun RME akan diaktivasi segera</p>
          </div>
        </div>

        <Button onClick={onClose} className="bg-green-500 hover:bg-green-600 text-white">
          Tutup
        </Button>
      </motion.div>
    );
  }

  // Check if this is manual transfer or fallback
  const isManualTransfer = paymentData?.fallback_to_manual || paymentData?.bankAccounts;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          isManualTransfer ? 'bg-green-500' : 'bg-blue-500'
        }`}>
          {isManualTransfer ? <Building className="w-8 h-8 text-white" /> : <Clock className="w-8 h-8 text-white" />}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {isManualTransfer ? 'Transfer Bank Manual' : 'Menunggu Pembayaran'}
        </h2>
        <p className="text-gray-300">
          {isManualTransfer 
            ? '100% GRATIS - Transfer langsung ke rekening BCA kami'
            : 'Silakan selesaikan pembayaran untuk mengaktifkan layanan RME Anda'
          }
        </p>
      </div>

      {/* Fallback Notice */}
      {paymentData?.fallback_to_manual && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
            <div>
              <h4 className="font-semibold text-yellow-400">Menggunakan Transfer Manual</h4>
              <p className="text-sm text-gray-300">
                Sistem otomatis sedang maintenance. Kami menggunakan transfer manual sebagai alternatif (100% gratis).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Timer */}
      {timeLeft && !isManualTransfer && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-center">
          <p className="text-orange-400 font-semibold">
            ⏰ Batas waktu pembayaran: {timeLeft}
          </p>
        </div>
      )}

      {/* Manual Transfer Instructions */}
      {isManualTransfer && paymentData?.bankAccounts && (
        <div className="bg-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            🏦 Transfer ke Rekening BCA
            <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">GRATIS</span>
          </h3>
          
          <div className="space-y-4">
            {paymentData.bankAccounts.map((account, index) => (
              <div key={index} className="bg-slate-800 p-4 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Bank</p>
                    <p className="text-white font-semibold">{account.bank}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Nama Rekening</p>
                    <p className="text-white font-semibold">{account.accountName}</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Nomor Rekening</p>
                        <p className="text-white font-mono text-lg">{account.accountNumber}</p>
                      </div>
                      <Button
                        onClick={() => copyToClipboard(account.accountNumber)}
                        variant="outline"
                        size="sm"
                        className="border-cyan-400 text-cyan-400"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between bg-slate-800 p-4 rounded">
              <div>
                <p className="text-gray-400 text-sm">Jumlah Transfer (EXACT)</p>
                <p className="text-white font-bold text-xl">{formatPrice(paymentData.totalAmount)}</p>
                <p className="text-cyan-400 text-sm">*Termasuk kode unik untuk identifikasi</p>
              </div>
              <Button
                onClick={() => copyToClipboard(paymentData.totalAmount.toString())}
                variant="outline"
                size="sm"
                className="border-cyan-400 text-cyan-400"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {paymentData.instructions && (
            <div className="mt-6 space-y-3 text-sm text-gray-300">
              <h4 className="font-semibold text-white">Cara Transfer:</h4>
              <div className="space-y-2">
                {paymentData.instructions.map((instruction, index) => (
                  <p key={index}>{instruction}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BCA Virtual Account Instructions (for automated payments) */}
      {!isManualTransfer && paymentData?.va_numbers && (
        <div className="bg-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            🏦 BCA Virtual Account
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-800 p-4 rounded">
              <div>
                <p className="text-gray-400 text-sm">Nomor Virtual Account</p>
                <p className="text-white font-mono text-lg">{paymentData.va_numbers[0]?.va_number}</p>
              </div>
              <Button
                onClick={() => copyToClipboard(paymentData.va_numbers[0]?.va_number)}
                variant="outline"
                size="sm"
                className="border-cyan-400 text-cyan-400"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="flex items-center justify-between bg-slate-800 p-4 rounded">
              <div>
                <p className="text-gray-400 text-sm">Jumlah Pembayaran</p>
                <p className="text-white font-bold text-lg">{formatPrice(paymentData.gross_amount)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Payment Link */}
      {paymentData?.redirect_url && (
        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-cyan-400 mb-2">Atau bayar melalui halaman pembayaran:</h4>
          <Button
            onClick={() => window.open(paymentData.redirect_url, '_blank')}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Buka Halaman Pembayaran
          </Button>
        </div>
      )}

      {/* Status Check */}
      <div className="flex items-center justify-between">
        {!isManualTransfer && (
          <Button
            onClick={() => checkPaymentStatus(paymentData.orderId)}
            variant="outline"
            className="border-gray-500 text-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Cek Status Pembayaran
          </Button>
        )}
        
        <Button onClick={onClose} variant="ghost" className="text-gray-400 ml-auto">
          Tutup
        </Button>
      </div>

      {/* Important Notes */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h4 className="font-semibold text-green-400 mb-2">
          {isManualTransfer ? '💰 Keuntungan Transfer Manual:' : '⚠️ Penting:'}
        </h4>
        <div className="space-y-1 text-sm text-gray-300">
          {isManualTransfer ? (
            <>
              <p>• 100% GRATIS - Tidak ada fee payment gateway</p>
              <p>• Uang langsung masuk ke rekening BCA Anda</p>
              <p>• Verifikasi manual dalam 1-2 jam kerja</p>
              <p>• Simpan bukti transfer untuk referensi</p>
              <p>• Hubungi WhatsApp jika ada kendala</p>
            </>
          ) : (
            <>
              <p>• Pastikan jumlah pembayaran sesuai dengan yang tertera</p>
              <p>• Pembayaran akan otomatis dikonfirmasi dalam 1-2 menit</p>
              <p>• Uang akan langsung masuk ke rekening BCA yang terdaftar</p>
              <p>• Simpan bukti pembayaran untuk referensi</p>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentInstructions;
