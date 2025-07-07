import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        🏥 SentraBASE Test
      </h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">✅ Website Status</h2>
          <p className="text-gray-300">
            Jika Anda melihat halaman ini, berarti React dan Tailwind CSS berfungsi dengan baik.
          </p>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🔧 Troubleshooting</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• Server development: ✅ Running</li>
            <li>• React: ✅ Working</li>
            <li>• Tailwind CSS: ✅ Working</li>
            <li>• Basic components: ✅ Working</li>
          </ul>
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-cyan-400">📋 Next Steps</h2>
          <p className="text-gray-300">
            Sekarang kita akan mengembalikan komponen utama satu per satu untuk menemukan masalahnya.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
