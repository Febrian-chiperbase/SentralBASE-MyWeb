import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Zap, Database, Calendar } from 'lucide-react';
import ScheduleDemoModal from '../ScheduleDemoModal';

const HeroSection = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleScheduleDemo = () => {
    setIsDemoModalOpen(true);
  };

  return (
    <>
      <section id="hero" className="pt-32 pb-20 bg-slate-900 text-gray-100 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Sentrabase:
              </span> Platform Terpusat
              <br className="hidden sm:block" /> untuk Keamanan & Efisiensi Klinik Anda.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10"
            >
              Penuhi kewajiban RME dengan keamanan data on-premise, sambil kelola semua operasional klinik Anda dari satu dashboard cerdas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="mb-16"
            >
              <Button
                onClick={handleScheduleDemo}
                size="lg"
                className="w-full sm:w-auto font-semibold py-3 px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Jadwalkan Demo Gratis
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6, type: "spring", stiffness: 100 }}
            className="relative max-w-4xl mx-auto mt-12"
          >
            <div className="aspect-video bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700 flex items-center justify-center">
              <div className="text-center">
                <Database className="w-24 h-24 text-cyan-400 mx-auto mb-4 opacity-50" />
                <p className="text-2xl font-semibold text-gray-400">Visualisasi Konsep Sentrabase</p>
                <p className="text-sm text-gray-500">(Diagram/Animasi Pusat Kontrol & Klinik Terhubung)</p>
                <div className="mt-8 flex justify-center space-x-8">
                  <div className="flex flex-col items-center text-gray-400">
                    <ShieldCheck className="w-12 h-12 text-green-500 mb-2" />
                    <span className="text-sm">Klinik A</span>
                  </div>
                  <div className="flex flex-col items-center text-gray-400">
                    <ShieldCheck className="w-12 h-12 text-green-500 mb-2" />
                    <span className="text-sm">Klinik B</span>
                  </div>
                  <div className="flex flex-col items-center text-gray-400">
                    <Zap className="w-12 h-12 text-blue-500 mb-2" />
                    <span className="text-sm">Control Plane</span>
                  </div>
                  <div className="flex flex-col items-center text-gray-400">
                    <ShieldCheck className="w-12 h-12 text-green-500 mb-2" />
                    <span className="text-sm">Klinik C</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-cyan-500 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-600 rounded-lg opacity-30 animate-pulse delay-500"></div>
          </motion.div>
        </div>
      </section>

      <ScheduleDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </>
  );
};

export default HeroSection;