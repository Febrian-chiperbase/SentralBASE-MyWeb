import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SEOProvider } from '@/contexts/SEOContext';
import { PaymentProvider } from '@/contexts/PaymentContext';
import SEOHead from '@/components/seo/SEOHead';
import MedicalSchema from '@/components/seo/MedicalSchema';
import PaymentDebug from '@/components/payment/PaymentDebug';
import Navbar from '@/components/sentrabase/layout/Navbar';
import Footer from '@/components/sentrabase/layout/Footer';
import HeroSection from '@/components/sentrabase/sections/HeroSection';
import ProblemSection from '@/components/sentrabase/sections/ProblemSection';
import SolutionSection from '@/components/sentrabase/sections/SolutionSection';
import CorePillarsSection from '@/components/sentrabase/sections/CorePillarsSection';
import PricingSection from '@/components/sentrabase/sections/PricingSection';
import TrustSignalSection from '@/components/sentrabase/sections/TrustSignalSection';
import FinalCTASection from '@/components/sentrabase/sections/FinalCTASection';

function App() {
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
              <PaymentDebug />
            </div>
          </AuthProvider>
        </SecurityProvider>
      </PaymentProvider>
    </SEOProvider>
  );
}

export default App;