// Notification Service - Orchestrates Email and WhatsApp notifications
import EmailService from './emailService';
import WhatsAppService from './whatsappService';

class NotificationService {
  constructor() {
    this.emailService = EmailService;
    this.whatsappService = WhatsAppService;
  }

  // Send complete payment confirmation (Email + WhatsApp)
  async sendPaymentConfirmation(paymentData) {
    console.log('📢 Sending payment confirmation notifications...');
    
    const results = {
      email: { success: false },
      whatsapp: { success: false },
      timestamp: new Date().toISOString(),
      transactionId: paymentData.transactionId
    };

    try {
      // Send email confirmation
      console.log('📧 Sending email confirmation...');
      results.email = await this.emailService.sendPaymentConfirmation(paymentData);
      
      // Send WhatsApp confirmation
      console.log('📱 Sending WhatsApp confirmation...');
      results.whatsapp = await this.whatsappService.sendPaymentConfirmation(paymentData);
      
      // Log results
      console.log('📊 Notification results:', results);
      
      // Determine overall success
      const overallSuccess = results.email.success || results.whatsapp.success;
      
      if (overallSuccess) {
        console.log('✅ At least one notification method succeeded');
        
        // Track successful notifications
        await this.trackNotification(paymentData, results);
        
        return {
          success: true,
          results,
          message: this.generateSuccessMessage(results)
        };
      } else {
        console.log('❌ All notification methods failed');
        
        // Generate fallback options
        const fallbackOptions = await this.generateFallbackOptions(paymentData);
        
        return {
          success: false,
          results,
          fallbackOptions,
          message: 'Notifikasi otomatis gagal, menggunakan metode manual'
        };
      }
    } catch (error) {
      console.error('❌ Notification service error:', error);
      
      return {
        success: false,
        error: error.message,
        results,
        fallbackOptions: await this.generateFallbackOptions(paymentData)
      };
    }
  }

  // Generate success message based on results
  generateSuccessMessage(results) {
    const messages = [];
    
    if (results.email.success) {
      messages.push('📧 Email konfirmasi terkirim');
    }
    
    if (results.whatsapp.success) {
      messages.push('📱 WhatsApp konfirmasi terkirim');
    }
    
    if (results.email.fallback) {
      messages.push('📧 Email dijadwalkan untuk pengiriman manual');
    }
    
    if (results.whatsapp.fallback) {
      messages.push('📱 WhatsApp link tersedia untuk pengiriman manual');
    }
    
    return messages.join(', ');
  }

  // Generate fallback options when automatic notifications fail
  async generateFallbackOptions(paymentData) {
    const { customerInfo, transactionId } = paymentData;
    
    return {
      manualEmail: {
        to: customerInfo.email,
        subject: `Konfirmasi Pembayaran SentraBASE - ${transactionId}`,
        template: 'payment_confirmation',
        data: paymentData
      },
      whatsappLink: this.whatsappService.generateWhatsAppLink(paymentData),
      adminAction: {
        task: 'Send manual confirmation',
        customer: customerInfo.clinicName,
        contact: customerInfo.phone,
        email: customerInfo.email,
        transactionId
      }
    };
  }

  // Track notification attempts for analytics
  async trackNotification(paymentData, results) {
    const trackingData = {
      transactionId: paymentData.transactionId,
      customerEmail: paymentData.customerInfo.email,
      customerPhone: paymentData.customerInfo.phone,
      emailSuccess: results.email.success,
      whatsappSuccess: results.whatsapp.success,
      timestamp: new Date().toISOString(),
      emailService: results.email.service || 'failed',
      whatsappService: results.whatsapp.service || 'failed'
    };
    
    // In production, this would be saved to database
    console.log('📊 Tracking notification:', trackingData);
    localStorage.setItem(`notification_${paymentData.transactionId}`, JSON.stringify(trackingData));
  }

  // Send welcome notifications after account setup
  async sendWelcomeNotifications(customerInfo, setupDetails) {
    console.log('🎉 Sending welcome notifications...');
    
    const results = {
      email: { success: false },
      whatsapp: { success: false }
    };

    try {
      // Send welcome email
      results.email = await this.emailService.sendWelcomeEmail(customerInfo, setupDetails);
      
      // Send welcome WhatsApp
      results.whatsapp = await this.whatsappService.sendWelcomeMessage(customerInfo, setupDetails);
      
      return {
        success: results.email.success || results.whatsapp.success,
        results
      };
    } catch (error) {
      console.error('Welcome notifications error:', error);
      return { success: false, error: error.message, results };
    }
  }

