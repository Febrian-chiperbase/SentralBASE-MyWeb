import React from 'react';
import { motion } from 'framer-motion';
import { Server, Cloud, ArrowRightLeft, ShieldCheck } from 'lucide-react';

const SolutionSection = () => {
  return (
    <section id="solution" className="py-20 bg-slate-900 text-gray-100">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Kami Merancang Arsitektur yang Berbeda:
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Keamanan di Klinik, Kecerdasan di Cloud.
            </span>
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-slate-800 p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-700"
          >
            <div className="flex flex-col md:flex-row items-center justify-around gap-8 md:gap-16">
              <div className="text-center md:text-left w-full md:w-2/5">
                <Server className="w-16 h-16 text-green-400 mx-auto md:mx-0 mb-4" />
                <h3 className="text-3xl font-bold text-white mb-3">Benteng Pribadi <span className="text-sm text-gray-400">(On-Premise)</span></h3>
                <p className="text-gray-300 leading-relaxed">
                  Data rekam medis pasien Anda yang paling sensitif tersimpan aman di server fisik di dalam klinik Anda. Bukan di cloud pihak ketiga. Kedaulatan data penuh.
                </p>
              </div>

              <div className="my-8 md:my-0">
                <ArrowRightLeft className="w-12 h-12 md:w-16 md:h-16 text-cyan-400 transform md:rotate-0 rotate-90" />
                 <ShieldCheck className="w-8 h-8 text-green-500 absolute transform translate-x-2 -translate-y-10 md:translate-x-4 md:-translate-y-5"/>
              </div>

              <div className="text-center md:text-right w-full md:w-2/5">
                <Cloud className="w-16 h-16 text-blue-400 mx-auto md:ml-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-3">Control Plane <span className="text-sm text-gray-400">(Cloud)</span></h3>
                <p className="text-gray-300 leading-relaxed">
                  Tim kami mengelola, memantau, dan mengamankan sistem Anda 24/7 dari pusat komando kami, memberikan Anda pembaruan, backup, dan fitur cerdas tanpa Anda perlu repot.
                </p>
              </div>
            </div>
            <div className="mt-12 text-center">
               <img  alt="Diagram Arsitektur Sentrabase Hybrid Cloud" className="mx-auto rounded-lg shadow-lg border border-slate-600" src="https://images.unsplash.com/photo-1643101807331-21a4a3f081d5" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;