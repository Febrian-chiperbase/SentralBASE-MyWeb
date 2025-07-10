import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Check, X, Calculator, DollarSign, Zap } from 'lucide-react';

const PaymentGatewayComparison = () => {
  const [selectedAmount, setSelectedAmount] = useState(30000000); // Default Professional package

  const gateways = [
    {
      name: 'DOKU',
      logo: '🏆',
      recommended: true,
      cheapest: true,
      fees: {
        virtualAccount: 2500,
        ewallet: 1500,
        creditCard: 0.025
      },
      pros: [
        'Fee termurah di Indonesia',
        'Support semua bank major',
        'API documentation lengkap',
        'Dashboard monitoring bagus',
        'Settlement T+1',
        'No monthly fee'
      ],
      cons: [
        'Brand awareness lebih rendah',
        'Customer support tidak 24/7'
      ],
      color: 'green'
    },
    {
      name: 'Xendit',
      logo: '⚡',
      recommended: false,
      cheapest: false,
      fees: {
        virtualAccount: 3000,
        ewallet: 2000,
        creditCard: 0.028
      },
      pros: [
        'API sangat bagus',
        'Dashboard modern',
        'Support international',
        'Good documentation'
      ],
      cons: [
        'Fee lebih mahal dari DOKU',
        'Fokus ke startup/tech'
      ],
      color: 'blue'
    },
    {
      name: 'Midtrans',
      logo: '🔵',
      recommended: false,
      cheapest: false,
      fees: {
        virtualAccount: 4000,
        ewallet: 2500,
        creditCard: 0.029
      },
      pros: [
        'Brand populer',
        'Reliable',
        'Support bagus',
        'Banyak merchant'
      ],
      cons: [
        'Fee paling mahal',
        'Setup lebih kompleks'
      ],
      color: 'purple'
    },
    {
      name: 'Manual Transfer',
      logo: '🏦',
      recommended: true,
      cheapest: true,
      fees: {
        virtualAccount: 0,
        ewallet: 0,
        creditCard: 0
      },
      pros: [
        '100% GRATIS',
        'Langsung ke rekening',
        'Full control cash flow',
        'No third party'
      ],
      cons: [
        'Manual verification',
        'Tidak real-time',
        'Perlu customer service'
      ],
      color: 'gray'
    }
  ];

  const calculateFee = (gateway, paymentType) => {
    if (gateway.name === 'Manual Transfer') return 0;
    
    if (paymentType === 'creditCard') {
      return Math.round(selectedAmount * gateway.fees.creditCard);
    }
    return gateway.fees[paymentType];
  };

  const calculateTotal = (gateway, paymentType) => {
    return selectedAmount + calculateFee(gateway, paymentType);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const getColorClasses = (color, recommended, cheapest) => {
    const baseClasses = {
      green: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50',
      blue: 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50',
      purple: 'border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50',
      gray: 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50'
    };

    if (recommended && cheapest) {
      return 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 ring-2 ring-green-200';
    }

    return baseClasses[color];
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          💰 Payment Gateway Comparison
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Pilih payment gateway termurah untuk SentraBASE
        </p>
        
        {/* Amount Selector */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 inline-block">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Simulasi Biaya untuk Transaksi:
          </label>
          <select
            value={selectedAmount}
            onChange={(e) => setSelectedAmount(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value={15000000}>Starter - Rp 15.000.000</option>
            <option value={30000000}>Professional - Rp 30.000.000</option>
            <option value={50000000}>Enterprise - Rp 50.000.000</option>
          </select>
        </div>
      </div>

      {/* Gateway Comparison Cards */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {gateways.map((gateway, index) => (
          <motion.div
            key={gateway.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-2xl border-2 p-6 ${getColorClasses(gateway.color, gateway.recommended, gateway.cheapest)}`}
          >
            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-1">
              {gateway.recommended && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Recommended
                </span>
              )}
              {gateway.cheapest && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                  Cheapest
                </span>
              )}
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{gateway.logo}</div>
              <h3 className="text-xl font-bold text-gray-900">{gateway.name}</h3>
            </div>

            {/* Fee Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Virtual Account</div>
                <div className="font-bold text-gray-900">
                  {gateway.fees.virtualAccount === 0 ? 'GRATIS' : `Rp ${formatCurrency(gateway.fees.virtualAccount)}`}
                </div>
                <div className="text-xs text-gray-500">
                  Total: Rp {formatCurrency(calculateTotal(gateway, 'virtualAccount'))}
                </div>
              </div>
              
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-sm text-gray-600">E-wallet</div>
                <div className="font-bold text-gray-900">
                  {gateway.fees.ewallet === 0 ? 'GRATIS' : `Rp ${formatCurrency(gateway.fees.ewallet)}`}
                </div>
                <div className="text-xs text-gray-500">
                  Total: Rp {formatCurrency(calculateTotal(gateway, 'ewallet'))}
                </div>
              </div>
              
              <div className="bg-white/50 rounded-lg p-3">
                <div className="text-sm text-gray-600">Credit Card</div>
                <div className="font-bold text-gray-900">
                  {gateway.fees.creditCard === 0 ? 'GRATIS' : `${(gateway.fees.creditCard * 100).toFixed(1)}%`}
                </div>
                <div className="text-xs text-gray-500">
                  Total: Rp {formatCurrency(calculateTotal(gateway, 'creditCard'))}
                </div>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Pros
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {gateway.pros.slice(0, 3).map((pro, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  Cons
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {gateway.cons.slice(0, 2).map((con, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-red-500 mt-0.5">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cost Comparison Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Perbandingan Biaya Tahunan
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Asumsi: 100 transaksi per tahun dengan nilai Rp {formatCurrency(selectedAmount)}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gateway
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee per Transaksi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  100 Transaksi/Tahun
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % dari Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {gateways.map((gateway) => {
                const feePerTransaction = calculateFee(gateway, 'virtualAccount');
                const annualFee = feePerTransaction * 100;
                const percentage = ((annualFee / (selectedAmount * 100)) * 100).toFixed(3);
                
                return (
                  <tr key={gateway.name} className={gateway.cheapest ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{gateway.logo}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{gateway.name}</div>
                          {gateway.recommended && (
                            <div className="text-xs text-green-600 font-semibold">Recommended</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {feePerTransaction === 0 ? 'GRATIS' : `Rp ${formatCurrency(feePerTransaction)}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {annualFee === 0 ? 'GRATIS' : `Rp ${formatCurrency(annualFee)}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{percentage}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {gateway.cheapest && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Termurah
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-900 mb-2">
              💡 Rekomendasi untuk SentraBASE
            </h3>
            <div className="text-green-800 space-y-2">
              <p>
                <strong>Primary:</strong> Gunakan <strong>DOKU</strong> sebagai payment gateway utama karena fee termurah (Rp 1.500 - Rp 2.500 per transaksi)
              </p>
              <p>
                <strong>Backup:</strong> Tetap sediakan <strong>Manual Transfer</strong> untuk customer yang ingin 100% gratis
              </p>
              <p>
                <strong>Savings:</strong> Dengan DOKU vs Midtrans, Anda hemat <strong>Rp 150.000/tahun</strong> untuk 100 transaksi
              </p>
            </div>
            
            <div className="mt-4 flex gap-3">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                Implementasi DOKU
              </button>
              <button className="bg-white text-green-700 px-4 py-2 rounded-lg font-semibold border border-green-300 hover:bg-green-50 transition-colors">
                Lihat Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayComparison;
