'use client';

import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { SiWhatsapp } from 'react-icons/si';

export default function Contact() {
  return (
    <section id="contact" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-400">
            Let's build something amazing together
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Let's Connect! 🚀
              </h3>
              <p className="text-gray-300 text-lg mb-8">
                Have a project in mind? Want to collaborate? Or just want to say hi? 
                Feel free to reach out through any of these channels!
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Email */}
              <motion.a
                href="mailto:hashcody63@gmail.com"
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-4 p-6 bg-gradient-to-br from-slate-900/50 to-blue-950/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all">
                  <FiMail className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Email</div>
                  <div className="text-lg font-semibold text-white">hashcody63@gmail.com</div>
                </div>
              </motion.a>

              {/* WhatsApp */}
              <motion.a
                href="https://wa.me/2348077291745"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-4 p-6 bg-gradient-to-br from-slate-900/50 to-blue-950/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center group-hover:from-green-500/30 group-hover:to-green-600/30 transition-all">
                  <SiWhatsapp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">WhatsApp</div>
                  <div className="text-lg font-semibold text-white">08077291745</div>
                </div>
              </motion.a>

              {/* Phone */}
              <motion.a
                href="tel:+2348077291745"
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-4 p-6 bg-gradient-to-br from-slate-900/50 to-blue-950/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-all">
                  <FiPhone className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Phone</div>
                  <div className="text-lg font-semibold text-white">08077291745</div>
                </div>
              </motion.a>

              {/* Location */}
              <motion.div
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-4 p-6 bg-gradient-to-br from-slate-900/50 to-blue-950/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all">
                  <FiMapPin className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Location</div>
                  <div className="text-lg font-semibold text-white">Benin City, Edo State, NG</div>
                </div>
              </motion.div>

              {/* NextTalk ID */}
              <motion.div
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-4 p-6 bg-gradient-to-br from-slate-900/50 to-blue-950/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 hover:border-cyan-500/50 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center group-hover:from-pink-500/30 group-hover:to-pink-600/30 transition-all">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">NextTalk ID</div>
                  <div className="text-lg font-semibold text-white">hashaamustafa</div>
                </div>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="pt-8">
              <p className="text-gray-400 mb-4">Follow me on social media:</p>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 hover:border-cyan-500 transition-all"
                >
                  <span className="text-xl">𝕏</span>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 hover:border-cyan-500 transition-all"
                >
                  <span className="text-xl">💼</span>
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 hover:border-cyan-500 transition-all"
                >
                  <span className="text-xl">📷</span>
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* 3D Interactive Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Animated Rings */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-spin-slow" />
              <div className="absolute inset-8 rounded-full border-2 border-blue-500/30" style={{ animation: 'spin 15s linear infinite reverse' }} />
              <div className="absolute inset-16 rounded-full border-2 border-purple-500/30 animate-spin-slow" />
              
              {/* Center Content */}
              <div className="absolute inset-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-cyan-500/50">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotateZ: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-7xl mb-4"
                >
                  📧
                </motion.div>
                <div className="text-center px-4">
                  <p className="text-cyan-400 font-bold text-lg mb-1">Ready to Chat?</p>
                  <p className="text-gray-400 text-sm">I&apos;m just a message away!</p>
                </div>
              </div>

              {/* Floating Icons */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-8 w-16 h-16 bg-cyan-500/20 rounded-xl backdrop-blur-sm flex items-center justify-center border border-cyan-500/50"
              >
                <span className="text-3xl">⚡</span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 left-8 w-16 h-16 bg-blue-500/20 rounded-xl backdrop-blur-sm flex items-center justify-center border border-blue-500/50"
              >
                <span className="text-3xl">🚀</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20 pt-12 border-t border-cyan-500/20"
        >
          <p className="text-gray-400 mb-2">
            Built with ❤️ by Hash Nova (Hashaam Mustafa)
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Hash Nova. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  );
}