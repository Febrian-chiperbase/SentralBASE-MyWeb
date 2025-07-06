
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Plane, Ship, Truck, CheckCircle, ArrowRight } from 'lucide-react';

const servicesData = [
  {
    icon: Plane,
    title: "Express Air",
    time: "1-3 Hari",
    price: "Mulai Rp 150.000",
    features: ["Door-to-door service", "Tracking real-time", "Asuransi penuh", "Prioritas handling"],
    popular: true
  },
  {
    icon: Ship,
    title: "Sea Freight",
    time: "14-30 Hari",
    price: "Mulai Rp 50.000",
    features: ["Ekonomis untuk barang besar", "Tracking tersedia", "Asuransi opsional", "Cocok untuk bulk"],
    popular: false
  },
  {
    icon: Truck,
    title: "Land Express",
    time: "3-7 Hari",
    price: "Mulai Rp 80.000",
    features: ["Khusus Asia Tenggara", "Tracking real-time", "Asuransi tersedia", "Harga kompetitif"],
    popular: false
  }
];

const ServicesSection = () => {
  const handleSelectService = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Jangan khawatir! Anda bisa memintanya di prompt berikutnya! 🚀"
    });
  };

  return (
    <section id="layanan" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold gradient-text mb-4">Layanan Pengiriman</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih layanan yang sesuai dengan kebutuhan dan budget Anda
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                service.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Paling Populer
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-blue-600 font-semibold">{service.time}</p>
                <p className="text-3xl font-bold gradient-text mt-2">{service.price}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${service.popular ? 'gradient-bg text-white' : 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50'}`}
                variant={service.popular ? 'default' : 'outline'}
                onClick={handleSelectService}
              >
                Pilih Layanan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;