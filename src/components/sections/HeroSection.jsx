
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Package, Calculator, Globe } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="beranda" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Kirim Barang ke
              <span className="gradient-text block">Seluruh Dunia</span>
              dengan Mudah
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Layanan pengiriman internasional terpercaya dengan tracking real-time,
              asuransi lengkap, dan harga kompetitif ke 200+ negara di dunia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gradient-bg text-white hover:opacity-90 pulse-glow">
                <Package className="w-5 h-5 mr-2" />
                Kirim Paket Sekarang
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
                <Calculator className="w-5 h-5 mr-2" />
                Hitung Biaya Kirim
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="floating-animation">
              <img
                className="w-full h-auto rounded-2xl shadow-2xl"
                alt="Pengiriman internasional dengan pesawat kargo"
                src="https://images.unsplash.com/photo-1583911026662-95161686d9a6" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg bounce-in">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">200+ Negara</p>
                  <p className="text-sm text-gray-600">Jangkauan Global</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;