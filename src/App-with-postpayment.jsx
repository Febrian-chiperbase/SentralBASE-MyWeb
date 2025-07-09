import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SEOProvider } from '@/contexts/SEOContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { PostPaymentProvider } from '@/contexts/PostPaymentContext';
import SEOHead from '@/components/seo/SEOHead';
import MedicalSchema from '@/components/seo/MedicalSchema';
import Navbar from '@/components/sentrabase/layout/Navbar';
import Footer from '@/components/sentrabase/layout/Footer';
import HeroSection from '@/components/sentrabase/sections/HeroSection';
import ProblemSection from '@/components/sentrabase/sections/ProblemSection';
import SolutionSection from '@/components/sentrabase/sections/SolutionSection';
import CorePillarsSection from '@/components/sentrabase/sections/CorePillarsSection';
import PricingSection from '@/components/sentrabase/sections/PricingSection';
import TrustSignalSection from '@/components/sentrabase/sections/TrustSignalSection';
import FinalCTASection from '@/components/sentrabase/sections/FinalCTASection';
import AdminRoute from '@/components/admin/AdminRoute';
import PostPaymentRouter from '@/components/router/PostPaymentRouter';
import notificationManager from '@/services/notificationManager';

function App() {
  // Check current route
  const currentPath = window.location.pathname;
  const isAdminRoute = currentPath === '/admin' || window.location.hash === '#admin';
  const isPostPaymentRoute = ['/register', '/dashboard'].includes(currentPath);

  // Initialize notification manager
  React.useEffect(() => {
    // Global function untuk tracking customer activity
    window.trackCustomerActivity = (activity) => {
      console.log('📊 Tracking customer activity:', activity);
      
      try {
        if (activity.type === 'new_customer') {
          // New customer started
          console.log('🆕 New customer detected');
          notificationManager.trackNewCustomer({
            clinicName: activity.customerInfo?.clinicName || 'Unknown Clinic',
            contactPerson: activity.customerInfo?.contactPerson || 'Unknown',
            email: activity.customerInfo?.email || '',
            phone: activity.customerInfo?.phone || '',
            plan: activity.plan?.name || 'No plan selected',
            timestamp: activity.timestamp
          });
        } else if (activity.type === 'step_progress') {
          // Customer progress
          console.log('📈 Customer progress:', activity.step);
          notificationManager.trackCustomerProgress({
            clinicName: activity.customerInfo?.clinicName || 'Unknown Clinic',
            contactPerson: activity.customerInfo?.contactPerson || 'Unknown',
            email: activity.customerInfo?.email || '',
            phone: activity.customerInfo?.phone || '',
            step: activity.step,
            timestamp: activity.timestamp
          });
        } else if (activity.type === 'payment_completed') {
          // Payment completed
          console.log('💳 Payment completed');
          notificationManager.trackPaymentCompleted({
            clinicName: activity.customerInfo?.clinicName || 'Unknown Clinic',
            contactPerson: activity.customerInfo?.contactPerson || 'Unknown',
            email: activity.customerInfo?.email || '',
            phone: activity.customerInfo?.phone || '',
            plan: activity.plan?.name || 'No plan selected',
            amount: activity.amount || 0,
            timestamp: activity.timestamp
          });
        }
      } catch (error) {
        console.error('Error tracking customer activity:', error);
      }
    };

    // Initialize notification manager
    notificationManager.init();
  }, []);

  return (
    <SecurityProvider>
      <AuthProvider>
        <SEOProvider>
          <PaymentProvider>
            <PostPaymentProvider>
              <div className="App">
                <SEOHead />
                <MedicalSchema />
                
                {/* Handle different routes */}
                {isAdminRoute ? (
                  <AdminRoute />
                ) : isPostPaymentRoute ? (
                  <PostPaymentRouter />
                ) : (
                  <>
                    {/* Main Landing Page */}
                    <Navbar />
                    <main id="main-content">
                      <HeroSection />
                      <ProblemSection />
                      <SolutionSection />
                      <CorePillarsSection />
                      <PricingSection />
                      <TrustSignalSection />
                      <FinalCTASection />
                    </main>
                    <Footer />
                  </>
                )}
                
                <Toaster />
              </div>
            </PostPaymentProvider>
          </PaymentProvider>
        </SEOProvider>
      </AuthProvider>
    </SecurityProvider>
  );
}

export default App;
