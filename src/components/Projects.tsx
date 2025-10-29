'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiExternalLink, FiGithub, FiX, FiCode, FiEye, FiStar, FiZap } from 'react-icons/fi';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        closeProject();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedProject]);

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

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setImageLoaded(false);
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  return (
    <section id="projects" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-400">
            Building the future, one project at a time
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
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={item}
                onClick={() => handleProjectClick(project)}
                className="group relative bg-gradient-to-br from-slate-900/50 to-blue-950/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer"
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center overflow-hidden">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-6xl opacity-50">🚀</div>
                  )}
                  
                  {/* Hover Overlay - Updated to show "View Details" */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white font-bold text-lg flex items-center gap-2">
                      <FiEye className="w-5 h-5" />
                      View Details
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-cyan-400">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-semibold bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 text-xs font-semibold bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/30">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-lg shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/80 hover:scale-105 transition-all duration-300"
          >
            Let&apos;s Build Something Amazing
          </a>
        </motion.div>
      </div>

      {/* Enhanced Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeProject}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl max-w-5xl w-full shadow-2xl shadow-cyan-500/20 border-2 border-cyan-500/30 overflow-hidden my-8"
              style={{ maxHeight: 'calc(100vh - 4rem)' }}
            >
              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[calc(100vh-4rem)]">
                {/* Close Button */}
                <button
                  onClick={closeProject}
                  className="sticky top-6 right-6 float-right z-10 w-12 h-12 rounded-full bg-red-500/20 border-2 border-red-500/50 text-red-400 hover:bg-red-500/30 hover:scale-110 transition-all flex items-center justify-center backdrop-blur-sm"
                >
                  <FiX className="w-6 h-6" />
                </button>

                {/* Hero Image Section */}
                <div className="relative h-80 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 overflow-hidden">
                  {selectedProject.imageUrl ? (
                    <>
                      <img
                        src={selectedProject.imageUrl}
                        alt={selectedProject.title}
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      />
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-9xl opacity-30">🚀</div>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                  
                  {/* Floating Particles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
                        initial={{
                          x: Math.random() * 100 + '%',
                          y: Math.random() * 100 + '%',
                        }}
                        animate={{
                          y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                          x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                        }}
                        transition={{
                          duration: Math.random() * 10 + 10,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    ))}
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-4xl sm:text-5xl font-black mb-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                    >
                      {selectedProject.title}
                    </motion.h2>
                    
                    {/* Quick Stats */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-wrap gap-3 items-center"
                    >
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 backdrop-blur-sm rounded-full border border-cyan-500/30">
                        <FiCode className="text-cyan-400 text-sm" />
                        <span className="text-cyan-400 font-semibold text-xs sm:text-sm">{selectedProject.technologies.length} Technologies</span>
                      </div>
                      {selectedProject.liveUrl && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-500/30">
                          <FiZap className="text-green-400 text-sm" />
                          <span className="text-green-400 font-semibold text-xs sm:text-sm">Live</span>
                        </div>
                      )}
                      {selectedProject.githubUrl && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30">
                          <FiGithub className="text-purple-400 text-sm" />
                          <span className="text-purple-400 font-semibold text-xs sm:text-sm">Open Source</span>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Description */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full" />
                      <h3 className="text-xl sm:text-2xl font-bold text-cyan-400">About This Project</h3>
                    </div>
                    <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </motion.div>

                  {/* Technologies Grid */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-600 rounded-full" />
                      <h3 className="text-xl sm:text-2xl font-bold text-purple-400">Tech Stack</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {selectedProject.technologies.map((tech, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.6 + i * 0.05, type: "spring" }}
                          className="group relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity" />
                          <div className="relative px-3 py-2.5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-cyan-500/30 hover:border-cyan-500/60 transition-all text-center">
                            <span className="text-cyan-400 font-semibold text-xs sm:text-sm">{tech}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Features/Highlights */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                        <FiStar className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-cyan-400 mb-2">Modern Design</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">Beautiful, responsive UI that works seamlessly across all devices</p>
                    </div>
                    
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-2xl border border-purple-500/30 hover:border-purple-500/50 transition-all">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                        <FiZap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-purple-400 mb-2">High Performance</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">Optimized for speed with lightning-fast load times</p>
                    </div>
                    
                    <div className="p-4 sm:p-6 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl border border-green-500/30 hover:border-green-500/50 transition-all sm:col-span-2 lg:col-span-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                        <FiCode className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-green-400 mb-2">Clean Code</h4>
                      <p className="text-gray-400 text-xs sm:text-sm">Well-structured, maintainable, and scalable codebase</p>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 pt-4"
                  >
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex-1 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity blur" />
                        <div className="relative px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/50 group-hover:shadow-cyan-500/80 group-hover:scale-105 transition-all">
                          <FiExternalLink className="w-5 h-5" />
                          View Live Project
                        </div>
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex-1 relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600 opacity-0 group-hover:opacity-100 transition-opacity blur" />
                        <div className="relative px-6 py-3.5 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl font-bold text-white flex items-center justify-center gap-3 shadow-lg shadow-slate-500/30 group-hover:shadow-slate-500/50 group-hover:scale-105 transition-all">
                          <FiGithub className="w-5 h-5" />
                          View Source Code
                        </div>
                      </a>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Animated Border */}
              <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent)",
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}