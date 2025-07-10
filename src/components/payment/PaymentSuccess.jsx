import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Calendar, Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePostPayment } from '@/contexts/PostPaymentContext';
import invoiceService from '@/services/InvoiceService';
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
  const handleDownloadInvoice = async () => {
    try {
      // Show loading state
      const loadingToast = document.createElement('div');
      loadingToast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      loadingToast.textContent = 'Menyiapkan invoice...';
      document.body.appendChild(loadingToast);

      // Generate and download invoice
      const result = await invoiceService.downloadInvoice(transactionData);
      
      // Remove loading toast
      document.body.removeChild(loadingToast);

      if (result.success) {
        // Show success message
        const successToast = document.createElement('div');
        successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        successToast.textContent = '✅ Invoice berhasil dibuka!';
        document.body.appendChild(successToast);
        
        setTimeout(() => {
          if (document.body.contains(successToast)) {
            document.body.removeChild(successToast);
          }
        }, 3000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      
      // Show error message
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorToast.textContent = `❌ Error: ${error.message}`;
      document.body.appendChild(errorToast);
      
      setTimeout(() => {
        if (document.body.contains(errorToast)) {
          document.body.removeChild(errorToast);
        }
      }, 5000);
    }
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

      {/* Next Steps - Enhanced Design */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6 backdrop-blur-sm"
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
