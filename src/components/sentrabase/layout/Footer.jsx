import React from 'react';
import { ShieldCheck, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-400 py-12 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">Sentrabase</span>
            </div>
            <p className="text-sm">
              Platform terpusat untuk keamanan & efisiensi klinik Anda.
            </p>
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-200 mb-4 block">Link Cepat</span>
            <ul className="space-y-2">
              <li><a href="#problem" className="hover:text-cyan-400 transition-colors">Masalah</a></li>
              <li><a href="#solution" className="hover:text-cyan-400 transition-colors">Solusi Kami</a></li>
              <li><a href="#pillars" className="hover:text-cyan-400 transition-colors">Manfaat Utama</a></li>
              <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Paket Harga</a></li>
            </ul>
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-200 mb-4 block">Hubungi Kami</span>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-cyan-400" />
                <span>+62 123 4567 890</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-cyan-400" />
                <span>info@sentrabase.id</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center">
          <p className="text-sm">
            &copy; {currentYear} Sentrabase. Semua hak dilindungi.
          </p>
          <p className="text-xs mt-1">
            Dirancang untuk keamanan dan efisiensi klinik modern.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;