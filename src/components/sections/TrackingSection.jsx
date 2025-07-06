
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Search } from 'lucide-react';

const exampleTrackingStatus = [
  { status: "Paket diterima", time: "2024-01-15 09:00", location: "Jakarta, Indonesia" },
  { status: "Dalam proses sorting", time: "2024-01-15 14:30", location: "Hub Jakarta" },
  { status: "Dalam perjalanan", time: "2024-01-16 08:00", location: "Pesawat menuju Singapura" },
  { status: "Tiba di negara tujuan", time: "2024-01-16 18:45", location: "Singapura" }
];

const TrackingSection = () => {
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleTrackPackage = () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Nomor Resi Diperlukan",
        description: "Silakan masukkan nomor resi untuk melacak paket Anda.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  return (
    <section id="tracking" className="py-16 bg-white/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold gradient-text mb-4">Lacak Paket Anda</h2>
          <p className="text-xl text-gray-600">
            Masukkan nomor resi untuk melihat status pengiriman real-time
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Masukkan nomor resi (contoh: GS123456789)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <Button
              onClick={handleTrackPackage}
              className="gradient-bg text-white hover:opacity-90 px-8"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Lacak Paket
            </Button>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Contoh Status Tracking:</h3>
            <div className="space-y-3">
              {exampleTrackingStatus.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.status}</p>
                    <p className="text-sm text-gray-600">{item.time} - {item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrackingSection;