  // Send payment reminder notifications
  async sendPaymentReminder(paymentData) {
    console.log('⏰ Sending payment reminder...');
    
    try {
      const whatsappResult = await this.whatsappService.sendPaymentReminder(paymentData);
      
      return {
        success: whatsappResult.success,
        result: whatsappResult
      };
    } catch (error) {
      console.error('Payment reminder error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send admin alerts for new payments
  async sendAdminAlert(paymentData) {
    console.log('🔔 Sending admin alert...');
    
    try {
      // Send to admin WhatsApp
      await this.whatsappService.sendAdminNotification(paymentData);
      
      // Send admin email (if configured)
      if (process.env.VITE_ADMIN_EMAIL) {
        const adminEmailData = {
          ...paymentData,
          customerInfo: {
            ...paymentData.customerInfo,
            email: process.env.VITE_ADMIN_EMAIL
          }
        };
        
        await this.emailService.sendPaymentConfirmation(adminEmailData);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Admin alert error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get notification status for a transaction
  getNotificationStatus(transactionId) {
    const stored = localStorage.getItem(`notification_${transactionId}`);
    return stored ? JSON.parse(stored) : null;
  }

  // Retry failed notifications
  async retryFailedNotifications(transactionId) {
    const status = this.getNotificationStatus(transactionId);
    
    if (!status) {
      throw new Error('Notification status not found');
    }
    
    // Reconstruct payment data (in production, fetch from database)
    const paymentData = this.reconstructPaymentData(transactionId);
    
    const retryResults = {
      email: { success: status.emailSuccess },
      whatsapp: { success: status.whatsappSuccess }
    };
    
    // Retry failed email
    if (!status.emailSuccess) {
      console.log('🔄 Retrying email notification...');
      retryResults.email = await this.emailService.sendPaymentConfirmation(paymentData);
    }
    
    // Retry failed WhatsApp
    if (!status.whatsappSuccess) {
      console.log('🔄 Retrying WhatsApp notification...');
      retryResults.whatsapp = await this.whatsappService.sendPaymentConfirmation(paymentData);
    }
    
    // Update tracking
    await this.trackNotification(paymentData, retryResults);
    
    return retryResults;
  }

  // Reconstruct payment data (simplified - in production, fetch from database)
  reconstructPaymentData(transactionId) {
    // This is a simplified version
    // In production, you would fetch complete data from database
    return {
      transactionId,
      customerInfo: {
        clinicName: 'Sample Clinic',
        contactPerson: 'Dr. Sample',
        email: 'sample@clinic.com',
        phone: '081234567890'
      },
      plan: {
        name: 'Professional',
        subtitle: 'Untuk Klinik Berkembang'
      },
      pricing: {
        basePrice: 3000000,
        tax: 330000,
        total: 3330000
      },
      paymentMethod: {
        name: 'BCA Virtual Account'
      },
      paymentDate: new Date().toISOString()
    };
  }

  // Generate notification report
  generateNotificationReport(startDate, endDate) {
    const report = {
      period: { startDate, endDate },
      totalNotifications: 0,
      emailSuccess: 0,
      whatsappSuccess: 0,
      bothSuccess: 0,
      bothFailed: 0,
      details: []
    };
    
    // Get all notification records from localStorage
    // In production, this would query the database
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('notification_')) {
        const data = JSON.parse(localStorage.getItem(key));
        const notificationDate = new Date(data.timestamp);
        
        if (notificationDate >= new Date(startDate) && notificationDate <= new Date(endDate)) {
          report.totalNotifications++;
          
          if (data.emailSuccess) report.emailSuccess++;
          if (data.whatsappSuccess) report.whatsappSuccess++;
          if (data.emailSuccess && data.whatsappSuccess) report.bothSuccess++;
          if (!data.emailSuccess && !data.whatsappSuccess) report.bothFailed++;
          
          report.details.push(data);
        }
      }
    }
    
    // Calculate success rates
    report.emailSuccessRate = report.totalNotifications > 0 ? 
      (report.emailSuccess / report.totalNotifications * 100).toFixed(2) + '%' : '0%';
    
    report.whatsappSuccessRate = report.totalNotifications > 0 ? 
      (report.whatsappSuccess / report.totalNotifications * 100).toFixed(2) + '%' : '0%';
    
    return report;
  }
}

export default new NotificationService();
