import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, ArrowRight, Sparkles, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import LiquidEther from './Backgrounds/LiquidEther/LiquidEther';
import ShinyText from './TextAnimations/ShinyText/ShinyText';

const ContactSuccess: React.FC = () => {
  useEffect(() => {
    // Entrance animations
    gsap.fromTo(
      '.success-container',
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }
    );

    gsap.fromTo(
      '.success-icon',
      { scale: 0, rotation: -180 },
      { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(2)', delay: 0.3 }
    );

    gsap.fromTo(
      '.success-actions',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.8 }
    );

    // Floating animation for decorative elements
    gsap.to('.floating-sparkle', {
      y: -10,
      rotation: 15,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.2
    });
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-black to-yellow-900/10">
      {/* Background Liquid Effect */}
      <div className="absolute inset-0 -z-10 opacity-50 pointer-events-none">
        <LiquidEther
          colors={['#ca8a04','#eab308','#fbbf24','#fde047']}
          mouseForce={20}
          cursorSize={150}
          autoDemo={true}
          autoSpeed={0.3}
          autoIntensity={1.8}
          resolution={0.6}
          isViscous={true}
          viscous={25}
          className="w-full h-full"
        />
      </div>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Sparkles className="floating-sparkle absolute top-1/4 left-1/4 w-6 h-6 text-yellow-400/30" />
        <Sparkles className="floating-sparkle absolute top-3/4 right-1/4 w-4 h-4 text-yellow-300/40" />
        <Sparkles className="floating-sparkle absolute top-1/2 right-1/3 w-5 h-5 text-yellow-500/20" />
      </div>

      {/* Main Content */}
      <motion.div 
        className="success-container max-w-2xl mx-auto p-12 lg:p-16 bg-black/80 backdrop-blur-2xl border border-yellow-500/20 rounded-3xl shadow-2xl shadow-yellow-500/10 text-center relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Success Icon */}
        <motion.div className="success-icon relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
            <CheckCircle className="w-12 h-12 text-white" strokeWidth={2} />
          </div>
        </motion.div>

        {/* Main Heading */}
        <div className="mb-6">
          <h1 className="text-5xl md:text-6xl font-light mb-4 text-yellow-400 font-serif tracking-tight">
            <ShinyText
              text="Message Received"
              disabled={false}
              speed={3}
              className="inline-block"
            />
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-6"></div>
        </div>

        {/* Success Message */}
        <div className="mb-10 space-y-4">
          <p className="text-xl text-gray-200 leading-relaxed font-light">
            Thank you for contacting <span className="text-yellow-400 font-medium">Sintu Decorators</span>
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            Our event planning specialists will review your inquiry and get back to you within <span className="text-yellow-300 font-medium">24 hours</span>.
          </p>
          
          {/* What happens next section */}
          <div className="pt-6 space-y-3">
            <h3 className="text-lg font-medium text-yellow-400 mb-4">What happens next?</h3>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-8 h-8 bg-yellow-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-yellow-400" />
              </div>
              <span>Our team reviews your event requirements</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-8 h-8 bg-yellow-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-yellow-400" />
              </div>
              <span>We'll schedule a consultation to discuss your vision</span>
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Get ready to create something extraordinary
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          className="success-actions flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link 
            to="/contact" 
            className="group px-8 py-4 rounded-xl bg-zinc-900/80 border border-yellow-500/30 hover:border-yellow-500/60 hover:bg-zinc-800/90 transition-all duration-300 text-yellow-300 hover:text-yellow-200 backdrop-blur-sm min-w-[160px] flex items-center justify-center gap-2"
          >
            <span className="font-medium">Submit Another</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            to="/" 
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium transition-all duration-300 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-105 min-w-[160px] flex items-center justify-center gap-2"
          >
            <Home size={18} className="group-hover:scale-110 transition-transform" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="mt-12 pt-8 border-t border-yellow-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            Need immediate assistance? Call us at <span className="text-yellow-400">+91 98765 43210</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactSuccess;
