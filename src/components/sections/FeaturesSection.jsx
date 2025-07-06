
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, Globe, Search, Star, Package } from 'lucide-react';

const featuresData = [
  {
    icon: Clock,
    title: "Pengiriman Cepat",
    description: "Express delivery 1-3 hari ke negara utama dengan layanan door-to-door",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Asuransi Penuh",
    description: "Perlindungan 100% nilai barang dengan klaim mudah dan cepat",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Globe,
    title: "Jangkauan Global",
    description: "Melayani pengiriman ke 200+ negara dengan jaringan partner terpercaya",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Search,
    title: "Tracking Real-time",
    description: "Pantau paket Anda 24/7 dengan update lokasi dan status terkini",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Star,
    title: "Rating 4.9/5",
    description: "Dipercaya 50,000+ pelanggan dengan tingkat kepuasan tinggi",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Package,
    title: "Kemasan Aman",
    description: "Packaging profesional dengan bubble wrap dan box berkualitas tinggi",
    color: "from-indigo-500 to-blue-500"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold gradient-text mb-4">Mengapa Pilih Kami?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kami memberikan layanan terbaik dengan teknologi terdepan untuk memastikan
            paket Anda sampai dengan aman dan tepat waktu.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;