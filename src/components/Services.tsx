'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="services" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Services I Offer
          </h2>
          <p className="text-xl text-gray-400">
            Transforming ideas into digital reality
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Default Services */}
            {[
              {
                icon: '💻',
                title: 'Web Development',
                description: 'Building responsive, fast, and modern websites using cutting-edge technologies.',
                features: ['React & Next.js', 'Full-Stack Solutions', 'SEO Optimization', 'Performance Tuning']
              },
              {
                icon: '📱',
                title: 'Mobile Apps',
                description: 'Creating beautiful cross-platform mobile applications with Flutter.',
                features: ['iOS & Android', 'Native Performance', 'Beautiful UI/UX', 'Real-time Features']
              },
              {
                icon: '🎨',
                title: 'UI/UX Design',
                description: 'Designing intuitive and engaging user interfaces that users love.',
                features: ['Modern Design', 'User Research', 'Prototyping', 'Brand Identity']
              },
              {
                icon: '🤖',
                title: 'AI Integration',
                description: 'Implementing AI-powered features to make your apps smarter.',
                features: ['ChatGPT Integration', 'Machine Learning', 'Natural Language', 'Automation']
              },
              {
                icon: '🔐',
                title: 'Backend Development',
                description: 'Building secure and scalable server-side applications and APIs.',
                features: ['RESTful APIs', 'Database Design', 'Authentication', 'Cloud Deployment']
              },
              {
                icon: '⚡',
                title: 'Performance Optimization',
                description: 'Making your applications lightning-fast and highly efficient.',
                features: ['Speed Optimization', 'Code Refactoring', 'Caching Strategies', 'Load Balancing']
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -10 }}
                className="group relative bg-gradient-to-br from-slate-900/50 to-blue-950/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
              >
                {/* Icon */}
                <div className="text-6xl mb-4">{service.icon}</div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-cyan-400 mb-3">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-300 mb-6">
                  {service.description}
                </p>
                
                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-400">
                      <span className="text-cyan-400 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={item}
                whileHover={{ y: -10 }}
                className="group relative bg-gradient-to-br from-slate-900/50 to-blue-950/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-cyan-400 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-400">
                      <span className="text-cyan-400 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}