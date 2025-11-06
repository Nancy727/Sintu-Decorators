import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Users,
  Calendar,
  Star,
  Music,
  Utensils,
  Heart,
  Target,
  Eye,
  CheckCircle,
  Play,
} from "lucide-react";
import gsap from "gsap";
import CountUp from "./TextAnimations/CountUp/CountUp";
import ShinyText from "./TextAnimations/ShinyText/ShinyText";
import LiquidEther from "./Backgrounds/LiquidEther/LiquidEther";
import sintuImg from "../assets/founders/sintu.jpeg";
import aprajitaImg from "../assets/founders/aprajita.jpeg";
import sangitaImg from "../assets/founders/sangita.jpeg";

const AboutPage: React.FC = () => {
  useEffect(() => {
    // GSAP page entrance animation
    gsap.fromTo(
      ".about-page-container",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    // Luxury title animation with sparkle effect
    gsap.fromTo(
      ".about-header h1",
      { opacity: 0, y: 50, rotationX: 90 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5,
      }
    );

    // Static cards with subtle entrance animations only

    // Timeline items stagger animation
    gsap.fromTo(
      ".timeline-item",
      {
        opacity: 0,
        x: (index) => (index % 2 === 0 ? -100 : 100),
        rotationY: 45,
      },
      {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.2,
        delay: 2,
      }
    );
  }, []);

  const stats = [
    { icon: Calendar, value: "500+", label: "Events Completed" },
    { icon: Users, value: "1000+", label: "Happy Clients" },
    { icon: Award, value: "25+", label: "Years Experience" },
    { icon: Star, value: "98%", label: "Client Satisfaction" },
  ];

  const services = [
    {
      icon: Users,
      title: "Event Management",
      description:
        "Complete event planning from conception to execution. We handle every detail to ensure your special day is perfect.",
      features: [
        "Wedding Planning",
        "Corporate Events",
        "Birthday Parties",
        "Anniversary Celebrations",
      ],
    },
    {
      icon: Utensils,
      title: "Catering Services",
      description:
        "Multi-cuisine catering with professional service staff. From traditional Indian to international cuisines.",
      features: [
        "Multi-Cuisine Menu",
        "Professional Staff",
        "Custom Menu Planning",
        "Live Cooking Stations",
      ],
    },
    {
      icon: Music,
      title: "Music & Entertainment",
      description:
        "Live music performances, DJ services, and comprehensive entertainment coordination for all types of events.",
      features: [
        "Live Band Performances",
        "Professional DJ Services",
        "Sound System Setup",
        "Entertainment Coordination",
      ],
    },
  ];

  const teamMembers = [
    {
      name: "Sintu Kumar",
      role: "Founder & CEO",
      image: sintuImg,
      experience: "25+ Years",
      description:
        "Visionary leader with passion for creating memorable experiences",
    },
    {
      name: "Aprajita Devi",
      role: "Event Designer",
      image: aprajitaImg,
      experience: "20+ Years",
      description: "Creative expert in transforming venues into magical spaces",
    },
    {
      name: "Sangita Devi",
      role: "Catering Head",
      image: sangitaImg,
      experience: "25+ Years",
      description: "Culinary master specializing in multi-cuisine preparations",
    },
  ];

  const milestones = [
    {
      year: "1999",
      event: "Company Founded",
      description: "Started with a vision to create extraordinary celebrations",
    },
    {
      year: "2005",
      event: "100+ Events",
      description: "Reached our first major milestone of successful events",
    },
    {
      year: "2010",
      event: "Team Expansion",
      description: "Expanded our team to include specialized departments",
    },
    {
      year: "2020",
      event: "Digital Innovation",
      description: "Introduced virtual event planning and hybrid celebrations",
    },
    {
      year: "2024",
      event: "500+ Events",
      description: "Celebrating over 500 successful events and counting",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-yellow-900/10">
      <div className="relative">
        {/* Header */}
        <motion.header
          className="py-10 pb-24 bg-yellow-500/5 backdrop-blur-lg border-b border-yellow-500 relative overflow-hidden"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Fluid background effect behind heading */}
          <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
            <LiquidEther
              colors={["#ca8a04", "#eab308", "#fbbf24", "#fde047"]}
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
            <Link to="/" className="inline-flex items-center gap-2 text-yellow-200 no-underline font-normal ml-8 mb-12 py-3 px-6 rounded-md border border-yellow-500 transition-all duration-300 hover:bg-yellow-500 hover:text-black hover:-translate-x-1 hover:shadow-lg hover:shadow-yellow-500/20">
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <h1 className="text-5xl md:text-6xl font-light mb-4 text-yellow-500 text-center font-serif tracking-tight">
              <ShinyText
                text="About Sintu Decorators"
                disabled={false}
                speed={3}
                className="inline-block"
              />
            </h1>
            <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mx-auto">
              Excellence in Event Management Since 1999
            </p>
          </div>
        </motion.header>

        {/* Company Overview */}
        <motion.section
          className="py-24 bg-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="lg:text-left text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white font-medium mb-8 border border-white/20">
                  <Award size={20} />
                  <span>Our Story</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-light mb-6 text-yellow-500 font-serif tracking-tight">
                  Crafting Extraordinary Celebrations
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-12">
                  For over 25 years, Sintu Decorators has been synonymous with
                  excellence in event management, catering services, and
                  entertainment. We transform your dreams into unforgettable
                  experiences through meticulous planning, creative design, and
                  flawless execution.
                </p>
                <div className="flex flex-col gap-8">
                  <div className="flex gap-4 p-6 bg-zinc-900/50 backdrop-blur-lg border border-yellow-500/10 rounded-lg transition-all duration-300 hover:border-yellow-500/20 hover:bg-zinc-900/80">
                    <Target size={24} className="text-white flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xl text-yellow-500 mb-2 font-normal">Mission</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        To create extraordinary celebrations that exceed
                        expectations and create lasting memories.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-6 bg-zinc-900/50 backdrop-blur-lg border border-yellow-500/10 rounded-lg transition-all duration-300 hover:border-yellow-500/20 hover:bg-zinc-900/80">
                    <Eye size={24} className="text-white flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xl text-yellow-500 mb-2 font-normal">Vision</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        To be the most trusted name in event management across
                        India, known for innovation and excellence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="flex flex-col items-center justify-center p-8 bg-zinc-900/80 backdrop-blur-xl border border-yellow-500/10 rounded-lg transition-all duration-300 hover:border-yellow-500/20 hover:bg-zinc-900/90 hover:-translate-y-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <stat.icon size={32} className="text-yellow-500 mb-4" />
                    <div className="text-4xl font-bold font-serif text-yellow-500 mb-2">
                      <CountUp
                        from={0}
                        to={parseInt(stat.value.replace(/[^0-9]/g, ''))}
                        separator=","
                        direction="up"
                        duration={1}
                      />
                      {stat.value.includes('+') && <span>+</span>}
                      {stat.value.includes('%') && <span>%</span>}
                    </div>
                    <p className="text-sm text-gray-300 font-medium uppercase tracking-wide">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          className="py-24 bg-white/5"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <h2 className="text-4xl md:text-5xl font-light mb-4 text-yellow-500 text-center font-serif tracking-tight">
              Our Comprehensive Services
            </h2>
            <p className="text-lg text-gray-300 text-center mb-16 max-w-2xl mx-auto">
              We offer a complete suite of services to make your event perfect
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  className="p-8 bg-zinc-900/80 backdrop-blur-xl border border-yellow-500/10 rounded-xl transition-all duration-300 hover:border-yellow-500/20 hover:bg-zinc-900/90 hover:-translate-y-2 group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6">
                    <service.icon size={32} className="text-yellow-500" />
                  </div>
                  <h3 className="text-2xl text-yellow-500 mb-4 font-light">{service.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-gray-300">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          className="py-24 bg-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <h2 className="text-4xl md:text-5xl font-light mb-4 text-yellow-500 text-center font-serif tracking-tight">
              Meet Our Expert Team
            </h2>
            <p className="text-lg text-gray-300 text-center mb-16 max-w-2xl mx-auto">
              Passionate professionals dedicated to making your events
              extraordinary
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="p-8 bg-zinc-900/80 backdrop-blur-xl border border-yellow-500/10 rounded-xl text-center transition-all duration-300 hover:border-yellow-500/20 hover:bg-zinc-900/90 hover:-translate-y-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                >
                  <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users size={32} className="text-yellow-500" />
                    )}
                  </div>
                  <h3 className="text-2xl text-yellow-500 mb-2 font-light">{member.name}</h3>
                  <h4 className="text-gray-300 mb-2 font-medium">{member.role}</h4>
                  <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-500 text-sm rounded-full mb-4">
                    {member.experience}
                  </span>
                  <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Company Timeline */}
        <motion.section
          className="py-24 bg-white/[0.02] relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <h2 className="text-4xl md:text-5xl font-light mb-4 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent text-center font-serif tracking-tight animate-[sparkle_3s_ease-in-out_infinite]">
              Our Journey
            </h2>
            <p className="text-lg text-gray-300 text-center mb-16 max-w-2xl mx-auto">
              Milestones that define our growth and success
            </p>

            <div className="relative max-w-4xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-yellow-500/20 -translate-x-1/2" />

              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className={`relative flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-12 md:mb-16`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 2 + index * 0.1 }}
                >
                  <div className={`w-full md:w-[calc(50%-2rem)] p-6 bg-zinc-900/80 backdrop-blur-xl border border-yellow-500/10 rounded-xl transition-all duration-300 hover:border-yellow-500/20 hover:bg-zinc-900/90 ${index % 2 === 0 ? 'mr-auto md:mr-8' : 'ml-auto md:ml-8'}`}>
                    <div className="text-yellow-500 font-bold text-xl mb-2">{milestone.year}</div>
                    <h3 className="text-2xl text-yellow-500 mb-3 font-light">{milestone.event}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{milestone.description}</p>
                  </div>
                  {/* Timeline dot */}
                  <div className="absolute top-8 left-1/2 w-4 h-4 bg-yellow-500 rounded-full -translate-x-1/2 border-4 border-black" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Video/Media Section */}
        <motion.section
          className="py-24 bg-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            <h2 className="text-4xl md:text-5xl font-light mb-16 text-yellow-500 text-center font-serif tracking-tight">
              Experience Our Work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                className="p-8 bg-zinc-900/50 backdrop-blur-lg border-2 border-dashed border-yellow-500/20 rounded-xl text-center transition-all duration-300 hover:border-yellow-500/30 hover:bg-zinc-900/60 hover:-translate-y-2 cursor-pointer group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-500/20 transition-colors">
                  <Play size={40} className="text-yellow-500" />
                </div>
                <h3 className="text-2xl text-yellow-500 mb-4 font-light">Company Introduction</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Watch our story unfold through 15 years of excellence
                </p>
              </motion.div>
              <motion.div
                className="p-8 bg-zinc-900/80 backdrop-blur-xl border border-yellow-500/10 rounded-xl text-center transition-all duration-300 hover:border-yellow-500/20 hover:bg-zinc-900/90 hover:-translate-y-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart size={32} className="text-yellow-500" />
                </div>
                <h3 className="text-2xl text-yellow-500 mb-4 font-light">Client Testimonials</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  "Sintu Decorators made our wedding absolutely perfect. Every
                  detail was handled with care and precision."
                </p>
                <span className="text-gray-400 text-sm italic">- Priya & Rahul, Wedding Clients</span>
              </motion.div>
              <motion.div
                className="p-8 bg-zinc-900/80 backdrop-blur-xl border border-yellow-500/10 rounded-xl text-center transition-all duration-300 hover:border-yellow-500/20 hover:bg-zinc-900/90 hover:-translate-y-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award size={32} className="text-yellow-500" />
                </div>
                <h3 className="text-2xl text-yellow-500 mb-4 font-light">Awards & Recognition</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Recognized as one of the top event management companies in
                  Munger for past fifteen years.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
