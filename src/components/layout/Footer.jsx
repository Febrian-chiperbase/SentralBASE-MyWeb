import React from 'react';
import { Plane } from 'lucide-react';

const Footer = () => {
  const serviceLinks = [
    { href: "#", label: "Express Air" },
    { href: "#", label: "Sea Freight" },
    { href: "#", label: "Land Express" },
    { href: "#", label: "Tracking" },
    { href: "#", label: "Asuransi" },
  ];

  const companyLinks = [
    { href: "#", label: "Tentang Kami" },
    { href: "#", label: "Karir" },
    { href: "#", label: "Berita" },
    { href: "#", label: "Kontak" },
    { href: "#", label: "FAQ" },
  ];

  const legalLinks = [
    { href: "#", label: "Kebijakan Privasi" },
    { href: "#", label: "Syarat & Ketentuan" },
    { href: "#", label: "Sitemap" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">GlobalShip Express</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Layanan pengiriman internasional terpercaya dengan jangkauan global
              dan teknologi tracking terdepan untuk kepuasan pelanggan.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">in</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-lg font-semibold mb-4 block">Layanan</span>
            <ul className="space-y-3 text-gray-400">
              {serviceLinks.map(link => (
                <li key={link.label}><a href={link.href} className="hover:text-white transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-lg font-semibold mb-4 block">Perusahaan</span>
            <ul className="space-y-3 text-gray-400">
              {companyLinks.map(link => (
                <li key={link.label}><a href={link.href} className="hover:text-white transition-colors">{link.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} GlobalShip Express. Semua hak dilindungi.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            {legalLinks.map(link => (
              <a key={link.label} href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">{link.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;