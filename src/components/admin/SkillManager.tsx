'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';

interface Skill {
  id: string;
  name: string;
  icon: string;
  category: string;
  level: number;
  order: number;
}

export default function SkillManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'SiReact',
    category: 'Framework',
    level: 80,
    order: 0,
  });

  const iconOptions = [
    'SiJavascript', 'SiTypescript', 'SiReact', 'SiNextdotjs', 'SiNodedotjs',
    'SiMongodb', 'SiFlutter', 'SiPostgresql', 'SiPrisma', 'SiTailwindcss',
    'SiPython', 'SiGo', 'SiRust', 'SiDocker', 'SiKubernetes'
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      toast.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = '/api/skills';
      const method = editingSkill ? 'PUT' : 'POST';
      const body = editingSkill ? { ...formData, id: editingSkill.id } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingSkill ? 'Skill updated!' : 'Skill created!');
        fetchSkills();
        resetForm();
      } else {
        toast.error('Operation failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this skill?')) return;

    try {
      const res = await fetch(`/api/skills?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Skill deleted!');
        fetchSkills();
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      icon: skill.icon,
      category: skill.category,
      level: skill.level,
      order: skill.order,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingSkill(null);
    setFormData({
      name: '',
      icon: 'SiReact',
      category: 'Framework',
      level: 80,
      order: 0,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer theme="dark" />
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Skills</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
        >
          <FiPlus />
          Add Skill
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-slate-900/50 rounded-2xl border border-cyan-500/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">
            {editingSkill ? 'Edit Skill' : 'New Skill'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Level (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-white hover:shadow-lg transition-all"
              >
                {editingSkill ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-slate-700 rounded-lg font-bold text-white hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 rounded-2xl p-4 border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
          >
            <div className="text-center mb-3">
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="font-bold text-white">{skill.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{skill.category}</p>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                style={{ width: `${skill.level}%` }}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(skill)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition-all"
              >
                <FiEdit size={14} />
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="flex items-center justify-center px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 transition-all"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}