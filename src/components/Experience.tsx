'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export default function Experience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experiences')
      .then(res => res.json())
      .then(data => {
        setExperiences(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="experience" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Experience Timeline
          </h2>
          <p className="text-xl text-gray-400">
            My journey as a developer
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : experiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-2">Journey Just Beginning</h3>
            <p className="text-gray-400">Building amazing projects since 2023. More milestones coming soon!</p>
          </motion.div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan-500 to-blue-600" />

            {/* Timeline Items */}
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className="w-5/12">
                  <div className="bg-gradient-to-br from-slate-900/50 to-blue-950/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 text-xs font-bold bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">
                        {exp.current ? 'Current' : exp.endDate}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                      {exp.title}
                    </h3>
                    <div className="text-lg text-white font-semibold mb-1">
                      {exp.company}
                    </div>
                    <div className="text-sm text-gray-400 mb-3">
                      📍 {exp.location} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                    <p className="text-gray-300">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full border-4 border-slate-900 z-10">
                  <div className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-75" />
                </div>

                {/* Spacer */}
                <div className="w-5/12" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}