'use client';

import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left - Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl transform rotate-6" />
              <div className="relative bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 border border-cyan-500/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🚀</div>
                  <div className="text-2xl font-bold text-cyan-400 mb-2">Based in</div>
                  <div className="text-xl text-gray-300">Benin City</div>
                  <div className="text-lg text-gray-400">Edo State, Nigeria</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="space-y-4 text-lg text-gray-300">
              <p>
                I&apos;m a passionate developer focused on building privacy-first, AI-powered, and user-centered apps. I love combining creativity and tech to bring futuristic experiences to life.
              </p>
              <p>
                Since 2023, I&apos;ve been crafting stunning websites for clients, pushing the boundaries of what&apos;s possible on the web. Currently studying at UPSS while building the next generation of web applications.
              </p>
              <p>
                My journey in coding has been driven by curiosity and a desire to create tools that make a real difference. From real-time communication platforms to educational solutions, I&apos;m always exploring new technologies and challenges.
              </p>
            </div>

            {/* Quick Facts */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                <div className="text-cyan-400 font-bold mb-1">🎓 Education</div>
                <div className="text-sm text-gray-400">UPSS Student</div>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                <div className="text-cyan-400 font-bold mb-1">📍 Location</div>
                <div className="text-sm text-gray-400">Benin City, NG</div>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                <div className="text-cyan-400 font-bold mb-1">💼 Experience</div>
                <div className="text-sm text-gray-400">Since 2023</div>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                <div className="text-cyan-400 font-bold mb-1">🎯 Focus</div>
                <div className="text-sm text-gray-400">Full-Stack Dev</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}