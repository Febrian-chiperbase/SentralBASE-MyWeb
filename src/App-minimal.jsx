import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/sentrabase/layout/Navbar';
import Footer from '@/components/sentrabase/layout/Footer';
import HeroSection from '@/components/sentrabase/sections/HeroSection';
import PricingSection from '@/components/sentrabase/sections/PricingSection';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-gray-100">
      <Toaster />
      <Navbar />
      <main>
        <HeroSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
