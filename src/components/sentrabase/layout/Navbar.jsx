import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Menu, X } from 'lucide-react';
import ScheduleDemoModal from '../ScheduleDemoModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const navLinks = [
    { href: "#problem", label: "Masalah" },
    { href: "#solution", label: "Solusi" },
    { href: "#pillars", label: "Manfaat" },
    { href: "#pricing", label: "Harga" },
    { href: "#trust", label: "Kepercayaan" },
  ];

  const handleScheduleDemo = () => {
    setIsDemoModalOpen(true);
  };


  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-lg shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ShieldCheck className="w-10 h-10 text-cyan-400" />
              <span className="text-2xl font-bold text-white">Sentrabase</span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
                >
                  {link.label}
                </a>
              ))}
              
              {/* Customer Login Button */}
              <Button
                onClick={() => window.location.href = '/login'}
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300"
              >
                Customer Login
              </Button>
              
              <Button
                onClick={handleScheduleDemo}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Jadwalkan Demo
              </Button>
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-7 h-7 text-gray-300" /> : <Menu className="w-7 h-7 text-gray-300" />}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <motion.div
              className="md:hidden bg-slate-800/95 backdrop-blur-md rounded-lg mt-2 p-6 shadow-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-gray-200 hover:text-cyan-400 transition-colors duration-300 py-2 text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                
                {/* Customer Login Button - Mobile */}
                <Button
                  onClick={() => {
                    window.location.href = '/login';
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Customer Login
                </Button>
                
                <Button
                  onClick={() => {
                    handleScheduleDemo();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-4"
                >
                  Jadwalkan Demo
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      <ScheduleDemoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;