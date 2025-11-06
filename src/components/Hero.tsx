import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CardSwap, { Card } from './TextAnimations/CardSwap/CardSwap';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 z-10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 h-screen flex flex-col justify-center">
        <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-16 items-center">
          <div className="max-w-3xl">
          <motion.h1 
            className="text-6xl md:text-7xl lg:text-8xl font-light text-white mb-8 font-playfair sparkle-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileTap={{
              scale: 0.98,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
          >
            Sintu
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Decorators
            </motion.span>
          </motion.h1>
          
          <motion.h2
            className="text-4xl md:text-5xl font-light text-white mb-8 font-playfair"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Creating
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
              Timeless Moments
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 font-light max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Luxury event decorations that transform your special occasions into unforgettable experiences.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/gallery" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg transition-all hover:from-yellow-600 hover:to-yellow-500 font-medium tracking-wide"
              >
                View Gallery
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/contact" 
                className="inline-flex items-center px-8 py-4 border border-yellow-500 text-yellow-500 rounded-lg transition-all hover:bg-yellow-500 hover:text-black font-medium tracking-wide"
              >
                Get in Touch
              </Link>
            </motion.div>
          </motion.div>
          </div>
          {/* CardSwap visual beside hero text on large screens */}
          <div className="relative hidden xl:block">
            <CardSwap
              width={620}
              height={520}
              cardDistance={60}
              verticalDistance={80}
              delay={3500}
              skewAmount={4}
              easing="elastic"
              containerClassName="flex justify-center"
            >
              <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-700/5 border-yellow-500/30 p-6 flex flex-col justify-between shadow-[0_0_25px_-5px_rgba(234,179,8,0.25)]">
                <div>
                  <h3 className="text-2xl font-serif text-yellow-400 mb-4">Weddings</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">Elegant mandaps, floral artistry, and immersive ambience design for unforgettable ceremonies.</p>
                </div>
                <span className="mt-6 text-xs tracking-widest text-yellow-500/70 uppercase">Signature Experience</span>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-500/5 to-yellow-700/5 border-yellow-500/20 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif text-yellow-400 mb-4">Corporate</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">Premium staging, lighting design, and thematic brand environments for high-impact events.</p>
                </div>
                <span className="mt-6 text-xs tracking-widest text-yellow-500/60 uppercase">Professional Detail</span>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/25 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif text-yellow-400 mb-4">Social</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">Birthday, anniversary & milestone celebrations elevated with bespoke styling and mood curation.</p>
                </div>
                <span className="mt-6 text-xs tracking-widest text-yellow-500/60 uppercase">Celebration Craft</span>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-500/5 to-yellow-700/10 border-yellow-500/20 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif text-yellow-400 mb-4">Luxury Design</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">Custom-built installations, layered textures, and atmospheric storytelling through decor.</p>
                </div>
                <span className="mt-6 text-xs tracking-widest text-yellow-500/60 uppercase">Curated Aesthetics</span>
              </Card>
            </CardSwap>
          </div>
        </div>

        {/* Navigation Links */}
        <motion.div 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="flex gap-8 items-center justify-center">
            <Link to="/about" className="text-yellow-200 font-light text-lg tracking-widest uppercase font-serif hover:text-yellow-500 transition-all">
              About
            </Link>
            <Link to="/gallery" className="text-yellow-200 font-light text-lg tracking-widest uppercase font-serif hover:text-yellow-500 transition-all">
              Gallery
            </Link>
            <Link to="/contact" className="text-yellow-200 font-light text-lg tracking-widest uppercase font-serif hover:text-yellow-500 transition-all">
              Contact
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
