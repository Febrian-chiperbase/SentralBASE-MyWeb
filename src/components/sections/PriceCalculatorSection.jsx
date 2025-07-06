
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Calculator } from 'lucide-react';
const countryOptions = [{
  value: "indonesia",
  label: "Indonesia"
}, {
  value: "malaysia",
  label: "Malaysia"
}, {
  value: "singapore",
  label: "Singapura"
}, {
  value: "thailand",
  label: "Thailand"
}, {
  value: "usa",
  label: "Amerika Serikat"
}, {
  value: "uk",
  label: "Inggris"
}, {
  value: "australia",
  label: "Australia"
}, {
  value: "japan",
  label: "Jepang"
}, {
  value: "korea",
  label: "Korea Selatan"
}, {
  value: "china",
  label: "China"
}];
const PriceCalculatorSection = () => {
  const [fromCountry, setFromCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [weight, setWeight] = useState('');
  const handleCalculatePrice = () => {
    if (!fromCountry || !toCountry || !weight) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Silakan lengkapi semua field untuk menghitung biaya pengiriman.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };
  return <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} viewport={{
        once: true
      }} className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">Hitung Biaya</h2>
          <p className="text-xl text-gray-600">
            Hitung estimasi biaya pengiriman ke seluruh dunia
          </p>
        </motion.div>

        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.2
      }} viewport={{
        once: true
      }} className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dari Negara</label>
              <select value={fromCountry} onChange={e => setFromCountry(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors">
                <option value="">Pilih negara asal</option>
                {countryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ke Negara</label>
              <select value={toCountry} onChange={e => setToCountry(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors">
                <option value="">Pilih negara tujuan</option>
                {countryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Berat Paket (kg)</label>
            <input type="number" placeholder="Masukkan berat dalam kg" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors" />
          </div>

          <Button onClick={handleCalculatePrice} className="w-full gradient-bg text-white hover:opacity-90" size="lg">
            <Calculator className="w-5 h-5 mr-2" />
            Hitung Biaya Pengiriman
          </Button>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              * Harga yang ditampilkan adalah estimasi. Biaya final akan dikonfirmasi saat pemesanan.
            </p>
          </div>
        </motion.div>
      </div>
    </section>;
};
export default PriceCalculatorSection;