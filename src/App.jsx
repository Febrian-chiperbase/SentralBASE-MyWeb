import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SEOProvider } from '@/contexts/SEOContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { PostPaymentProvider } from '@/contexts/PostPaymentContext';
import { ProjectProgressProvider } from '@/contexts/ProjectProgressContext';
import { PackageInfoProvider } from '@/contexts/PackageInfoContext';
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
import UpgradePayment from '@/components/payment/UpgradePayment';
import AdminRoute from '@/components/admin/AdminRoute';
import PostPaymentRouterFinal from '@/components/router/PostPaymentRouterFinal';
import PaymentDebugger from '@/components/debug/PaymentDebugger';
import { useRouter } from '@/hooks/useRouter';
import notificationManager from '@/services/notificationManager';

function App() {
  // Use custom router hook
  const { currentPath } = useRouter();
  
  const isAdminRoute = currentPath === '/admin' || window.location.hash === '#admin';
  const isPostPaymentRoute = ['/register', '/dashboard', '/login'].includes(currentPath);
  const isUpgradePaymentRoute = currentPath === '/payment' && new URLSearchParams(window.location.search).get('type') === 'upgrade';

  // Initialize notification manager
  React.useEffect(() => {
    // Global function untuk tracking customer activity
    window.trackCustomerActivity = (activity) => {
      console.log('📊 Tracking customer activity:', activity);
      
      try {
        if (activity.type === 'new_customer') {
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

    // Test function untuk debugging
    window.testCustomerTracking = () => {
      console.log('🧪 Testing customer tracking...');
      window.trackCustomerActivity({
        type: 'new_customer',
        customerInfo: {
          clinicName: 'Test Klinik Debug',
          contactPerson: 'Dr. Debug',
          email: 'debug@test.com',
          phone: '081234567890'
        },
        plan: { name: 'Professional' },
        timestamp: Date.now()
      });
    };

    // Initialize notification manager
    notificationManager.init();

    return () => {
      // Cleanup
      delete window.trackCustomerActivity;
      delete window.testCustomerTracking;
    };
  }, []);

  return (
    <SecurityProvider>
      <AuthProvider>
        <SEOProvider>
          <PaymentProvider>
            <PostPaymentProvider>
              <ProjectProgressProvider>
                <PackageInfoProvider>
                  <div className="App">
                    <SEOHead />
                    <MedicalSchema 
                      organizationType="MedicalOrganization"
                      services={[
                        "Electronic Medical Records (RME)",
                        "Healthcare Data Security",
                        "Medical Information Systems",
                        "Clinical Documentation",
                        "Healthcare IT Solutions"
                      ]}
                      specialties={[
                        "Health Information Technology",
                        "Medical Records Management",
                        "Healthcare Data Security"
                      ]}
                    />
                    
                    {/* Handle different routes */}
                    {isAdminRoute ? (
                      <AdminRoute />
                    ) : isUpgradePaymentRoute ? (
                      <UpgradePayment />
                    ) : isPostPaymentRoute ? (
                      <PostPaymentRouterFinal />
                    ) : (
                      <>
                        {/* Main Landing Page */}
                        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-gray-100">
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
                          
                          {/* Admin Access Button (Hidden) */}
                          <div 
                            onClick={() => window.location.hash = '#admin'}
                            className="fixed bottom-4 right-4 w-4 h-4 opacity-0 cursor-pointer"
                            title="Admin Access"
                          />
                        </div>
                      </>
                    )}
                    
                    <Toaster />
                    <PaymentDebugger />
                  </div>
                </PackageInfoProvider>
              </ProjectProgressProvider>
            </PostPaymentProvider>
          </PaymentProvider>
        </SEOProvider>
      </AuthProvider>
    </SecurityProvider>
  );
}

export default App;
