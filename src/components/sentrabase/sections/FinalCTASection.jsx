import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ScheduleDemoModal from '../ScheduleDemoModal';

const FinalCTASection = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleScheduleDemo = () => {
    setIsDemoModalOpen(true);
  };

  return (
    <>
      <section id="final-cta" className="py-24 bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight"
          >
            Siap Mengambil Kendali Penuh
            <br className="hidden sm:block" /> atas Klinik Anda?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-cyan-100 max-w-2xl mx-auto mb-12"
          >
            Jangan tunda lagi. Amankan data Anda, efisienkan operasional, dan berikan pengalaman terbaik untuk pasien dengan Sentrabase.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Button
              onClick={handleScheduleDemo}
              size="lg"
              className="text-xl font-bold px-12 py-8 bg-white text-blue-600 hover:bg-gray-100 rounded-xl shadow-2xl hover:shadow-white/30 transform hover:scale-105 transition-all duration-300"
            >
              Jadwalkan Demo Gratis Sekarang
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            viewport={{ once: true }}
            className="text-lg text-cyan-200"
          >
            Atau hubungi tim kami di <a href="tel:+621234567890" className="font-semibold hover:underline whitespace-nowrap">+62 123 4567 890</a> / <a href="mailto:info@sentrabase.id" className="font-semibold hover:underline whitespace-nowrap">info@sentrabase.id</a>
          </motion.p>
        </div>
      </section>

      <ScheduleDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </>
  );
};

export default FinalCTASection;