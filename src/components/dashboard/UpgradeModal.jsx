import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Check, Star, Users, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UpgradeModal = ({ 
  isOpen, 
  onClose, 
  currentPackage, 
  availableUpgrades, 
  onConfirmUpgrade 
}) => {
  if (!isOpen) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  const calculateSavings = (currentPrice, newPrice) => {
    return newPrice - currentPrice;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Upgrade Package</h2>
                  <p className="text-sm text-gray-600">Tingkatkan paket Anda untuk fitur yang lebih lengkap</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Current Package */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Paket Saat Ini</h3>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{currentPackage?.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{currentPackage?.displayName}</h4>
                      <p className="text-sm text-gray-600">{currentPackage?.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      Rp {formatPrice(currentPackage?.price)}
                    </div>
                    <div className="text-sm text-gray-600">per tahun</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Upgrades */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Pilihan Upgrade</h3>
              <div className="grid gap-4">
                {availableUpgrades.map((upgrade) => {
                  const additionalCost = calculateSavings(currentPackage?.price || 0, upgrade.price);
                  
                  return (
                    <motion.div
                      key={upgrade.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 hover:border-blue-300 transition-all cursor-pointer"
                      onClick={() => onConfirmUpgrade(upgrade)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            upgrade.id === 'professional' 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                              : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                          }`}>
                            <span className="text-white text-lg">{upgrade.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{upgrade.displayName}</h4>
                            <p className="text-gray-600">{upgrade.description}</p>
                          </div>
                        </div>
                        {upgrade.popular && (
                          <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Popular
                          </div>
                        )}
                      </div>

                      {/* Package Limits */}
                      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-white/50 rounded-lg">
                        <div className="text-center">
                          <Users className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                          <div className="text-xs text-gray-600">Users</div>
                          <div className="text-sm font-semibold text-gray-900">{upgrade.maxUsers}</div>
                        </div>
                        <div className="text-center">
                          <Database className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                          <div className="text-xs text-gray-600">Patients</div>
                          <div className="text-sm font-semibold text-gray-900">{upgrade.maxPatients}</div>
                        </div>
                        <div className="text-center">
                          <Zap className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                          <div className="text-xs text-gray-600">Features</div>
                          <div className="text-sm font-semibold text-gray-900">{upgrade.features.length}+</div>
                        </div>
                      </div>

                      {/* Key Features */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-900 mb-2">Fitur Unggulan:</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {upgrade.features.slice(0, 6).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/50">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            Rp {formatPrice(upgrade.price)}
                          </div>
                          <div className="text-sm text-gray-600">per tahun</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Biaya tambahan:</div>
                          <div className="text-lg font-bold text-orange-600">
                            +Rp {formatPrice(additionalCost)}
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <Button 
                        className={`w-full mt-4 font-semibold ${
                          upgrade.id === 'professional'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                            : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Upgrade ke {upgrade.name}
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Keuntungan Upgrade
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Akses fitur premium dan advanced analytics</li>
                <li>• Kapasitas users dan patients yang lebih besar</li>
                <li>• Priority support dan dedicated account manager</li>
                <li>• Integrasi dengan sistem eksternal (BPJS, Lab, dll)</li>
                <li>• Setup dan training tambahan included</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>💡 <strong>Tips:</strong> Upgrade dapat dilakukan kapan saja tanpa mengganggu operasional klinik</p>
              </div>
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6"
              >
                Tutup
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpgradeModal;
