import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Navigation,
  Users,
  Music,
  Utensils,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';
import gsap from 'gsap';
import ShinyText from './TextAnimations/ShinyText/ShinyText';
import Dock from './TextAnimations/Dock/Dock';
import LiquidEther from './Backgrounds/LiquidEther/LiquidEther';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'processing' | 'redirecting'>('idle');
  const isDev = import.meta.env.MODE === 'development';

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      '.contact-container',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    // Title animation
    gsap.fromTo(
      '.contact-header h1',
      { opacity: 0, rotationX: -15, y: 30 },
      {
        opacity: 1,
        rotationX: 0,
        y: 0,
        duration: 1.2,
        ease: 'back.out(1.7)',
        delay: 0.3,
      }
    );
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('sending');
    setError(null);

    const payload = {
      fullName: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      eventType: formData.eventType,
      eventDate: formData.eventDate || null,
      guestCount: formData.guestCount || null,
      // message is optional now
      message: formData.message.trim() || null
    };

    // message (event vision) is optional — don't require it for submission
    if (!payload.fullName || !payload.email || !payload.eventType) {
      setError('Please fill all required fields.');
      setIsSubmitting(false);
      setSubmitStatus('idle');
      return;
    }

    const startedAt = performance.now();
    let attempt = 0;
    const maxAttempts = 2; // one retry on transient failure

    const doRequest = async (): Promise<void> => {
      attempt += 1;
      // After 1.5s still pending -> processing status
      const processingTimer = setTimeout(() => {
        setSubmitStatus(prev => (prev === 'sending' ? 'processing' : prev));
      }, 1500);

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        clearTimeout(processingTimer);
        if (!res.ok) {
          let serverMsg = 'Submission failed';
          try {
            const j = await res.json();
            if (j?.error) serverMsg = j.error;
          } catch { /* ignore */ }
          throw new Error(serverMsg);
        }
        // Parse json (ignore parse failure gracefully)
        let data: unknown = null;
        try { data = await res.json(); } catch { /* ignore */ }
        const ok = (data as { success?: boolean })?.success !== false;
        if (!ok) throw new Error('Unexpected server response');

        const totalMs = performance.now() - startedAt;
        if (isDev) console.log(`[contact] success in ${totalMs.toFixed(1)}ms (attempt ${attempt})`);
        setSubmitStatus('redirecting');
        setTimeout(() => navigate('/contact/success'), 150);
      } catch (err) {
        clearTimeout(processingTimer);
        const totalMs = performance.now() - startedAt;
        const msg = err instanceof Error ? err.message : 'Unexpected error';
        const transient = /fetch|network|timed|Failed to fetch|timeout/i.test(msg);
        if (isDev) console.warn('[contact] attempt failed', { attempt, msg, totalMs: totalMs.toFixed(1) });
        if (attempt < maxAttempts && transient) {
          // brief delay before retry
          await new Promise(r => setTimeout(r, 400));
          return doRequest();
        }
        setError(msg);
        setIsSubmitting(false);
        setSubmitStatus('idle');
      }
    };

    void doRequest();
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      details: ['8969207777'],
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@sintudecorators.com', 'events@sintudecorators.com'],
      action: 'Send Email'
    },
    {
      icon: MapPin,
      title: 'Address',
      details: ['near shiv mandir mungroura, jamalpur 811214', 'dist munger, bihar'],
      action: 'Get Directions'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: ['Mon - Fri: 9:00 AM - 7:00 PM', 'Sat - Sun: 10:00 AM - 6:00 PM'],
      action: 'Schedule Meeting'
    }
  ];

  const services = [
    { icon: Users, name: 'Event Management', description: 'Complete event planning and execution' },
    { icon: Utensils, name: 'Catering Services', description: 'Multi-cuisine catering with professional service' },
    { icon: Music, name: 'Music & Entertainment', description: 'Live music, DJ services, and entertainment' }
  ];

  // Social links inside Dock
  const dockItems = [
    {
      icon: <Instagram size={22} className="text-yellow-500" />,
      label: 'Instagram',
      onClick: () => window.open('https://instagram.com', '_blank', 'noopener')
    },
    {
      icon: <Facebook size={22} className="text-yellow-500" />,
      label: 'Facebook',
      onClick: () => window.open('https://facebook.com', '_blank', 'noopener')
    },
    {
      icon: <Twitter size={22} className="text-yellow-500" />,
      label: 'Twitter',
      onClick: () => window.open('https://x.com', '_blank', 'noopener')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-yellow-900/10">
      <div className="opacity-0 contact-container">
        {/* Header */}
        <motion.header
          className="py-10 bg-yellow-500/5 backdrop-blur-lg border-b border-yellow-500/20 relative overflow-hidden"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
            <LiquidEther
              colors={[ '#ca8a04', '#eab308', '#fbbf24', '#fde047' ]}
              mouseForce={20}
              cursorSize={100}
              isViscous={false}
              viscous={30}
              iterationsViscous={32}
              iterationsPoisson={32}
              resolution={0.5}
              isBounce={false}
              autoDemo={true}
              autoSpeed={0.5}
              autoIntensity={2.2}
              takeoverDuration={0.25}
              autoResumeDelay={3000}
              autoRampDuration={0.6}
              className="w-full h-full"
            />
          </div>
            <Link to="/" className="inline-flex items-center gap-2 text-yellow-200 no-underline font-normal ml-8 mb-10 py-3 px-6 rounded-md border border-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black hover:-translate-x-1 hover:shadow-lg hover:shadow-yellow-500/20">
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="contact-header">
              <h1 className="text-5xl md:text-6xl font-light mb-4 text-yellow-500 text-center font-serif tracking-tight">
                <ShinyText
                  text="Contact Sintu Decorators"
                  disabled={false}
                  speed={3}
                  className="inline-block"
                />
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mx-auto font-light">
              Let's create your perfect event together
            </p>
          </div>
        </motion.header>

        {/* Services Overview */}
        <motion.section
          className="py-24 bg-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  className="group p-8 bg-zinc-900/80 backdrop-blur-xl border border-yellow-500/10 rounded-xl transition-all duration-300 hover:border-yellow-500/20 hover:bg-zinc-900/90"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <service.icon size={32} className="text-white mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-gray-300 font-medium">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Main Content */}
        <motion.section
          className="py-24 bg-gradient-to-b from-black via-black/95 to-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
              Get In Touch
            </h2>
            <p className="text-lg text-gray-300 text-center mb-16">
              Ready to plan your dream event? Let's make it happen together
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Contact Form */}
              <motion.div 
                className="p-8 lg:p-12 bg-zinc-900/80 backdrop-blur-xl border border-yellow-500/10 rounded-xl transition-all duration-300 hover:border-yellow-500/20 hover:bg-zinc-900/90"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <h3 className="text-2xl font-semibold text-white mb-6 text-left">Send Us a Message</h3>
                
                  <form className="space-y-6 text-left" onSubmit={handleSubmit}>
                    {error && (
                      <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-white font-medium text-sm">Full Name *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-white font-medium text-sm">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-white font-medium text-sm">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="eventType" className="block text-white font-medium text-sm">Event Type *</label>
                        <select
                          id="eventType"
                          name="eventType"
                          value={formData.eventType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all"
                          required
                        >
                          <option value="" className="bg-black text-white">Select Event Type</option>
                          <option value="wedding" className="bg-black text-white">Wedding</option>
                          <option value="corporate" className="bg-black text-white">Corporate Event</option>
                          <option value="birthday" className="bg-black text-white">Birthday Party</option>
                          <option value="anniversary" className="bg-black text-white">Anniversary</option>
                          <option value="other" className="bg-black text-white">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="eventDate" className="block text-white font-medium text-sm">Event Date</label>
                        <input
                          type="date"
                          id="eventDate"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="guestCount" className="block text-white font-medium text-sm">Expected Guests</label>
                        <select
                          id="guestCount"
                          name="guestCount"
                          value={formData.guestCount}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all"
                        >
                          <option value="" className="bg-black text-white">Select Guest Count</option>
                          <option value="50-100" className="bg-black text-white">50-100</option>
                          <option value="100-200" className="bg-black text-white">100-200</option>
                          <option value="200-500" className="bg-black text-white">200-500</option>
                          <option value="500+" className="bg-black text-white">500+</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-white font-medium text-sm">Message (Optional)</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your event vision (optional)..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:bg-white/15 transition-all resize-none"
                      ></textarea>
                    </div>

                    <div className="space-y-3">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-yellow-500 text-black rounded-lg font-medium tracking-wide transition-all hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-not-allowed"
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      >
                        {submitStatus === 'sending' && 'Sending...'}
                        {submitStatus === 'processing' && 'Processing...'}
                        {submitStatus === 'redirecting' && 'Success!'}
                        {submitStatus === 'idle' && 'Send Message'}
                        <Send size={20} />
                      </motion.button>
                      {isSubmitting && (
                        <div className="h-1 w-full bg-white/10 rounded overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 animate-[progress_1.8s_linear_infinite]" />
                        </div>
                      )}
                      {submitStatus === 'processing' && (
                        <p className="text-xs text-yellow-400/80 tracking-wide">Still working... finalizing your submission.</p>
                      )}
                    </div>
                  </form>
              </motion.div>

              {/* Contact Info */}
              <motion.div 
                className="space-y-8"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <div className="text-center p-8 bg-black/80 rounded-2xl border border-yellow-500/20 backdrop-blur-lg transition-all duration-300 hover:bg-black/90 hover:border-yellow-500 hover:shadow-xl hover:shadow-yellow-500/20 max-w-md w-full mx-auto lg:mx-0">
                  <h3 className="text-2xl font-semibold text-white mb-4">Contact Information</h3>
                  <p className="text-gray-300 mb-6">Ready to plan your dream event? Contact us today!</p>

                  <div className="space-y-4">
                    {contactInfo.map((method, index) => (
                      <motion.div
                        key={method.title}
                        className="p-8 bg-zinc-900/80 backdrop-blur-xl border border-yellow-500/10 rounded-xl transition-all duration-300 hover:border-yellow-500/20 hover:bg-zinc-900/90"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                      >
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <method.icon size={20} className="text-yellow-500" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-white font-medium mb-1">{method.title}</h4>
                          {method.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-gray-300 text-sm">{detail}</p>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="text-center p-8 bg-black/80 rounded-2xl border border-yellow-500/20 backdrop-blur-lg transition-all duration-300 hover:bg-black/90 hover:border-yellow-500 hover:shadow-xl hover:shadow-yellow-500/20 relative max-w-md w-full mx-auto lg:mx-0">
                  <h4 className="text-white font-semibold mb-6">Follow Us</h4>
                  <div className="relative h-20 flex items-center justify-center">
                    <Dock
                      items={dockItems}
                      panelHeight={68}
                      baseItemSize={50}
                      magnification={70}
                      className="bg-black/60 backdrop-blur-xl border-yellow-500/30 shadow-lg shadow-yellow-500/10"
                    />
                  </div>
                  <p className="mt-6 text-xs tracking-wide text-yellow-500/70 uppercase">Connect & stay inspired</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Map Section */}
        <motion.section
          className="py-24 bg-white/5"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
              Find Us
            </h2>
            <p className="text-lg text-gray-300 text-center mb-16">
              Visit our office or get directions to our location
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center p-12 bg-black/80 rounded-2xl border border-yellow-500/20 backdrop-blur-lg transition-all duration-300 hover:bg-black/90 hover:border-yellow-500 hover:shadow-xl hover:shadow-yellow-500/20">
                <Navigation size={48} className="text-white mb-6 mx-auto" />
                <h4 className="text-2xl font-semibold text-white mb-4">Sintu Decorators</h4>
                <p className="text-gray-300 leading-relaxed mb-6">
                  near shiv mandir mungroura, jamalpur 811214<br />dist munger, bihar
                </p>
                <motion.button
                  onClick={() => window.open('https://www.google.com/maps?q=near+shiv+mandir+mungroura+jamalpur+811214+dist+munger+bihar', '_blank', 'noopener')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-lg font-medium tracking-wide transition-all hover:bg-yellow-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MapPin size={16} />
                  Open in Google Maps
                </motion.button>
              </div>
              {/* In a real application, you would integrate with Google Maps API */}
              <div className="lg:col-span-2 contact-item bg-black/80 rounded-2xl border border-yellow-500/20 backdrop-blur-lg overflow-hidden transition-all duration-300 hover:bg-black/90 hover:border-yellow-500 hover:shadow-xl hover:shadow-yellow-500/20">
                <iframe
                  src="https://www.google.com/maps?q=near+shiv+mandir+mungroura+jamalpur+811214+dist+munger+bihar&output=embed"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sintu Decorators Location"
                ></iframe>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactPage;
