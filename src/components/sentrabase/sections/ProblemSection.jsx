import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Lock, BarChartHorizontalBig, FileText } from 'lucide-react';

const painPoints = [
  {
    icon: FileText,
    title: "Kewajiban Regulasi",
    description: "Cemas tidak bisa memenuhi standar SatuSehat dari Kemenkes?",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10"
  },
  {
    icon: Lock,
    title: "Risiko Keamanan Data",
    description: "Khawatir data pasien rentan terhadap ransomware atau kebocoran?",
    color: "text-red-400",
    bgColor: "bg-red-500/10"
  },
  {
    icon: BarChartHorizontalBig,
    title: "Inefisiensi Alur Kerja",
    description: "Staf menghabiskan waktu untuk mencari data dan mengelola antrean secara manual?",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10"
  },
];

const ProblemSection = () => {
  return (
    <section id="problem" className="py-20 bg-slate-800 text-gray-100">
      <div className="container mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Berjuang dengan <span className="text-cyan-400">Kepatuhan RME</span>,
            <br className="sm:hidden" /> Keamanan Data, dan Operasional yang Tercecer?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className={`p-8 rounded-xl shadow-xl ${point.bgColor} border border-slate-700 hover:shadow-cyan-500/20 transition-shadow duration-300`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${point.bgColor} border-2 ${point.color.replace('text-', 'border-')}`}>
                <point.icon className={`w-8 h-8 ${point.color}`} />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">{point.title}</h3>
              <p className="text-gray-300 leading-relaxed">{point.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;