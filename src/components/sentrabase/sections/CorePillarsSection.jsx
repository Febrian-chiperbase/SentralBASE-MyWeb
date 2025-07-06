import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Workflow, Users, CheckCircle } from 'lucide-react';

const pillarsData = [
  {
    icon: ShieldAlert,
    title: "Keamanan & Kepatuhan Tanpa Kompromi",
    description: "Sistem audit trail lengkap, backup data terenkripsi otomatis, dan laporan kepatuhan bulanan untuk ketenangan pikiran Anda.",
    benefit: "Tidur nyenyak mengetahui data klinik Anda aman dan patuh regulasi.",
    features: ["Audit Trail Komprehensif", "Backup Terenkripsi Otomatis", "Laporan Kepatuhan Bulanan"],
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/50"
  },
  {
    icon: Workflow,
    title: "Alur Kerja Cerdas & Efisien",
    description: "Manajemen antrean pasien digital, notifikasi otomatis untuk dokter dan staf, serta input data vital yang terintegrasi.",
    benefit: "Menghemat jam kerja staf, meningkatkan layanan, dan mengurangi human error.",
    features: ["Manajemen Antrean Digital", "Notifikasi Dokter & Staf", "Input Vital Terintegrasi"],
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/50"
  },
  {
    icon: Users,
    title: "Pengalaman Pasien Modern",
    description: "Sistem booking online terintegrasi (opsional portal pasien mandiri) untuk kemudahan akses dan kenyamanan pasien.",
    benefit: "Meningkatkan loyalitas pasien, mengurangi no-show, dan daya saing klinik Anda.",
    features: ["Booking Online Internal", "Portal Pasien (Opsional)", "Pengingat Janji Temu"],
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/50"
  }
];

const CorePillarsSection = () => {
  return (
    <section id="pillars" className="py-20 bg-slate-800 text-gray-100">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tiga Pilar Utama <span className="text-cyan-400">Sentrabase</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Menerjemahkan fitur teknis menjadi benefit yang bisa dirasakan langsung oleh pemilik klinik.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillarsData.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className={`p-8 rounded-xl shadow-xl ${pillar.bgColor} border ${pillar.borderColor} hover:shadow-lg hover:shadow-${pillar.color.split('-')[1]}-500/30 transition-all duration-300 flex flex-col`}
            >
              <div className="flex-grow">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${pillar.bgColor} border-2 ${pillar.borderColor}`}>
                  <pillar.icon className={`w-8 h-8 ${pillar.color}`} />
                </div>
                <h3 className={`text-2xl font-semibold ${pillar.color} mb-3`}>{pillar.title}</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{pillar.description}</p>
                <ul className="space-y-2 mb-6">
                    {pillar.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                            <CheckCircle className={`w-5 h-5 ${pillar.color} mr-2 mt-1 flex-shrink-0`} />
                            <span className="text-gray-300">{feature}</span>
                        </li>
                    ))}
                </ul>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-700">
                <p className="text-lg font-semibold text-white">
                  <span className="text-cyan-400">Benefit:</span> {pillar.benefit}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CorePillarsSection;