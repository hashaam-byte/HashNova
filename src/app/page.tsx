'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import ThreeDMode from '@/components/ThreeDMode';
import ParticlesBackground from '@/components/ParticleBackground';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [is3DMode, setIs3DMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl + ) to open admin
      if (e.ctrlKey && e.key === ')') {
        e.preventDefault();
        router.push('/admin');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 text-white overflow-x-hidden">
      <ParticlesBackground />
      
      {/* 3D Mode Toggle Button */}
      <motion.button
        onClick={() => setIs3DMode(!is3DMode)}
        className="fixed top-6 right-6 z-50 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-sm shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/80 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {is3DMode ? '🌐 Exit 3D' : '🎮 Enter 3D Mode'}
      </motion.button>

      <AnimatePresence mode="wait">
        {is3DMode ? (
          <ThreeDMode key="3d" onExit={() => setIs3DMode(false)} />
        ) : (
          <motion.div
            key="2d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10"
          >
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Services />
            <Testimonials />
            <Blog />
            <Contact />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Navigation Dots */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
        {['hero', 'about', 'skills', 'projects', 'experience', 'services', 'testimonials', 'blog', 'contact'].map((section) => (
          <a
            key={section}
            href={`#${section}`}
            className="w-3 h-3 rounded-full bg-cyan-500/30 hover:bg-cyan-400 hover:scale-150 transition-all duration-300"
            title={section.charAt(0).toUpperCase() + section.slice(1)}
          />
        ))}
      </nav>
    </main>
  );
}