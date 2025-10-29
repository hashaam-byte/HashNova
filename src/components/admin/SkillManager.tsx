'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import * as SimpleIcons from 'react-icons/si';

interface Skill {
  id: string;
  name: string;
  icon: string;
  category: string;
  level: number;
  order: number;
}

// COMPREHENSIVE ICON LIBRARY - 150+ Programming Icons
const ICON_LIBRARY = {
  // Frontend Frameworks & Libraries
  'Frontend': [
    { name: 'React', icon: 'SiReact' },
    { name: 'Next.js', icon: 'SiNextdotjs' },
    { name: 'Vue.js', icon: 'SiVuedotjs' },
    { name: 'Angular', icon: 'SiAngular' },
    { name: 'Svelte', icon: 'SiSvelte' },
    { name: 'Nuxt.js', icon: 'SiNuxtdotjs' },
    { name: 'Remix', icon: 'SiRemix' },
    { name: 'Solid.js', icon: 'SiSolid' },
    { name: 'Astro', icon: 'SiAstro' },
    { name: 'Preact', icon: 'SiPreact' },
    { name: 'Qwik', icon: 'SiQwik' },
    { name: 'Alpine.js', icon: 'SiAlpinedotjs' },
  ],
  
  // Languages
  'Languages': [
    { name: 'JavaScript', icon: 'SiJavascript' },
    { name: 'TypeScript', icon: 'SiTypescript' },
    { name: 'Python', icon: 'SiPython' },
    { name: 'Java', icon: 'SiJava' },
    { name: 'C++', icon: 'SiCplusplus' },
    { name: 'C#', icon: 'SiCsharp' },
    { name: 'C', icon: 'SiC' },
    { name: 'Go', icon: 'SiGo' },
    { name: 'Rust', icon: 'SiRust' },
    { name: 'PHP', icon: 'SiPhp' },
    { name: 'Ruby', icon: 'SiRuby' },
    { name: 'Swift', icon: 'SiSwift' },
    { name: 'Kotlin', icon: 'SiKotlin' },
    { name: 'Dart', icon: 'SiDart' },
    { name: 'Scala', icon: 'SiScala' },
    { name: 'Elixir', icon: 'SiElixir' },
    { name: 'Haskell', icon: 'SiHaskell' },
    { name: 'Clojure', icon: 'SiClojure' },
    { name: 'Lua', icon: 'SiLua' },
    { name: 'R', icon: 'SiR' },
    { name: 'Perl', icon: 'SiPerl' },
    { name: 'Zig', icon: 'SiZig' },
    { name: 'V', icon: 'SiV' },
  ],
  
  // Backend & Runtime
  'Backend': [
    { name: 'Node.js', icon: 'SiNodedotjs' },
    { name: 'Express', icon: 'SiExpress' },
    { name: 'Nest.js', icon: 'SiNestjs' },
    { name: 'Django', icon: 'SiDjango' },
    { name: 'Flask', icon: 'SiFlask' },
    { name: 'FastAPI', icon: 'SiFastapi' },
    { name: 'Spring', icon: 'SiSpring' },
    { name: 'Laravel', icon: 'SiLaravel' },
    { name: 'Ruby on Rails', icon: 'SiRubyonrails' },
    { name: 'ASP.NET', icon: 'SiDotnet' },
    { name: 'GraphQL', icon: 'SiGraphql' },
    { name: 'Apollo', icon: 'SiApollographql' },
    { name: 'Deno', icon: 'SiDeno' },
    { name: 'Bun', icon: 'SiBun' },
  ],
  
  // Databases
  'Databases': [
    { name: 'MongoDB', icon: 'SiMongodb' },
    { name: 'PostgreSQL', icon: 'SiPostgresql' },
    { name: 'MySQL', icon: 'SiMysql' },
    { name: 'Redis', icon: 'SiRedis' },
    { name: 'SQLite', icon: 'SiSqlite' },
    { name: 'MariaDB', icon: 'SiMariadb' },
    { name: 'Oracle', icon: 'SiOracle' },
    { name: 'Microsoft SQL', icon: 'SiMicrosoftsqlserver' },
    { name: 'Firebase', icon: 'SiFirebase' },
    { name: 'Supabase', icon: 'SiSupabase' },
    { name: 'Prisma', icon: 'SiPrisma' },
    { name: 'Cassandra', icon: 'SiApachecassandra' },
    { name: 'DynamoDB', icon: 'SiAmazondynamodb' },
    { name: 'Elasticsearch', icon: 'SiElasticsearch' },
    { name: 'CouchDB', icon: 'SiCouchdb' },
    { name: 'Neo4j', icon: 'SiNeo4j' },
  ],
  
  // Mobile Development
  'Mobile': [
    { name: 'Flutter', icon: 'SiFlutter' },
    { name: 'React Native', icon: 'SiReact' },
    { name: 'Ionic', icon: 'SiIonic' },
    { name: 'Android', icon: 'SiAndroid' },
    { name: 'iOS', icon: 'SiIos' },
    { name: 'Xamarin', icon: 'SiXamarin' },
    { name: 'Capacitor', icon: 'SiCapacitor' },
  ],
  
  // CSS & Styling
  'Styling': [
    { name: 'CSS3', icon: 'SiCss3' },
    { name: 'HTML5', icon: 'SiHtml5' },
    { name: 'Sass', icon: 'SiSass' },
    { name: 'Less', icon: 'SiLess' },
    { name: 'Tailwind CSS', icon: 'SiTailwindcss' },
    { name: 'Bootstrap', icon: 'SiBootstrap' },
    { name: 'Material UI', icon: 'SiMui' },
    { name: 'Styled Components', icon: 'SiStyledcomponents' },
    { name: 'Chakra UI', icon: 'SiChakraui' },
    { name: 'Ant Design', icon: 'SiAntdesign' },
  ],
  
  // DevOps & Cloud
  'DevOps': [
    { name: 'Docker', icon: 'SiDocker' },
    { name: 'Kubernetes', icon: 'SiKubernetes' },
    { name: 'AWS', icon: 'SiAmazonaws' },
    { name: 'Google Cloud', icon: 'SiGooglecloud' },
    { name: 'Azure', icon: 'SiMicrosoftazure' },
    { name: 'Vercel', icon: 'SiVercel' },
    { name: 'Netlify', icon: 'SiNetlify' },
    { name: 'Heroku', icon: 'SiHeroku' },
    { name: 'DigitalOcean', icon: 'SiDigitalocean' },
    { name: 'Jenkins', icon: 'SiJenkins' },
    { name: 'GitHub Actions', icon: 'SiGithubactions' },
    { name: 'GitLab CI', icon: 'SiGitlab' },
    { name: 'CircleCI', icon: 'SiCircleci' },
    { name: 'Terraform', icon: 'SiTerraform' },
    { name: 'Ansible', icon: 'SiAnsible' },
    { name: 'Railway', icon: 'SiRailway' },
    { name: 'Cloudflare', icon: 'SiCloudflare' },
  ],
  
  // Tools & Platforms
  'Tools': [
    { name: 'Git', icon: 'SiGit' },
    { name: 'GitHub', icon: 'SiGithub' },
    { name: 'GitLab', icon: 'SiGitlab' },
    { name: 'VS Code', icon: 'SiVisualstudiocode' },
    { name: 'Vim', icon: 'SiVim' },
    { name: 'Neovim', icon: 'SiNeovim' },
    { name: 'Postman', icon: 'SiPostman' },
    { name: 'Insomnia', icon: 'SiInsomnia' },
    { name: 'Figma', icon: 'SiFigma' },
    { name: 'Adobe XD', icon: 'SiAdobexd' },
    { name: 'Webpack', icon: 'SiWebpack' },
    { name: 'Vite', icon: 'SiVite' },
    { name: 'Babel', icon: 'SiBabel' },
    { name: 'ESLint', icon: 'SiEslint' },
    { name: 'Prettier', icon: 'SiPrettier' },
    { name: 'Jira', icon: 'SiJira' },
    { name: 'Notion', icon: 'SiNotion' },
    { name: 'Slack', icon: 'SiSlack' },
    { name: 'Discord', icon: 'SiDiscord' },
  ],
  
  // Testing
  'Testing': [
    { name: 'Jest', icon: 'SiJest' },
    { name: 'Cypress', icon: 'SiCypress' },
    { name: 'Playwright', icon: 'SiPlaywright' },
    { name: 'Selenium', icon: 'SiSelenium' },
    { name: 'Vitest', icon: 'SiVitest' },
    { name: 'Testing Library', icon: 'SiTestinglibrary' },
    { name: 'Mocha', icon: 'SiMocha' },
    { name: 'Jasmine', icon: 'SiJasmine' },
  ],
  
  // AI & ML
  'AI/ML': [
    { name: 'TensorFlow', icon: 'SiTensorflow' },
    { name: 'PyTorch', icon: 'SiPytorch' },
    { name: 'Keras', icon: 'SiKeras' },
    { name: 'OpenAI', icon: 'SiOpenai' },
    { name: 'Jupyter', icon: 'SiJupyter' },
    { name: 'Pandas', icon: 'SiPandas' },
    { name: 'NumPy', icon: 'SiNumpy' },
    { name: 'scikit-learn', icon: 'SiScikitlearn' },
  ],
  
  // Game Development
  'Game Dev': [
    { name: 'Unity', icon: 'SiUnity' },
    { name: 'Unreal Engine', icon: 'SiUnrealengine' },
    { name: 'Godot', icon: 'SiGodotengine' },
    { name: 'Three.js', icon: 'SiThreedotjs' },
  ],
  
  // Other
  'Other': [
    { name: 'Linux', icon: 'SiLinux' },
    { name: 'Ubuntu', icon: 'SiUbuntu' },
    { name: 'Debian', icon: 'SiDebian' },
    { name: 'Nginx', icon: 'SiNginx' },
    { name: 'Apache', icon: 'SiApache' },
    { name: 'RabbitMQ', icon: 'SiRabbitmq' },
    { name: 'Kafka', icon: 'SiApachekafka' },
    { name: 'Socket.io', icon: 'SiSocketdotio' },
    { name: 'Raspberry Pi', icon: 'SiRaspberrypi' },
    { name: 'Arduino', icon: 'SiArduino' },
  ],
};

// Flatten all icons for search
const ALL_ICONS = Object.values(ICON_LIBRARY).flat();

export default function SkillManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'SiReact',
    category: 'Frontend',
    level: 80,
    order: 0,
  });
  const [iconSearch, setIconSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
      category: 'Frontend',
      level: 80,
      order: 0,
    });
    setIconSearch('');
    setSelectedCategory('All');
  };

  // Filter icons based on search and category
  const filteredIcons = ALL_ICONS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(iconSearch.toLowerCase()) ||
                         item.icon.toLowerCase().includes(iconSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                           Object.entries(ICON_LIBRARY).some(([cat, icons]) => 
                             cat === selectedCategory && icons.some(i => i.icon === item.icon)
                           );
    return matchesSearch && matchesCategory;
  });

  // Get icon component dynamically
  const getIconComponent = (iconName: string) => {
    const IconComponent = (SimpleIcons as any)[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <span>⚡</span>;
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
      <ToastContainer theme="dark" position="top-right" />
      
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
          
          {/* Form Content - Replace with your existing form */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skill Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g., React, Python, Docker"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  {Object.keys(ICON_LIBRARY).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Icon Picker Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Select Icon ({filteredIcons.length} available)
              </label>
              
              {/* Search and Filter */}
              <div className="flex gap-3 flex-col sm:flex-row">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    placeholder="Search icons... (e.g., react, python)"
                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="All">All Categories</option>
                  {Object.keys(ICON_LIBRARY).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Selected Icon Preview */}
              <div className="flex items-center gap-3 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <div className="text-cyan-400">
                  {getIconComponent(formData.icon)}
                </div>
                <div>
                  <div className="text-sm text-gray-400">Selected Icon:</div>
                  <div className="text-white font-semibold">{formData.icon}</div>
                </div>
              </div>

              {/* Icon Grid */}
              <div className="max-h-96 overflow-y-auto bg-slate-900/30 rounded-lg p-4 border border-cyan-500/20">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {filteredIcons.map((item) => (
                    <button
                      key={item.icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: item.icon })}
                      className={`p-3 rounded-lg transition-all hover:scale-110 ${
                        formData.icon === item.icon
                          ? 'bg-cyan-500/30 border-2 border-cyan-500 text-cyan-400'
                          : 'bg-slate-800/50 border border-cyan-500/20 text-gray-400 hover:border-cyan-500/50'
                      }`}
                      title={item.name}
                    >
                      {getIconComponent(item.icon)}
                    </button>
                  ))}
                </div>
                {filteredIcons.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No icons found. Try a different search term.
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Proficiency Level (%)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-cyan-400 font-bold w-12">{formData.level}%</span>
                </div>
                <div className="mt-2 w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${formData.level}%` }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                {editingSkill ? 'Update Skill' : 'Create Skill'}
              </button>
              <button
                onClick={resetForm}
                className="px-8 py-3 bg-slate-700 rounded-lg font-bold text-white hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Skills List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/50 rounded-2xl p-4 border border-cyan-500/20 hover:border-cyan-500/50 transition-all"
          >
            <div className="text-center mb-3">
              <div className="text-cyan-400 mb-2 flex justify-center">
                {getIconComponent(skill.icon)}
              </div>
              <h3 className="font-bold text-white text-sm">{skill.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{skill.category}</p>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${skill.level}%` }}
              />
            </div>
            <div className="text-center text-xs text-cyan-400 font-semibold mb-3">
              {skill.level}%
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(skill)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition-all"
              >
                <FiEdit size={12} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(skill.id)}
                className="flex items-center justify-center px-2 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-all"
              >
                <FiTrash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚡</div>
          <h3 className="text-2xl font-bold text-cyan-400 mb-2">No Skills Yet</h3>
          <p className="text-gray-400">Click "Add Skill" to get started!</p>
        </div>
      )}
    </div>
  );
}