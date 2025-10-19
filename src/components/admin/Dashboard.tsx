'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHome, FiCode, FiBriefcase, FiStar, FiFileText, FiSettings, FiLogOut } from 'react-icons/fi';
import ProjectManager from './ProjectManager';
import SkillManager from './SkillManager';

type Tab = 'projects' | 'skills' | 'experience' | 'services' | 'testimonials' | 'blog';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');

  const tabs = [
    { id: 'projects' as Tab, name: 'Projects', icon: FiCode },
    { id: 'skills' as Tab, name: 'Skills', icon: FiSettings },
    { id: 'experience' as Tab, name: 'Experience', icon: FiBriefcase },
    { id: 'services' as Tab, name: 'Services', icon: FiStar },
    { id: 'testimonials' as Tab, name: 'Testimonials', icon: FiStar },
    { id: 'blog' as Tab, name: 'Blog', icon: FiFileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                HASH NOVA
              </h1>
              <span className="text-gray-400">Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <FiHome className="w-5 h-5" />
                <span>View Site</span>
              </a>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-slate-900/50 text-gray-400 hover:text-white border border-cyan-500/20'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'projects' && <ProjectManager />}
          {activeTab === 'skills' && <SkillManager />}
          {activeTab === 'experience' && (
            <div className="text-center py-12 text-gray-400">
              Experience Manager - Coming Soon
            </div>
          )}
          {activeTab === 'services' && (
            <div className="text-center py-12 text-gray-400">
              Services Manager - Coming Soon
            </div>
          )}
          {activeTab === 'testimonials' && (
            <div className="text-center py-12 text-gray-400">
              Testimonials Manager - Coming Soon
            </div>
          )}
          {activeTab === 'blog' && (
            <div className="text-center py-12 text-gray-400">
              Blog Manager - Coming Soon
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}