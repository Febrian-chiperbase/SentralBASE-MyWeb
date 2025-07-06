import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plane, Menu, X } from 'lucide-react';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [{
    href: "#beranda",
    label: "Beranda"
  }, {
    href: "#layanan",
    label: "Layanan"
  }, {
    href: "#tracking",
    label: "Tracking"
  }, {
    href: "#kontak",
    label: "Kontak"
  }];
  return <nav className="fixed top-0 w-full z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div className="flex items-center space-x-2" initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5
        }}>
            <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">artaexpress</span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => <a key={link.href} href={link.href} className="text-gray-700 hover:text-blue-600 transition-colors">
                {link.label}
              </a>)}
            <Button className="gradient-bg text-white hover:opacity-90">
              Kirim Sekarang
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && <motion.div className="md:hidden bg-white/90 backdrop-blur-lg rounded-lg mt-2 p-4" initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }}>
            <div className="flex flex-col space-y-4">
              {navLinks.map(link => <a key={link.href} href={link.href} className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </a>)}
              <Button className="gradient-bg text-white hover:opacity-90 w-full">
                Kirim Sekarang
              </Button>
            </div>
          </motion.div>}
      </div>
    </nav>;
};
export default Navbar;