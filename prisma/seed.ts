import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  
  await prisma.admin.upsert({
    where: { username: 'hashnova' },
    update: {},
    create: {
      username: 'hashnova',
      password: hashedPassword,
    },
  });

  // Create initial projects
  const projects = [
    {
      title: 'NextTalk',
      description: 'A modern communication platform built with Next.js featuring real-time messaging, voice calls, and seamless collaboration.',
      technologies: ['Next.js', 'TypeScript', 'WebRTC', 'Socket.io'],
      liveUrl: 'https://nexttalk-web.vercel.app',
      featured: true,
      order: 1,
    },
    {
      title: 'U-Plus',
      description: 'An innovative educational platform designed to enhance learning experiences with interactive features and AI-powered recommendations.',
      technologies: ['React', 'Node.js', 'MongoDB', 'AI'],
      liveUrl: 'https://u-plus.vercel.app',
      featured: true,
      order: 2,
    },
    {
      title: 'MSCakeHub',
      description: 'A delightful e-commerce platform for custom cakes with order management, gallery, and delivery tracking.',
      technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
      liveUrl: 'https://mscakehub.vercel.app',
      featured: true,
      order: 3,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { id: project.title.toLowerCase() },
      update: {},
      create: { ...project, id: project.title.toLowerCase() },
    });
  }

  // Create initial skills
  const skills = [
    { name: 'JavaScript', icon: 'SiJavascript', category: 'Language', level: 95, order: 1 },
    { name: 'TypeScript', icon: 'SiTypescript', category: 'Language', level: 90, order: 2 },
    { name: 'React', icon: 'SiReact', category: 'Framework', level: 95, order: 3 },
    { name: 'Next.js', icon: 'SiNextdotjs', category: 'Framework', level: 95, order: 4 },
    { name: 'Node.js', icon: 'SiNodedotjs', category: 'Backend', level: 90, order: 5 },
    { name: 'MongoDB', icon: 'SiMongodb', category: 'Database', level: 85, order: 6 },
    { name: 'Flutter', icon: 'SiFlutter', category: 'Mobile', level: 80, order: 7 },
    { name: 'PostgreSQL', icon: 'SiPostgresql', category: 'Database', level: 85, order: 8 },
    { name: 'Prisma', icon: 'SiPrisma', category: 'ORM', level: 90, order: 9 },
    { name: 'Tailwind CSS', icon: 'SiTailwindcss', category: 'Styling', level: 95, order: 10 },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });