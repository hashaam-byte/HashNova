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
  githubUrl?: string;
  imageUrl?: string;
}

interface Skill {
  id: string;
  name: string;
  icon: string;
  category: string;
  level: number;
}

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

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  imageUrl?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  published: boolean;
  tags: string[];
  createdAt: string;
}

export default function ThreeDMode({ onExit }: ThreeDModeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  
  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected item states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const sections = [
    { title: 'Welcome to Hash Nova', subtitle: 'Full-Stack Developer', icon: '🚀', color: 0x06b6d4, type: 'hero' },
    { title: 'About Me', subtitle: 'My Story & Journey', icon: '👨‍💻', color: 0x10b981, type: 'about' },
    { title: 'Skills & Tech', subtitle: 'My Technical Arsenal', icon: '⚡', color: 0x8b5cf6, type: 'skills' },
    { title: 'Projects', subtitle: 'My Work Portfolio', icon: '💻', color: 0x3b82f6, type: 'projects' },
    { title: 'Experience', subtitle: 'Professional Timeline', icon: '💼', color: 0xf59e0b, type: 'experience' },
    { title: 'Services', subtitle: 'What I Offer', icon: '🎨', color: 0xec4899, type: 'services' },
    { title: 'Testimonials', subtitle: 'Client Feedback', icon: '⭐', color: 0xeab308, type: 'testimonials' },
    { title: 'Blog', subtitle: 'Articles & Insights', icon: '📝', color: 0x06b6d4, type: 'blog' },
    { title: 'Contact', subtitle: 'Get In Touch', icon: '📧', color: 0x10b981, type: 'contact' },
  ];

  // Fetch all data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes, experiencesRes, servicesRes, testimonialsRes, blogRes] = await Promise.all([
          fetch('/api/projects').catch(() => ({ json: async () => [] })),
          fetch('/api/skills').catch(() => ({ json: async () => [] })),
          fetch('/api/experiences').catch(() => ({ json: async () => [] })),
          fetch('/api/services').catch(() => ({ json: async () => [] })),
          fetch('/api/testimonials').catch(() => ({ json: async () => [] })),
          fetch('/api/blog').catch(() => ({ json: async () => [] })),
        ]);
        
        const [projectsData, skillsData, experiencesData, servicesData, testimonialsData, blogData] = await Promise.all([
          projectsRes.json(),
          skillsRes.json(),
          experiencesRes.json(),
          servicesRes.json(),
          testimonialsRes.json(),
          blogRes.json(),
        ]);
        
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setSkills(Array.isArray(skillsData) ? skillsData : []);
        setExperiences(Array.isArray(experiencesData) ? experiencesData : []);
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
        setBlogPosts(Array.isArray(blogData) ? blogData : []);
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
    scene.fog = new THREE.FogExp2(0x000814, 0.03);

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

    const lights: THREE.PointLight[] = [];
    for (let i = 0; i < 3; i++) {
      const light = new THREE.PointLight(0x06b6d4, 2, 50);
      light.castShadow = true;
      scene.add(light);
      lights.push(light);
    }

    // Create floor
    const gridHelper = new THREE.GridHelper(300, 150, 0x06b6d4, 0x1e3a8a);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Create interactive rooms for each section
    const rooms: THREE.Group[] = [];
    const clickableMeshes: THREE.Mesh[] = [];
    const roomSpacing = 30;

    sections.forEach((section, i) => {
      const room = new THREE.Group();
      room.position.z = -i * roomSpacing;

      // Room platform
      const platformGeometry = new THREE.BoxGeometry(20, 0.5, 20);
      const platformMaterial = new THREE.MeshStandardMaterial({
        color: section.color,
        emissive: section.color,
        emissiveIntensity: 0.3,
        metalness: 0.5,
        roughness: 0.5,
      });
      const platform = new THREE.Mesh(platformGeometry, platformMaterial);
      platform.position.y = -1.5;
      platform.receiveShadow = true;
      room.add(platform);

      // Create content based on section type
      switch(section.type) {
        case 'hero':
          // Spinning logo
          const logoGeometry = new THREE.TorusGeometry(2.5, 0.6, 16, 100);
          const logoMaterial = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.5,
            wireframe: true,
          });
          const logo = new THREE.Mesh(logoGeometry, logoMaterial);
          logo.position.y = 3;
          logo.userData.rotationSpeed = 0.01;
          room.add(logo);

          // Floating stats cubes
          const stats = [
            { value: '2+', label: 'Years', x: -5, z: -3 },
            { value: '50+', label: 'Projects', x: 5, z: -3 },
            { value: '100%', label: 'Satisfaction', x: 0, z: 5 }
          ];
          stats.forEach((stat, idx) => {
            const cubeGeo = new THREE.BoxGeometry(2, 2, 2);
            const cubeMat = new THREE.MeshStandardMaterial({
              color: 0x06b6d4,
              emissive: 0x06b6d4,
              emissiveIntensity: 0.3,
            });
            const cube = new THREE.Mesh(cubeGeo, cubeMat);
            cube.position.set(stat.x, 1, stat.z);
            cube.userData.floatOffset = idx * Math.PI / 3;
            room.add(cube);
          });
          break;

        case 'about':
          // Info sphere
          const sphereGeo = new THREE.SphereGeometry(2, 32, 32);
          const sphereMat = new THREE.MeshStandardMaterial({
            color: 0x10b981,
            emissive: 0x10b981,
            emissiveIntensity: 0.4,
            wireframe: true,
          });
          const sphere = new THREE.Mesh(sphereGeo, sphereMat);
          sphere.position.y = 3;
          sphere.userData.clickable = true;
          sphere.userData.action = 'showAbout';
          clickableMeshes.push(sphere);
          room.add(sphere);

          // Quick facts orbiting
          for (let j = 0; j < 4; j++) {
            const factGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            const factMat = new THREE.MeshStandardMaterial({
              color: 0x10b981,
              emissive: 0x10b981,
              emissiveIntensity: 0.3,
            });
            const fact = new THREE.Mesh(factGeo, factMat);
            const angle = (j / 4) * Math.PI * 2;
            fact.position.set(Math.cos(angle) * 5, 3, Math.sin(angle) * 5);
            fact.userData.orbitAngle = angle;
            fact.userData.orbitSpeed = 0.3;
            fact.userData.orbitRadius = 5;
            room.add(fact);
          }
          break;

        case 'skills':
          // Display actual skills as hexagons
          const skillsToShow = skills.slice(0, 8);
          skillsToShow.forEach((skill, j) => {
            const hexGeometry = new THREE.CylinderGeometry(0.9, 0.9, 0.3, 6);
            const hexMaterial = new THREE.MeshStandardMaterial({
              color: 0x8b5cf6,
              emissive: 0x8b5cf6,
              emissiveIntensity: 0.4,
              metalness: 0.6,
              roughness: 0.4,
            });
            const hex = new THREE.Mesh(hexGeometry, hexMaterial);
            const angle = (j / skillsToShow.length) * Math.PI * 2;
            const radius = 6;
            hex.position.set(Math.cos(angle) * radius, 2, Math.sin(angle) * radius);
            hex.rotation.x = Math.PI / 2;
            hex.castShadow = true;
            hex.userData.orbitAngle = angle;
            hex.userData.skillIndex = j;
            hex.userData.orbitSpeed = 0.2;
            hex.userData.orbitRadius = radius;
            room.add(hex);
          });
          break;

        case 'projects':
          // Display actual projects as screens
          const projectsToShow = projects.slice(0, 6);
          projectsToShow.forEach((project, j) => {
            const screenGeometry = new THREE.BoxGeometry(3, 2.5, 0.2);
            const screenMaterial = new THREE.MeshStandardMaterial({
              color: 0x3b82f6,
              emissive: 0x3b82f6,
              emissiveIntensity: 0.4,
              metalness: 0.8,
              roughness: 0.2,
            });
            const screen = new THREE.Mesh(screenGeometry, screenMaterial);
            
            // Arrange in grid
            const col = j % 3;
            const row = Math.floor(j / 3);
            screen.position.set((col - 1) * 5, 2 + row * 3.5, 0);
            screen.castShadow = true;
            screen.userData.floatOffset = j * Math.PI / 6;
            screen.userData.projectIndex = j;
            screen.userData.clickable = true;
            screen.userData.action = 'showProject';
            clickableMeshes.push(screen);
            room.add(screen);

            // Add glow
            const glowGeometry = new THREE.BoxGeometry(3.3, 2.8, 0.3);
            const glowMaterial = new THREE.MeshBasicMaterial({
              color: 0x3b82f6,
              transparent: true,
              opacity: 0.2,
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.copy(screen.position);
            glow.userData.followScreen = screen;
            room.add(glow);
          });
          break;

        case 'experience':
          // Timeline with actual experiences
          const experiencesToShow = experiences.slice(0, 5);
          experiencesToShow.forEach((exp, j) => {
            const nodeGeo = new THREE.SphereGeometry(0.8, 16, 16);
            const nodeMat = new THREE.MeshStandardMaterial({
              color: 0xf59e0b,
              emissive: 0xf59e0b,
              emissiveIntensity: 0.5,
            });
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.set((j - 2) * 4, 2, 0);
            node.userData.clickable = true;
            node.userData.action = 'showExperience';
            node.userData.experienceIndex = j;
            node.userData.pulseOffset = j * Math.PI / 5;
            clickableMeshes.push(node);
            room.add(node);

            // Connect nodes with lines
            if (j > 0) {
              const points = [
                new THREE.Vector3((j - 3) * 4, 2, 0),
                new THREE.Vector3((j - 2) * 4, 2, 0)
              ];
              const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
              const lineMat = new THREE.LineBasicMaterial({ color: 0xf59e0b });
              const line = new THREE.Line(lineGeo, lineMat);
              room.add(line);
            }
          });
          break;

        case 'services':
          // Service cards as floating panels
          const servicesToShow = services.length > 0 ? services.slice(0, 6) : [
            { icon: '💻', title: 'Web Dev' },
            { icon: '📱', title: 'Mobile' },
            { icon: '🎨', title: 'UI/UX' },
            { icon: '🤖', title: 'AI' },
            { icon: '🔒', title: 'Backend' },
            { icon: '⚡', title: 'Optimization' }
          ];
          servicesToShow.forEach((service, j) => {
            const cardGeo = new THREE.BoxGeometry(2.5, 3, 0.3);
            const cardMat = new THREE.MeshStandardMaterial({
              color: 0xec4899,
              emissive: 0xec4899,
              emissiveIntensity: 0.3,
            });
            const card = new THREE.Mesh(cardGeo, cardMat);
            const col = j % 3;
            const row = Math.floor(j / 3);
            card.position.set((col - 1) * 4.5, 2 + row * 4, 0);
            card.userData.clickable = true;
            card.userData.action = 'showService';
            card.userData.serviceIndex = j;
            card.userData.floatOffset = j * Math.PI / 6;
            clickableMeshes.push(card);
            room.add(card);
          });
          break;

        case 'testimonials':
          // Testimonial stars
          const testimonialsToShow = testimonials.slice(0, 5);
          testimonialsToShow.forEach((testimonial, j) => {
            const starGeo = new THREE.SphereGeometry(0.7, 8, 8);
            const starMat = new THREE.MeshStandardMaterial({
              color: 0xeab308,
              emissive: 0xeab308,
              emissiveIntensity: 0.6,
            });
            const star = new THREE.Mesh(starGeo, starMat);
            const angle = (j / testimonialsToShow.length) * Math.PI * 2;
            star.position.set(Math.cos(angle) * 5, 2.5, Math.sin(angle) * 5);
            star.userData.clickable = true;
            star.userData.action = 'showTestimonial';
            star.userData.testimonialIndex = j;
            star.userData.orbitAngle = angle;
            star.userData.orbitSpeed = 0.25;
            star.userData.orbitRadius = 5;
            clickableMeshes.push(star);
            room.add(star);
          });
          break;

        case 'blog':
          // Blog post cards
          const postsToShow = blogPosts.slice(0, 6);
          postsToShow.forEach((post, j) => {
            const postGeo = new THREE.BoxGeometry(2.5, 3.5, 0.3);
            const postMat = new THREE.MeshStandardMaterial({
              color: 0x06b6d4,
              emissive: 0x06b6d4,
              emissiveIntensity: 0.3,
            });
            const postMesh = new THREE.Mesh(postGeo, postMat);
            const col = j % 3;
            const row = Math.floor(j / 3);
            postMesh.position.set((col - 1) * 4.5, 2 + row * 4.5, 0);
            postMesh.userData.clickable = true;
            postMesh.userData.action = 'showBlogPost';
            postMesh.userData.blogIndex = j;
            postMesh.userData.floatOffset = j * Math.PI / 6;
            clickableMeshes.push(postMesh);
            room.add(postMesh);
          });
          break;

        case 'contact':
          // Contact methods as orbiting spheres
          const contactMethods = [
            { icon: '📧', color: 0x06b6d4 },
            { icon: '💬', color: 0x10b981 },
            { icon: '📞', color: 0x8b5cf6 },
            { icon: '📍', color: 0xf59e0b }
          ];
          contactMethods.forEach((method, j) => {
            const contactGeo = new THREE.SphereGeometry(0.8, 16, 16);
            const contactMat = new THREE.MeshStandardMaterial({
              color: method.color,
              emissive: method.color,
              emissiveIntensity: 0.5,
            });
            const contactSphere = new THREE.Mesh(contactGeo, contactMat);
            const angle = (j / contactMethods.length) * Math.PI * 2;
            contactSphere.position.set(Math.cos(angle) * 5, 2.5, Math.sin(angle) * 5);
            contactSphere.userData.orbitAngle = angle;
            contactSphere.userData.orbitSpeed = 0.4;
            contactSphere.userData.orbitRadius = 5;
            room.add(contactSphere);
          });

          // Central contact button
          const contactButtonGeo = new THREE.CylinderGeometry(2, 2, 1, 32);
          const contactButtonMat = new THREE.MeshStandardMaterial({
            color: 0x10b981,
            emissive: 0x10b981,
            emissiveIntensity: 0.4,
          });
          const contactButton = new THREE.Mesh(contactButtonGeo, contactButtonMat);
          contactButton.position.y = 2;
          contactButton.userData.clickable = true;
          contactButton.userData.action = 'showContact';
          contactButton.userData.pulseTime = 0;
          clickableMeshes.push(contactButton);
          room.add(contactButton);
          break;
      }

      // Room boundary
      const wallGeometry = new THREE.BoxGeometry(20, 8, 20);
      const wallEdges = new THREE.EdgesGeometry(wallGeometry);
      const wallLine = new THREE.LineSegments(
        wallEdges,
        new THREE.LineBasicMaterial({ color: section.color, transparent: true, opacity: 0.3 })
      );
      wallLine.position.y = 2;
      room.add(wallLine);

      rooms.push(room);
      scene.add(room);
    });

    // Raycaster for clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickableMeshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const action = clickedMesh.userData.action;

        switch(action) {
          case 'showProject':
            if (clickedMesh.userData.projectIndex !== undefined) {
              setSelectedProject(projects[clickedMesh.userData.projectIndex]);
            }
            break;
          case 'showExperience':
            if (clickedMesh.userData.experienceIndex !== undefined) {
              setSelectedExperience(experiences[clickedMesh.userData.experienceIndex]);
            }
            break;
          case 'showService':
            if (clickedMesh.userData.serviceIndex !== undefined) {
              const serviceData = services.length > 0 ? services[clickedMesh.userData.serviceIndex] : null;
              setSelectedService(serviceData);
            }
            break;
          case 'showTestimonial':
            if (clickedMesh.userData.testimonialIndex !== undefined) {
              setSelectedTestimonial(testimonials[clickedMesh.userData.testimonialIndex]);
            }
            break;
          case 'showBlogPost':
            if (clickedMesh.userData.blogIndex !== undefined) {
              setSelectedBlogPost(blogPosts[clickedMesh.userData.blogIndex]);
            }
            break;
          case 'showAbout':
            setShowAbout(true);
            break;
          case 'showContact':
            setShowContact(true);
            break;
        }
      }
    };

    window.addEventListener('click', handleClick);

    // Camera movement
    let targetZ = 0;
    let currentZ = 0;

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        if (currentSection > 0) {
          setCurrentSection(prev => prev - 1);
        }
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        if (currentSection < sections.length - 1) {
          setCurrentSection(prev => prev + 1);
        }
      } else if (e.key === 'Escape') {
        if (selectedProject || selectedExperience || selectedService || selectedTestimonial || selectedBlogPost || showAbout || showContact) {
          setSelectedProject(null);
          setSelectedExperience(null);
          setSelectedService(null);
          setSelectedTestimonial(null);
          setSelectedBlogPost(null);
          setShowAbout(false);
          setShowContact(false);
        } else {
          onExit();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Mouse look
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

      // Update target position
      targetZ = -currentSection * roomSpacing;

      // Smooth camera movement
      currentZ += (targetZ - currentZ) * 0.05;
      camera.position.z = 12 + currentZ;
      camera.position.y = 3 + mouseY * 2;
      camera.position.x = mouseX * 3;
      camera.lookAt(0, 0, currentZ - 5);

      // Animate objects
      rooms.forEach((room, roomIndex) => {
        room.children.forEach((child) => {
          if (child instanceof THREE.Mesh) {
            // Rotation
            if (child.userData.rotationSpeed) {
              child.rotation.x += child.userData.rotationSpeed;
              child.rotation.y += child.userData.rotationSpeed;
            }

            // Float animation
            if (child.userData.floatOffset !== undefined) {
              child.position.y = child.position.y + Math.sin(time * 2 + child.userData.floatOffset) * 0.01;
              child.rotation.y += 0.005;
            }

            // Orbit animation
            if (child.userData.orbitAngle !== undefined) {
              const speed = child.userData.orbitSpeed || 0.3;
              const radius = child.userData.orbitRadius || 5;
              const angle = child.userData.orbitAngle + time * speed;
              const baseX = child.position.x / Math.sqrt(child.position.x ** 2 + child.position.z ** 2) * radius || Math.cos(child.userData.orbitAngle) * radius;
              const baseZ = child.position.z / Math.sqrt(child.position.x ** 2 + child.position.z ** 2) * radius || Math.sin(child.userData.orbitAngle) * radius;
              child.position.x = Math.cos(angle) * radius;
              child.position.z = Math.sin(angle) * radius;
            }

            // Pulse animation
            if (child.userData.pulseTime !== undefined || child.userData.pulseOffset !== undefined) {
              const offset = child.userData.pulseOffset || 0;
              const scale = 1 + Math.sin(time * 2 + offset) * 0.1;
              child.scale.set(scale, scale, scale);
            }

            // Follow animation
            if (child.userData.followScreen) {
              const screen = child.userData.followScreen as THREE.Mesh;
              child.position.copy(screen.position);
              child.rotation.copy(screen.rotation);
            }
          }
        });
      });

      // Animate lights
      lights.forEach((light, i) => {
        const angle = time * 0.3 + (i * Math.PI * 2) / 3;
        light.position.x = Math.cos(angle) * 15;
        light.position.z = Math.sin(angle) * 15 + currentZ;
        light.position.y = 10 + Math.sin(time + i) * 3;
      });

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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, [currentSection, onExit, loading, projects, skills, experiences, services, testimonials, blogPosts]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black via-slate-900 to-blue-950 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-400 text-xl font-bold">Loading 3D Experience...</p>
          <p className="text-gray-400 text-sm mt-2">Fetching portfolio data...</p>
        </div>
      </div>
    );
  }

  const closeAllModals = () => {
    setSelectedProject(null);
    setSelectedExperience(null);
    setSelectedService(null);
    setSelectedTestimonial(null);
    setSelectedBlogPost(null);
    setShowAbout(false);
    setShowContact(false);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50">
      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-20 p-4"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-8 max-w-2xl w-full border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-4xl font-bold text-cyan-400">{selectedProject.title}</h3>
                <button onClick={closeAllModals} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              
              {selectedProject.imageUrl && (
                <img src={selectedProject.imageUrl} alt={selectedProject.title} className="w-full h-64 object-cover rounded-xl mb-4" />
              )}
              
              <p className="text-gray-300 text-lg mb-6">{selectedProject.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.technologies.map((tech, i) => (
                  <span key={i} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/50 font-semibold text-sm">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all text-center"
                  >
                    🚀 Visit Live Site
                  </a>
                )}
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-6 py-3 bg-slate-700 rounded-lg font-bold text-white hover:bg-slate-600 transition-all text-center"
                  >
                    💻 View Code
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experience Modal */}
      <AnimatePresence>
        {selectedExperience && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-20 p-4"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-orange-950 rounded-2xl p-8 max-w-2xl w-full border-2 border-orange-500/50 shadow-2xl shadow-orange-500/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-3xl font-bold text-orange-400">{selectedExperience.title}</h3>
                  <p className="text-xl text-white font-semibold mt-2">{selectedExperience.company}</p>
                </div>
                <button onClick={closeAllModals} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              
              <div className="flex items-center gap-4 mb-4 text-gray-300">
                <span>📍 {selectedExperience.location}</span>
                <span>•</span>
                <span>{selectedExperience.startDate} - {selectedExperience.current ? 'Present' : selectedExperience.endDate}</span>
              </div>
              
              {selectedExperience.current && (
                <span className="inline-block px-4 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/50 mb-4">
                  Currently Working Here
                </span>
              )}
              
              <p className="text-gray-300 text-lg">{selectedExperience.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-20 p-4"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-pink-950 rounded-2xl p-8 max-w-2xl w-full border-2 border-pink-500/50 shadow-2xl shadow-pink-500/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-6xl">{selectedService.icon}</span>
                  <h3 className="text-3xl font-bold text-pink-400">{selectedService.title}</h3>
                </div>
                <button onClick={closeAllModals} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              
              <p className="text-gray-300 text-lg mb-6">{selectedService.description}</p>
              
              <div className="space-y-3">
                <h4 className="text-xl font-bold text-pink-400 mb-3">Features:</h4>
                {selectedService.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="text-pink-400 text-xl">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonial Modal */}
      <AnimatePresence>
        {selectedTestimonial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-20 p-4"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-yellow-950 rounded-2xl p-8 max-w-2xl w-full border-2 border-yellow-500/50 shadow-2xl shadow-yellow-500/20"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-2xl ${i < selectedTestimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`}>
                      ⭐
                    </span>
                  ))}
                </div>
                <button onClick={closeAllModals} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              
              <p className="text-gray-300 text-xl italic mb-6">"{selectedTestimonial.content}"</p>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-3xl">
                  {selectedTestimonial.imageUrl ? (
                    <img src={selectedTestimonial.imageUrl} alt={selectedTestimonial.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    selectedTestimonial.name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="font-bold text-white text-xl">{selectedTestimonial.name}</div>
                  <div className="text-gray-400">
                    {selectedTestimonial.role} at {selectedTestimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blog Post Modal */}
      <AnimatePresence>
        {selectedBlogPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-20 p-4"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-cyan-950 rounded-2xl p-8 max-w-2xl w-full border-2 border-cyan-500/50 shadow-2xl shadow-cyan-500/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-3xl font-bold text-cyan-400">{selectedBlogPost.title}</h3>
                <button onClick={closeAllModals} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              
              {selectedBlogPost.coverImage && (
                <img src={selectedBlogPost.coverImage} alt={selectedBlogPost.title} className="w-full h-64 object-cover rounded-xl mb-4" />
              )}
              
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                <span>{new Date(selectedBlogPost.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                {selectedBlogPost.published && (
                  <>
                    <span>•</span>
                    <span className="text-green-400">Published</span>
                  </>
                )}
              </div>
              
              <p className="text-gray-300 text-lg mb-6">{selectedBlogPost.excerpt}</p>
              
              <div className="flex flex-wrap gap-2">
                {selectedBlogPost.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/50 text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-20 p-4"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-green-950 rounded-2xl p-8 max-w-3xl w-full border-2 border-green-500/50 shadow-2xl shadow-green-500/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-4xl font-bold text-green-400 mb-2">About Me</h3>
                  <p className="text-xl text-gray-300">Hashaam Mustafa - Hash Nova</p>
                </div>
                <button onClick={closeAllModals} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              
              <div className="space-y-4 text-lg text-gray-300 mb-6">
                <p>
                  I'm a passionate developer focused on building privacy-first, AI-powered, and user-centered apps. I love combining creativity and tech to bring futuristic experiences to life.
                </p>
                <p>
                  Since 2023, I've been crafting stunning websites for clients, pushing the boundaries of what's possible on the web. Currently studying at UPSS while building the next generation of web applications.
                </p>
                <p>
                  My journey in coding has been driven by curiosity and a desire to create tools that make a real difference. From real-time communication platforms to educational solutions, I'm always exploring new technologies and challenges.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                  <div className="text-green-400 font-bold mb-1">🎓 Education</div>
                  <div className="text-sm text-gray-400">UPSS Student</div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                  <div className="text-green-400 font-bold mb-1">📍 Location</div>
                  <div className="text-sm text-gray-400">Benin City, NG</div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                  <div className="text-green-400 font-bold mb-1">💼 Experience</div>
                  <div className="text-sm text-gray-400">Since 2023</div>
                </div>
                <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                  <div className="text-green-400 font-bold mb-1">🎯 Focus</div>
                  <div className="text-sm text-gray-400">Full-Stack Dev</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-20 p-4"
            onClick={closeAllModals}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-green-950 rounded-2xl p-8 max-w-2xl w-full border-2 border-green-500/50 shadow-2xl shadow-green-500/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-4xl font-bold text-green-400">Get In Touch</h3>
                <button onClick={closeAllModals} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              
              <p className="text-gray-300 text-lg mb-6">
                Have a project in mind? Want to collaborate? Feel free to reach out!
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:hashcody63@gmail.com"
                  className="flex items-center gap-4 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all"
                >
                  <span className="text-3xl">📧</span>
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="text-white font-semibold">hashcody63@gmail.com</div>
                  </div>
                </a>

                <a
                  href="https://wa.me/2348077291745"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-green-500/10 rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all"
                >
                  <span className="text-3xl">💬</span>
                  <div>
                    <div className="text-sm text-gray-400">WhatsApp</div>
                    <div className="text-white font-semibold">08077291745</div>
                  </div>
                </a>

                <a
                  href="tel:+2348077291745"
                  className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all"
                >
                  <span className="text-3xl">📞</span>
                  <div>
                    <div className="text-sm text-gray-400">Phone</div>
                    <div className="text-white font-semibold">08077291745</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 bg-orange-500/10 rounded-xl border border-orange-500/30">
                  <span className="text-3xl">📍</span>
                  <div>
                    <div className="text-sm text-gray-400">Location</div>
                    <div className="text-white font-semibold">Benin City, Edo State, NG</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-pink-500/10 rounded-xl border border-pink-500/30">
                  <span className="text-3xl">💬</span>
                  <div>
                    <div className="text-sm text-gray-400">NextTalk ID</div>
                    <div className="text-white font-semibold">hashaamustafa</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Info Overlay */}
      <AnimatePresence>
        {showInfo && !selectedProject && !selectedExperience && !selectedService && !selectedTestimonial && !selectedBlogPost && !showAbout && !showContact && (
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
              className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
            >
              <div className="text-6xl mb-3">{sections[currentSection].icon}</div>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {sections[currentSection].title}
              </h2>
              <p className="text-lg text-gray-300 mb-3">{sections[currentSection].subtitle}</p>
              
              {/* Data counts */}
              {currentSection === 3 && projects.length > 0 && (
                <p className="text-sm text-cyan-400">💡 {projects.length} projects • Click to explore</p>
              )}
              {currentSection === 2 && skills.length > 0 && (
                <p className="text-sm text-purple-400">⚡ {skills.length} skills mastered</p>
              )}
              {currentSection === 4 && experiences.length > 0 && (
                <p className="text-sm text-orange-400">💼 {experiences.length} experiences • Click to view</p>
              )}
              {currentSection === 5 && services.length > 0 && (
                <p className="text-sm text-pink-400">🎨 {services.length} services • Click for details</p>
              )}
              {currentSection === 6 && testimonials.length > 0 && (
                <p className="text-sm text-yellow-400">⭐ {testimonials.length} testimonials • Click to read</p>
              )}
              {currentSection === 7 && blogPosts.length > 0 && (
                <p className="text-sm text-cyan-400">📝 {blogPosts.length} blog posts • Click to read</p>
              )}
              
              <div className="mt-4 flex gap-2 justify-center">
                {sections.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSection ? 'bg-cyan-400 w-6' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 items-center z-10 flex-wrap justify-center px-4">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-xl px-5 py-2 border border-cyan-500/30">
          <p className="text-cyan-400 text-sm font-semibold">⬆️⬇️ W/S Navigate</p>
        </div>
        <div className="bg-slate-900/90 backdrop-blur-md rounded-xl px-5 py-2 border border-cyan-500/30">
          <p className="text-cyan-400 text-sm font-semibold">🖱️ Mouse Look</p>
        </div>
        <div className="bg-slate-900/90 backdrop-blur-md rounded-xl px-5 py-2 border border-cyan-500/30">
          <p className="text-cyan-400 text-sm font-semibold">🖱️ Click Objects</p>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="bg-slate-900/90 backdrop-blur-md rounded-xl px-5 py-2 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm font-semibold"
        >
          {showInfo ? 'Hide Info' : 'Show Info'}
        </button>
      </div>

      {/* Exit Button */}
      <button
        onClick={onExit}
        className="absolute top-8 right-8 px-6 py-3 bg-red-500/20 backdrop-blur-md rounded-xl border border-red-500/50 text-red-400 font-bold hover:bg-red-500/30 transition-all z-10"
      >
        ESC - Exit 3D
      </button>

      {/* Mini Map */}
      <div className="absolute bottom-8 right-8 bg-slate-900/90 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30 z-10 max-w-xs">
        <p className="text-xs text-gray-400 mb-2 font-semibold">Navigation Map</p>
        <div className="flex flex-col gap-2">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 px-3 py-2 rounded transition-all cursor-pointer ${
                index === currentSection
                  ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                  : 'text-gray-500 hover:bg-slate-800'
              }`}
              onClick={() => setCurrentSection(index)}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-xs font-semibold flex-1">{section.title}</span>
              {index === 3 && projects.length > 0 && (
                <span className="text-xs bg-cyan-500/20 px-2 py-0.5 rounded">{projects.length}</span>
              )}
              {index === 2 && skills.length > 0 && (
                <span className="text-xs bg-purple-500/20 px-2 py-0.5 rounded">{skills.length}</span>
              )}
              {index === 4 && experiences.length > 0 && (
                <span className="text-xs bg-orange-500/20 px-2 py-0.5 rounded">{experiences.length}</span>
              )}
              {index === 5 && services.length > 0 && (
                <span className="text-xs bg-pink-500/20 px-2 py-0.5 rounded">{services.length}</span>
              )}
              {index === 6 && testimonials.length > 0 && (
                <span className="text-xs bg-yellow-500/20 px-2 py-0.5 rounded">{testimonials.length}</span>
              )}
              {index === 7 && blogPosts.length > 0 && (
                <span className="text-xs bg-cyan-500/20 px-2 py-0.5 rounded">{blogPosts.length}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}