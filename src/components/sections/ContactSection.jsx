
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

const contactInfo = [
  { icon: Phone, label: "Telepon", value: "+62 21 1234 5678" },
  { icon: Mail, label: "Email", value: "info@globalshipexpress.com" },
  { icon: MapPin, label: "Alamat", value: "Jl. Sudirman No. 123, Jakarta Pusat 10220" },
];

const operationalHours = [
  "Senin - Jumat: 08:00 - 18:00 WIB",
  "Sabtu: 08:00 - 15:00 WIB",
  "Minggu: Customer Service Online 24/7",
];

const subjectOptions = [
  { value: "inquiry", label: "Pertanyaan Umum" },
  { value: "quote", label: "Permintaan Penawaran" },
  { value: "complaint", label: "Keluhan" },
  { value: "tracking", label: "Masalah Tracking" },
];

const ContactSection = () => {
  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  return (
    <section id="kontak" className="py-16 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold gradient-text mb-4">Hubungi Kami</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tim customer service kami siap membantu Anda 24/7
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Informasi Kontak</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{info.label}</p>
                      <p className="text-gray-600">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Jam Operasional</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {operationalHours.map((hour, index) => <p key={index}>{hour}</p>)}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Kirim Pesan</h3>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Masukkan email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Masukkan nomor telepon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjek</label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors">
                  <option value="">Pilih subjek</option>
                  {subjectOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tulis pesan Anda di sini..."
                ></textarea>
              </div>
              <Button
                type="submit"
                className="w-full gradient-bg text-white hover:opacity-90"
                size="lg"
              >
                Kirim Pesan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;