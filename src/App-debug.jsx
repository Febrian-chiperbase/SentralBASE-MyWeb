import React from 'react';
import { Toaster } from '@/components/ui/toaster';

// Import components one by one to identify the problematic one
import Navbar from '@/components/sentrabase/layout/Navbar';
import HeroSection from '@/components/sentrabase/sections/HeroSection';

function App() {
  console.log('🚀 App component rendering...');
  
  try {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-gray-100">
        <Toaster />
        
        {/* Test basic components first */}
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400">
            🏥 SentraBASE - Debug Mode
          </h1>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">✅ Basic Components Test</h2>
              <p className="text-gray-300">
                Jika Anda melihat ini, berarti basic React dan Tailwind berfungsi.
              </p>
            </div>
            
            {/* Test Navbar */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">🧪 Testing Navbar</h2>
              <div className="border border-slate-600 rounded">
                <Navbar />
              </div>
            </div>
            
            {/* Test HeroSection */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">🧪 Testing HeroSection</h2>
              <div className="border border-slate-600 rounded">
                <HeroSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ App rendering error:', error);
    return (
      <div className="min-h-screen bg-red-900 text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          ❌ Error Detected
        </h1>
        <div className="max-w-4xl mx-auto bg-red-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Error Details:</h2>
          <pre className="text-sm bg-red-700 p-4 rounded overflow-auto">
            {error.toString()}
          </pre>
        </div>
      </div>
    );
  }
}

export default App;
