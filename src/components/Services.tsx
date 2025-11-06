import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Camera, 
  Music, 
  Utensils, 
  Sparkles,
  ArrowRight 
} from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Heart,
      title: 'Weddings',
      description: 'Luxury wedding experiences.',
      features: ['Planning', 'Coordination', 'Design']
    },
    {
      icon: Users,
      title: 'Corporate',
      description: 'Premium business events.',
      features: ['Conferences', 'Meetings', 'Galas']
    },
    {
      icon: Camera,
      title: 'Photography',
      description: 'Artistic visual storytelling.',
      features: ['Weddings', 'Events', 'Portraits']
    },
    {
      icon: Music,
      title: 'Entertainment',
      description: 'Curated performances.',
      features: ['Live Music', 'DJ', 'Shows']
    },
    {
      icon: Utensils,
      title: 'Catering',
      description: 'Exquisite culinary experiences.',
      features: ['Fine Dining', 'Custom Menus', 'Service']
    },
    {
      icon: Sparkles,
      title: 'Design',
      description: 'Transformative spaces.',
      features: ['Decor', 'Lighting', 'Styling']
    }
  ];



  return (
    <section id="services" className="relative overflow-hidden bg-black min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-yellow-900/10 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <motion.div
          className="text-center mb-16 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-light text-white mb-4">Services</h2>
          <p className="max-w-md mx-auto text-gray-300 font-light">
            Crafted with precision and elegance.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              className="relative bg-zinc-900/80 backdrop-blur-xl border border-yellow-500/10 rounded-2xl p-8 transition-all overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-200 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-black mb-6">
                <service.icon size={32} />
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl text-yellow-500 mb-2 font-normal">{service.title}</h3>
                <p className="text-gray-300 font-light leading-relaxed">{service.description}</p>
                
                <ul className="mt-4 space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-gray-300 text-sm font-light">
                      <ArrowRight size={14} className="text-yellow-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <motion.button
                className="w-full border border-yellow-500 text-yellow-500 py-2 px-6 rounded-md font-normal transition-all hover:bg-yellow-500 hover:text-black tracking-wide"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="bg-zinc-900/90 backdrop-blur-xl border border-yellow-500/10 rounded-2xl p-12 md:p-16 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div>
            <h3 className="text-3xl text-yellow-500 mb-2 font-light">Begin Your Journey</h3>
            <p className="text-gray-300 font-light mb-8 max-w-md mx-auto">Let us craft your vision.</p>
            <motion.button
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-lg font-medium tracking-wide transition-all hover:from-yellow-600 hover:to-yellow-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Inquire
              <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
