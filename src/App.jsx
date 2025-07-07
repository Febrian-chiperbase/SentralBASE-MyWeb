import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SEOProvider } from '@/contexts/SEOContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
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
import notificationManager from '@/services/notificationManager';

function App() {
  // Check if this is admin route
  const isAdminRoute = window.location.pathname === '/admin' || window.location.hash === '#admin';

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
            phone: activity.customerInfo?.phone || ''
          }, activity.step);
        } else if (activity.type === 'order_completed') {
          // Order completed
          console.log('✅ Order completed');
          notificationManager.trackCompletedOrder(activity);
        }
        
        // Store activity in localStorage for admin dashboard
        const activityKey = `activity_${Date.now()}`;
        localStorage.setItem(activityKey, JSON.stringify(activity));
        
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

    return () => {
      // Cleanup
      delete window.trackCustomerActivity;
      delete window.testCustomerTracking;
    };
  }, []);

  // Admin route
  if (isAdminRoute) {
    return <AdminRoute />;
  }

  // Main website
  return (
    <SEOProvider>
      <PaymentProvider>
        <SecurityProvider>
          <AuthProvider>
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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-gray-100">
              <Toaster />
              <Navbar />
              <main>
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
          </AuthProvider>
        </SecurityProvider>
      </PaymentProvider>
    </SEOProvider>
  );
}

export default App;