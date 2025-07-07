// Manual Bank Transfer Service (100% Gratis)
class ManualBankTransferService {
  constructor() {
    // Rekening BCA Anda
    this.bankAccounts = [
      {
        bank: 'BCA',
        accountNumber: '1234567890', // Ganti dengan rekening BCA Anda
        accountName: 'PT SENTRABASE INDONESIA',
        branch: 'KCP Jakarta Sudirman'
      },
      {
        bank: 'Mandiri',
        accountNumber: '1370012345678', // Optional: rekening backup
        accountName: 'PT SENTRABASE INDONESIA',
        branch: 'KC Jakarta Sudirman'
      }
    ];
  }

  // Generate payment instructions
  generatePaymentInstructions(paymentData) {
    const { customerInfo, pricing, plan } = paymentData;
    const orderId = `SENTRA-${Date.now()}`;
    const uniqueCode = this.generateUniqueCode();
    const totalAmount = pricing.total + uniqueCode; // Tambah kode unik untuk identifikasi

    return {
      success: true,
      data: {
        orderId,
        totalAmount,
        uniqueCode,
        bankAccounts: this.bankAccounts,
        instructions: this.getTransferInstructions(),
        expiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 jam
        customerInfo,
        plan
      }
    };
  }

  // Generate unique code (3 digit) untuk identifikasi pembayaran
  generateUniqueCode() {
    return Math.floor(Math.random() * 900) + 100; // 100-999
  }

  // Transfer instructions
  getTransferInstructions() {
    return [
      "1. Transfer ke salah satu rekening di atas",
      "2. Gunakan jumlah EXACT termasuk 3 digit kode unik",
      "3. Simpan bukti transfer",
      "4. Kirim bukti transfer via WhatsApp ke 0812-3456-7890",
      "5. Atau upload bukti transfer di website",
      "6. Konfirmasi akan diproses dalam 1-2 jam kerja",
      "7. Akun RME akan diaktivasi setelah konfirmasi"
    ];
  }

  // Verify payment (manual process)
  async verifyPayment(orderId, transferProof) {
    // Ini bisa diintegrasikan dengan:
    // 1. WhatsApp Business API
    // 2. Email notification
    // 3. Admin dashboard untuk verifikasi manual
    
    console.log('📧 Payment verification request:', {
      orderId,
      transferProof,
      timestamp: new Date().toISOString()
    });

    // Send notification to admin
    await this.notifyAdmin(orderId, transferProof);

    return {
      success: true,
      message: 'Bukti transfer diterima. Verifikasi akan diproses dalam 1-2 jam kerja.',
      orderId
    };
  }

  // Notify admin for manual verification
  async notifyAdmin(orderId, transferProof) {
    // Implementation untuk notifikasi admin
    // Bisa via email, WhatsApp, atau Telegram
    console.log('🔔 Admin notification sent for order:', orderId);
  }
}

export default new ManualBankTransferService();
