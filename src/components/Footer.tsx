import React from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter,
  ArrowUp
} from 'lucide-react';
const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' }
  ];

  const services = [
    'Wedding Planning',
    'Corporate Events',
    'Photography',
    'Catering',
    'Decor & Styling',
    'Entertainment'
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' }
  ];

  return (
    <footer className="relative bg-zinc-950 border-t border-yellow-500/10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.02)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(192,192,192,0.02)_0%,transparent_50%)] z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 py-16 relative z-10">
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl text-transparent bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text mb-6 font-light">
              Sintu Decorators
            </h3>
            <p className="text-gray-300 leading-relaxed mb-8 font-light">
              Creating unforgettable Indian celebrations with authentic elegance 
              and modern sophistication since 2008.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-300">
                <Phone size={16} className="text-yellow-500" />
                <span className="text-sm font-light">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail size={16} className="text-yellow-500" />
                <span className="text-sm font-light">info@sintudecorators.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={16} className="text-yellow-500" />
                <span className="text-sm font-light">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg text-yellow-500 mb-6 font-normal">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-gray-300 hover:text-yellow-500 transition-colors font-light"
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg text-yellow-500 mb-6 font-normal">Our Services</h4>
            <ul className="flex flex-col gap-3">
              {services.map((service) => (
                <li key={service}>
                  <motion.a
                    href="#services"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-gray-300 hover:text-yellow-500 transition-colors font-light"
                  >
                    {service}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg text-yellow-500 mb-6 font-normal">Follow Us</h4>
            <p className="text-gray-300 leading-relaxed mb-8 font-light">
              Stay connected for the latest updates and event inspiration.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-zinc-900/80 border border-yellow-500/10 rounded-md flex items-center justify-center text-yellow-500 transition-all hover:bg-yellow-500 hover:text-black hover:border-yellow-500"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-yellow-500/10 py-6 relative z-10">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-gray-300 font-light">&copy; 2024 Sintu Decorators. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#privacy" className="text-sm text-gray-300 hover:text-yellow-500 transition-colors font-light">
                Privacy Policy
              </a>
              <a href="#terms" className="text-sm text-gray-300 hover:text-yellow-500 transition-colors font-light">
                Terms of Service
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.button
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-black cursor-pointer shadow-lg shadow-yellow-500/20 transition-all hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-1 z-50"
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
      >
        <ArrowUp size={20} />
      </motion.button>
    </footer>
  );
};

export default Footer;
