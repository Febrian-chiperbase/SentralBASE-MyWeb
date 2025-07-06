import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const pricingPlans = [
  {
    name: "Starter",
    priceMonthly: "Rp 1.500.000",
    priceYearly: "Hemat 2 Bulan!",
    description: "Untuk klinik baru atau praktik mandiri yang membutuhkan dasar yang kuat.",
    features: [
      "Manajemen Pasien & RME",
      "Server On-Premise (Basic)",
      "Support Komunitas",
      "Update Minor Sistem"
    ],
    cta: "Pilih Starter",
    popular: false,
    gradient: "from-gray-700 to-gray-800",
    textColor: "text-gray-300"
  },
  {
    name: "Akselerasi",
    priceMonthly: "Rp 3.000.000",
    priceYearly: "Hemat 2 Bulan!",
    description: "Untuk klinik berkembang yang ingin efisiensi dan keamanan maksimal.",
    features: [
      "Semua di Starter",
      "Server On-Premise (Advanced)",
      "Manajemen Antrean Cerdas",
      "Laporan Kepatuhan Otomatis",
      "Support Prioritas (Email & Chat)",
      "Update Mayor & Minor Sistem"
    ],
    cta: "Pilih Akselerasi",
    popular: true,
    gradient: "from-cyan-500 to-blue-600",
    textColor: "text-white"
  },
  {
    name: "Enterprise",
    priceMonthly: "Hubungi Kami",
    priceYearly: "Solusi Kustom",
    description: "Untuk jaringan klinik besar dengan kebutuhan kustom dan integrasi kompleks.",
    features: [
      "Semua di Akselerasi",
      "Server On-Premise (Dedicated)",
      "Integrasi API Kustom",
      "Portal Pasien Branding",
      "Dedicated Account Manager",
      "SLA Khusus"
    ],
    cta: "Kontak Sales",
    popular: false,
    gradient: "from-purple-600 to-indigo-700",
    textColor: "text-white"
  }
];

const PricingSection = () => {
  const handleChoosePlan = (planName) => {
    toast({
      title: `🚀 Paket ${planName} Dipilih (Contoh)`,
      description: "Terima kasih telah memilih Sentrabase! Tim kami akan menghubungi Anda.",
    });
  };

  return (
    <section id="pricing" className="py-20 bg-slate-900 text-gray-100">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Paket Harga <span className="text-cyan-400">Transparan</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Pilih paket yang paling sesuai dengan kebutuhan dan skala klinik Anda.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative flex flex-col rounded-2xl shadow-2xl p-8 border ${plan.popular ? 'border-cyan-500 ring-2 ring-cyan-400' : 'border-slate-700'} bg-slate-800`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center">
                    <Star className="w-4 h-4 mr-2" /> Paling Populer
                  </span>
                </div>
              )}
              <div className="flex-grow">
                <h3 className={`text-3xl font-bold mb-2 ${plan.popular ? 'text-cyan-400' : 'text-white'}`}>{plan.name}</h3>
                <p className={`text-4xl font-extrabold mb-1 ${plan.popular ? 'text-white' : 'text-gray-200'}`}>{plan.priceMonthly}</p>
                <p className="text-sm text-cyan-400 mb-4 font-medium">{plan.priceMonthly !== "Hubungi Kami" ? "/bulan (ditagih tahunan)" : plan.priceYearly}</p>
                {plan.priceMonthly !== "Hubungi Kami" && <p className="text-green-400 text-xs mb-4 bg-green-500/10 px-2 py-1 rounded-md inline-block">{plan.priceYearly}</p>}
                <p className="text-gray-300 mb-6 h-20">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className={`w-5 h-5 mr-3 flex-shrink-0 ${plan.popular ? 'text-cyan-400' : 'text-green-400'}`} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => handleChoosePlan(plan.name)}
                size="lg"
                className={`w-full mt-auto font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${plan.textColor} bg-gradient-to-r ${plan.gradient} hover:brightness-110`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
         <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12 text-gray-400 text-sm">
            Semua harga belum termasuk PPN 11%. Butuh solusi kustom? <a href="#final-cta" className="text-cyan-400 hover:underline">Hubungi kami</a>.
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;