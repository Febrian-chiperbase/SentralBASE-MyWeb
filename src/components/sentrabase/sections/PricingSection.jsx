import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Users, Database, Shield, Zap } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import PaymentModalFixed from '@/components/payment/PaymentModalFixed';

const PricingSection = () => {
  const { pricingPlans, selectPlan, billingCycle, setBillingCycle, calculatePrice } = usePayment();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleChoosePlan = (plan) => {
    selectPlan(plan);
    setShowPaymentModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getDiscountPercentage = (monthly, yearly) => {
    if (!monthly || !yearly) return 0;
    return Math.round(((monthly * 12 - yearly) / (monthly * 12)) * 100);
  };

  return (
    <>
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
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Pilih paket RME yang sesuai dengan kebutuhan dan skala klinik Anda
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <div className="bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Bulanan
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                    billingCycle === 'yearly'
                      ? 'bg-cyan-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Tahunan
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Hemat 17%
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, index) => {
              const pricing = calculatePrice(plan, billingCycle);
              const discount = getDiscountPercentage(plan.monthlyPrice, plan.yearlyPrice);
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col rounded-2xl shadow-2xl p-8 border ${
                    plan.popular 
                      ? 'border-cyan-500 ring-2 ring-cyan-400 bg-gradient-to-b from-slate-800 to-slate-900' 
                      : 'border-slate-700 bg-slate-800'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center">
                        <Star className="w-4 h-4 mr-2" /> Paling Populer
                      </span>
                    </div>
                  )}

                  <div className="flex-grow">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <h3 className={`text-3xl font-bold mb-2 ${plan.popular ? 'text-cyan-400' : 'text-white'}`}>
                        {plan.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">{plan.subtitle}</p>
                      
                      {/* Price Display */}
                      <div className="mb-4">
                        {plan.monthlyPrice ? (
                          <>
                            <div className="flex items-baseline justify-center mb-2">
                              <span className="text-4xl font-extrabold text-white">
                                {formatPrice(billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice)}
                              </span>
                              <span className="text-gray-400 ml-2">
                                /{billingCycle === 'yearly' ? 'tahun' : 'bulan'}
                              </span>
                            </div>
                            {billingCycle === 'yearly' && discount > 0 && (
                              <div className="text-green-400 text-sm bg-green-500/10 px-3 py-1 rounded-full inline-block">
                                Hemat {discount}% dari harga bulanan
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-2xl font-bold text-white mb-2">
                            Hubungi Sales
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-300 text-sm">{plan.description}</p>
                    </div>

                    {/* Plan Limits */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-700/50 rounded-lg">
                      <div className="text-center">
                        <Users className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                        <div className="text-xs text-gray-400">Pasien</div>
                        <div className="text-sm font-semibold text-white">{plan.limits.patients}</div>
                      </div>
                      <div className="text-center">
                        <Shield className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                        <div className="text-xs text-gray-400">Users</div>
                        <div className="text-sm font-semibold text-white">{plan.limits.users}</div>
                      </div>
                      <div className="text-center">
                        <Database className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                        <div className="text-xs text-gray-400">Storage</div>
                        <div className="text-sm font-semibold text-white">{plan.limits.storage}</div>
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className={`w-5 h-5 mr-3 flex-shrink-0 ${
                            plan.popular ? 'text-cyan-400' : 'text-green-400'
                          }`} />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleChoosePlan(plan)}
                    size="lg"
                    className={`w-full mt-auto font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                        : plan.color === 'purple'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white'
                        : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {plan.monthlyPrice ? 'Pilih Paket' : 'Hubungi Sales'}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4">Yang Termasuk di Semua Paket:</h4>
              <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-400" />
                  SSL Certificate
                </div>
                <div className="flex items-center">
                  <Database className="w-4 h-4 mr-2 text-green-400" />
                  Backup Otomatis
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-green-400" />
                  99.9% Uptime
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-green-400" />
                  Training Gratis
                </div>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mt-6">
              Semua harga belum termasuk PPN 11%. Garansi uang kembali 30 hari. 
              <br />
              <a href="#contact" className="text-cyan-400 hover:underline">Hubungi kami</a> untuk konsultasi gratis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Payment Modal */}
      <PaymentModalFixed 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
      />
    </>
  );
};

export default PricingSection;