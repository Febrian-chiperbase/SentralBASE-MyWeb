import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { SecurityProvider } from '@/components/security/SecurityProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
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
    <SecurityProvider>
      <AuthProvider>
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
        </div>
      </AuthProvider>
    </SecurityProvider>
  );
}

export default App;