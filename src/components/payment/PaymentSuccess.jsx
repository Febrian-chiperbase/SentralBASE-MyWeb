import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Calendar, Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePostPayment } from '@/contexts/PostPaymentContext';
import { useRouter } from '@/hooks/useRouter';

const PaymentSuccess = ({ transactionData, onClose }) => {
  const { storePaymentData } = usePostPayment();
  const { navigate } = useRouter();
  const [countdown, setCountdown] = React.useState(60); // 1 menit = 60 detik
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  useEffect(() => {
    // Store payment data and setup countdown
    if (transactionData) {
      console.log('🔄 PaymentSuccess: Processing transaction data...', transactionData);
      
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

      console.log('💾 PaymentSuccess: Storing payment data...', paymentInfo);
      
      // Store data in context
      storePaymentData(paymentInfo);
      
      console.log('✅ PaymentSuccess: Payment data stored, starting countdown...');
    }
  }, [transactionData, storePaymentData]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0 && !isRedirecting && !isPaused) {
      const timer = setTimeout(() => {
        setCountdown(prev => {
          const newCount = prev - 1;
          
          // Sound notification untuk countdown terakhir
          if (newCount <= 10 && newCount > 0) {
            // Beep sound untuk 10 detik terakhir
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
              audio.volume = 0.1;
              audio.play().catch(() => {}); // Ignore errors
            } catch (e) {
              // Ignore audio errors
            }
          }
          
          return newCount;
        });
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isRedirecting) {
      // Auto redirect when countdown reaches 0
      handleContinue();
    }
  }, [countdown, isRedirecting, isPaused]);

  const handleContinue = () => {
    if (isRedirecting) return; // Prevent multiple redirects
    
    console.log('🚀 PaymentSuccess: Redirecting to /register...');
    setIsRedirecting(true);
    
    // Use router hook for navigation
    navigate('/register');
  };

  // Format countdown untuk display
  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
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

      {/* Auto Redirect Notice dengan Countdown */}
      <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-lg p-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-blue-300 font-medium">
              Auto Redirect Aktif
            </p>
          </div>
          
          {/* Countdown Display */}
          <div className="mb-4">
            <div className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
              countdown <= 10 ? 'text-red-400 animate-pulse' : 
              countdown <= 30 ? 'text-yellow-400' : 'text-white'
            }`}>
              {formatCountdown(countdown)}
            </div>
            <p className={`text-sm transition-colors duration-300 ${
              countdown <= 10 ? 'text-red-200' :
              countdown <= 30 ? 'text-yellow-200' : 'text-blue-200'
            }`}>
              {countdown <= 10 ? 'Segera redirect...' :
               countdown <= 30 ? 'Bersiap untuk redirect...' :
               'Anda akan diarahkan ke halaman pendaftaran secara otomatis'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700/50 rounded-full h-3 mb-3 overflow-hidden">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${(countdown / 60) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
              className={`h-3 rounded-full transition-colors duration-300 ${
                countdown <= 10 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                countdown <= 30 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
            />
          </div>

          <p className="text-blue-300/80 text-xs mb-3">
            Atau klik tombol di bawah untuk lanjut sekarang
          </p>

          {/* Pause/Resume Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-blue-300 hover:text-blue-200 text-xs underline transition-colors"
          >
            {isPaused ? '▶️ Lanjutkan countdown' : '⏸️ Pause countdown'}
          </button>
        </div>
      </div>

      {/* Continue Button */}
      <motion.button
        whileHover={{ scale: isRedirecting ? 1 : 1.05 }}
        whileTap={{ scale: isRedirecting ? 1 : 0.95 }}
        onClick={handleContinue}
        disabled={isRedirecting}
        className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 mb-6 ${
          isRedirecting 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {isRedirecting ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Mengarahkan...</span>
          </>
        ) : (
          <>
            <span>Lanjutkan ke Pendaftaran Sekarang</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </motion.button>

      {/* Next Steps */}
      <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-6">
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
