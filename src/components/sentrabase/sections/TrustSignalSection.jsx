import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Zap, ShieldCheck, Verified } from 'lucide-react';

const TrustSignalSection = () => {
  return (
    <section id="trust" className="py-20 bg-slate-800 text-gray-100">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Kenapa Harus <span className="text-cyan-400">Percaya Pada Kami</span>?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-slate-700/50 p-8 rounded-xl shadow-xl border border-slate-600"
          >
            <h3 className="text-3xl font-semibold text-white mb-6">Apa Kata Mereka yang Telah Menggunakan Sentrabase</h3>
            <div className="space-y-8">
              {[1, 2].map((testimonialId) => (
                <div key={testimonialId} className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
                  <Quote className="w-8 h-8 text-cyan-400 mb-4 opacity-50" />
                  <p className="text-gray-300 italic mb-4">
                    "Tempat untuk testimoni klien. Saat ini masih kosong, namun desainnya sudah siap."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-white">TK</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Nama Klien {testimonialId}</p>
                      <p className="text-sm text-gray-400">Posisi, Nama Klinik</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-slate-700/50 p-8 rounded-xl shadow-xl border border-slate-600">
              <h3 className="text-3xl font-semibold text-white mb-6">Filosofi Kami</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Di Sentrabase, kami percaya bahwa <strong className="text-cyan-400">kedaulatan data pasien adalah hak fundamental</strong>. Kami berkomitmen untuk menyediakan solusi teknologi yang tidak hanya canggih dan efisien, tetapi juga menempatkan keamanan dan privasi data sebagai prioritas tertinggi. 
              </p>
              <p className="text-gray-300 leading-relaxed">
                Arsitektur hibrida kami adalah cerminan dari filosofi ini, memberikan Anda kendali penuh atas data sensitif sambil menikmati kemudahan pengelolaan dari cloud.
              </p>
            </div>

            <div className="bg-slate-700/50 p-8 rounded-xl shadow-xl border border-slate-600">
              <h3 className="text-3xl font-semibold text-white mb-6">Mitra & Sertifikasi</h3>
              <p className="text-gray-300 mb-6">Kami bangga berkolaborasi dengan pemimpin teknologi dan berusaha memenuhi standar industri tertinggi.</p>
              <div className="flex flex-wrap gap-6 items-center justify-center md:justify-start">
                <div className="flex items-center space-x-2 p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <span className="text-sm text-gray-300">Powered by TechPartner A</span>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <ShieldCheck className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-gray-300">Security Certified by Org B</span>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <Verified className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-gray-300">SatuSehat Ready</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">(Logo mitra/sertifikasi akan ditampilkan di sini)</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignalSection;