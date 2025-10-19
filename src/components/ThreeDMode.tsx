'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

interface ThreeDModeProps {
  onExit: () => void;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

export default function ThreeDMode({ onExit }: ThreeDModeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const sections = [
    { title: 'Welcome to Hash Nova', subtitle: 'Navigate with Arrow Keys or WASD', icon: '🚀', color: 0x06b6d4 },
    { title: 'My Projects', subtitle: 'NextTalk, U-Plus, MSCakeHub & More', icon: '💻', color: 0x3b82f6 },
    { title: 'Skills & Tech', subtitle: 'Full-Stack Mastery', icon: '⚡', color: 0x8b5cf6 },
    { title: 'Get In Touch', subtitle: 'Let\'s Build Something Amazing', icon: '📧', color: 0x06b6d4 },
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/skills')
        ]);
        
        const projectsData = await projectsRes.json();
        const skillsData = await skillsRes.json();
        
        setProjects(projectsData.slice(0, 3)); // Get first 3 projects
        setSkills(skillsData.slice(0, 6)); // Get first 6 skills
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!containerRef.current || loading) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    scene.fog = new THREE.FogExp2(0x000814, 0.04);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x06b6d4, 3, 50);
    pointLight1.position.set(10, 15, 10);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 2, 50);
    pointLight2.position.set(-10, 10, -10);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x8b5cf6, 2, 50);
    pointLight3.position.set(0, 10, -30);
    scene.add(pointLight3);

    // Create floor (grid)
    const gridHelper = new THREE.GridHelper(200, 100, 0x06b6d4, 0x1e3a8a);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Create interactive "rooms" for each section
    const rooms: THREE.Group[] = [];
    const projectMeshes: THREE.Mesh[] = [];
    const roomSpacing = 25;

    for (let i = 0; i < 4; i++) {
      const room = new THREE.Group();
      room.position.z = -i * roomSpacing;

      // Room platform
      const platformGeometry = new THREE.BoxGeometry(18, 0.5, 18);
      const platformMaterial = new THREE.MeshStandardMaterial({
        color: sections[i].color,
        emissive: sections[i].color,
        emissiveIntensity: 0.3,
        metalness: 0.5,
        roughness: 0.5,
      });
      const platform = new THREE.Mesh(platformGeometry, platformMaterial);
      platform.position.y = -1.5;
      platform.receiveShadow = true;
      room.add(platform);

      // Create floating objects based on section
      if (i === 0) {
        // Welcome - Spinning logo with "HASH NOVA" text
        const logoGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
        const logoMaterial = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          emissive: 0x06b6d4,
          emissiveIntensity: 0.5,
          wireframe: true,
        });
        const logo = new THREE.Mesh(logoGeometry, logoMaterial);
        logo.position.y = 2;
        logo.userData.rotationSpeed = 0.01;
        room.add(logo);

        // Floating particles around logo
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 150;
        const posArray = new Float32Array(particlesCount * 3);
        for (let j = 0; j < particlesCount * 3; j++) {
          posArray[j] = (Math.random() - 0.5) * 12;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
          size: 0.05,
          color: 0x06b6d4,
          transparent: true,
          opacity: 0.8,
        });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        room.add(particles);

      } else if (i === 1) {
        // Projects - Floating screens representing actual projects
        const projectCount = Math.min(projects.length, 3);
        for (let j = 0; j < projectCount; j++) {
          const screenGeometry = new THREE.BoxGeometry(3, 2, 0.2);
          const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            emissive: 0x3b82f6,
            emissiveIntensity: 0.4,
            metalness: 0.8,
            roughness: 0.2,
          });
          const screen = new THREE.Mesh(screenGeometry, screenMaterial);
          screen.position.set((j - 1) * 4.5, 2, 0);
          screen.castShadow = true;
          screen.userData.floatOffset = j * Math.PI / 3;
          screen.userData.projectIndex = j;
          screen.userData.clickable = true;
          projectMeshes.push(screen);
          room.add(screen);

          // Add glow effect around project screens
          const glowGeometry = new THREE.BoxGeometry(3.2, 2.2, 0.3);
          const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.2,
          });
          const glow = new THREE.Mesh(glowGeometry, glowMaterial);
          glow.position.copy(screen.position);
          glow.userData.followScreen = screen;
          room.add(glow);
        }

      } else if (i === 2) {
        // Skills - Rotating hexagons with actual skill data
        const hexCount = Math.min(skills.length, 6);
        for (let j = 0; j < hexCount; j++) {
          const hexGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 6);
          const hexMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b5cf6,
            emissive: 0x8b5cf6,
            emissiveIntensity: 0.4,
            metalness: 0.6,
            roughness: 0.4,
          });
          const hex = new THREE.Mesh(hexGeometry, hexMaterial);
          const angle = (j / hexCount) * Math.PI * 2;
          hex.position.set(Math.cos(angle) * 5, 2, Math.sin(angle) * 5);
          hex.rotation.x = Math.PI / 2;
          hex.castShadow = true;
          hex.userData.orbitAngle = angle;
          hex.userData.skillIndex = j;
          room.add(hex);
        }

      } else if (i === 3) {
        // Contact - Pulsing sphere with orbiting contact methods
        const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          emissive: 0x06b6d4,
          emissiveIntensity: 0.5,
          wireframe: true,
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.y = 2;
        sphere.userData.pulseTime = 0;
        room.add(sphere);

        // Add orbiting contact icons
        const contactMethods = 4; // Email, WhatsApp, Phone, Location
        for (let j = 0; j < contactMethods; j++) {
          const iconGeometry = new THREE.SphereGeometry(0.4, 16, 16);
          const iconMaterial = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.6,
          });
          const icon = new THREE.Mesh(iconGeometry, iconMaterial);
          const angle = (j / contactMethods) * Math.PI * 2;
          icon.position.set(Math.cos(angle) * 4, 2, Math.sin(angle) * 4);
          icon.userData.orbitAngle = angle;
          icon.userData.orbitSpeed = 0.5;
          room.add(icon);
        }
      }

      // Add boundary walls (wireframe)
      const wallGeometry = new THREE.BoxGeometry(18, 6, 18);
      const wallEdges = new THREE.EdgesGeometry(wallGeometry);
      const wallLine = new THREE.LineSegments(
        wallEdges,
        new THREE.LineBasicMaterial({ color: sections[i].color, transparent: true, opacity: 0.3 })
      );
      wallLine.position.y = 1;
      room.add(wallLine);

      rooms.push(room);
      scene.add(room);
    }

    // Raycaster for clicking projects
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(projectMeshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        if (clickedMesh.userData.clickable && clickedMesh.userData.projectIndex !== undefined) {
          const project = projects[clickedMesh.userData.projectIndex];
          setSelectedProject(project);
        }
      }
    };

    window.addEventListener('click', handleClick);

    // Camera movement variables
    let targetZ = 0;
    let currentZ = 0;

    // Keyboard controls
    const keys: Record<string, boolean> = {};
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = true;

      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        if (currentSection > 0) {
          setCurrentSection(prev => prev - 1);
          targetZ = -(currentSection - 1) * roomSpacing;
        }
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        if (currentSection < sections.length - 1) {
          setCurrentSection(prev => prev + 1);
          targetZ = -(currentSection + 1) * roomSpacing;
        }
      } else if (e.key === 'Escape') {
        if (selectedProject) {
          setSelectedProject(null);
        } else {
          onExit();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Mouse movement for camera look
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera movement
      currentZ += (targetZ - currentZ) * 0.05;
      camera.position.z = 12 + currentZ;
      camera.position.y = 3 + mouseY * 2;
      camera.position.x = mouseX * 3;
      camera.lookAt(0, 0, currentZ - 5);

      // Animate objects in each room
      rooms.forEach((room, index) => {
        room.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            // Rotation animations
            if (child.userData.rotationSpeed) {
              child.rotation.x += child.userData.rotationSpeed;
              child.rotation.y += child.userData.rotationSpeed;
            }

            // Float animation (project screens)
            if (child.userData.floatOffset !== undefined) {
              child.position.y = 2 + Math.sin(time * 2 + child.userData.floatOffset) * 0.5;
              child.rotation.y += 0.01;
            }

            // Orbit animation (skills hexagons and contact icons)
            if (child.userData.orbitAngle !== undefined) {
              const speed = child.userData.orbitSpeed || 0.5;
              const radius = child.userData.orbitRadius || (index === 2 ? 5 : 4);
              const angle = child.userData.orbitAngle + time * speed;
              child.position.x = Math.cos(angle) * radius;
              child.position.z = Math.sin(angle) * radius;
              if (index === 2) {
                child.rotation.z += 0.02;
              }
            }

            // Pulse animation (contact sphere)
            if (child.userData.pulseTime !== undefined) {
              const scale = 1 + Math.sin(time * 2) * 0.1;
              child.scale.set(scale, scale, scale);
              child.rotation.y += 0.01;
            }

            // Follow screen animation (glow effect)
            if (child.userData.followScreen) {
              const screen = child.userData.followScreen as THREE.Mesh;
              child.position.copy(screen.position);
              child.rotation.copy(screen.rotation);
            }
          } else if (child instanceof THREE.Points) {
            child.rotation.y += 0.001;
          }
        });
      });

      // Animate lights
      pointLight1.position.x = Math.sin(time * 0.5) * 15;
      pointLight1.position.z = Math.cos(time * 0.5) * 15;
      pointLight2.position.x = Math.cos(time * 0.3) * -15;
      pointLight2.position.z = Math.sin(time * 0.3) * -15;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      rooms.forEach(room => {
        room.children.forEach(child => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          } else if (child instanceof THREE.Points) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });
      renderer.dispose();
    };
  }, [currentSection, onExit, loading, projects, skills, selectedProject]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-900 to-blue-950 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-400 text-xl font-bold">Loading 3D Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50">
      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20 p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-8 max-w-2xl w-full border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20"
            >
              <h3 className="text-4xl font-bold text-cyan-400 mb-4">{selectedProject.title}</h3>
              <p className="text-gray-300 text-lg mb-6">{selectedProject.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/50 font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all mb-4"
                >
                  🚀 Visit Live Site
                </a>
              )}

              <button
                onClick={() => setSelectedProject(null)}
                className="block w-full px-8 py-3 bg-slate-700 rounded-lg font-bold text-white hover:bg-slate-600 transition-all"
              >
                Close (ESC)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Info Overlay */}
      <AnimatePresence>
        {showInfo && !selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-none z-10"
          >
            <motion.div
              key={currentSection}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
            >
              <div className="text-7xl mb-4">{sections[currentSection].icon}</div>
              <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {sections[currentSection].title}
              </h2>
              <p className="text-xl text-gray-300">{sections[currentSection].subtitle}</p>
              
              {/* Show actual data counts */}
              {currentSection === 1 && projects.length > 0 && (
                <p className="text-sm text-cyan-400 mt-3">Click on screens to view projects</p>
              )}
              {currentSection === 2 && skills.length > 0 && (
                <p className="text-sm text-cyan-400 mt-3">{skills.length} skills loaded</p>
              )}
              
              <div className="mt-6 flex gap-2 justify-center">
                {sections.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSection ? 'bg-cyan-400 w-8' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 items-center z-10 flex-wrap justify-center">
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl px-6 py-3 border border-cyan-500/30">
          <p className="text-cyan-400 text-sm font-semibold">
            ⬆️ ⬇️ Arrow Keys / W S to Navigate
          </p>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-md rounded-xl px-6 py-3 border border-cyan-500/30">
          <p className="text-cyan-400 text-sm font-semibold">
            🖱️ Mouse to Look Around
          </p>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="bg-slate-900/80 backdrop-blur-md rounded-xl px-6 py-3 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all"
        >
          {showInfo ? 'Hide Info' : 'Show Info'}
        </button>
      </div>

      {/* Exit Button */}
      <button
        onClick={onExit}
        className="absolute top-8 right-8 px-6 py-3 bg-red-500/20 backdrop-blur-md rounded-xl border border-red-500/50 text-red-400 font-bold hover:bg-red-500/30 transition-all z-10"
      >
        ESC - Exit 3D Mode
      </button>

      {/* Mini Map with data */}
      <div className="absolute bottom-8 right-8 bg-slate-900/80 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30 z-10">
        <p className="text-xs text-gray-400 mb-2">Location</p>
        <div className="flex flex-col gap-2">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
                index === currentSection
                  ? 'bg-cyan-500/30 text-cyan-400'
                  : 'text-gray-500'
              }`}
            >
              <span>{section.icon}</span>
              <span className="text-xs font-semibold">{section.title}</span>
              {index === 1 && projects.length > 0 && (
                <span className="ml-auto text-xs bg-cyan-500/20 px-2 py-0.5 rounded">{projects.length}</span>
              )}
              {index === 2 && skills.length > 0 && (
                <span className="ml-auto text-xs bg-purple-500/20 px-2 py-0.5 rounded">{skills.length}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}