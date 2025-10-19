'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiNodedotjs, SiMongodb, SiFlutter, SiPostgresql, SiPrisma, SiTailwindcss } from 'react-icons/si';

interface Skill {
  id: string;
  name: string;
  icon: string;
  category: string;
  level: number;
}

const iconMap: Record<string, any> = {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiMongodb,
  SiFlutter,
  SiPostgresql,
  SiPrisma,
  SiTailwindcss,
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <section id="skills" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Languages I Know
          </h2>
          <p className="text-xl text-gray-400">
            Expertise across the full stack
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {skills.map((skill) => {
              const IconComponent = iconMap[skill.icon] || SiReact;
              
              return (
                <motion.div
                  key={skill.id}
                  variants={item}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative bg-gradient-to-br from-slate-900/50 to-blue-950/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
                >
                  {/* Skill Icon */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 group-hover:from-cyan-500/20 group-hover:to-blue-600/20 transition-all">
                      <IconComponent className="w-12 h-12 text-cyan-400" />
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 text-center">
                      {skill.name}
                    </h3>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                      />
                    </div>
                    
                    <span className="text-xs text-gray-400">{skill.level}%</span>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}