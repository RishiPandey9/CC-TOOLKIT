export const personalInfo = {
  name: "Rishi Pandey",
  firstName: "Rishi",
  lastName: "Pandey",
  title: "Full Stack Developer",
  roles: ["FULL-STACK DEVELOPER", "AI ENGINEER", "CREATOR"],
  email: "rishipandey3691@gmail.com",
  phone: "+91-9156694390",
  linkedin: "https://linkedin.com/in/rishi-pandey-dev",
  github: "https://github.com/RishiPandey9",
  twitter: "https://twitter.com/rishipandey",
  resume: "/resume.pdf",
  heroVideoUrl: "",
  location: "Nagpur, India",
  availability: "Full-time & Freelance",
  focus: "AI, Web, Product Engineering",
  languages: "English, Hindi",
  timezone: "IST (UTC +5:30)",
  about:
    "I'm a Full-Stack Developer and AI Engineer who transforms complex problems into simple, beautiful, and intelligent solutions. I combine code, design, and technology to build products that create real impact.",
  signature: "Rishi Pandey",
};

export const heroStats = [
  { value: "2+", label: "YEARS EXPERIENCE" },
  { value: "10+", label: "PROJECTS BUILT" },
  { value: "20+", label: "TECHNOLOGIES" },
  { value: "5+", label: "CLIENTS / PRODUCTS" },
];

export const navItems = [
  { name: "HOME", href: "/" },
  { name: "ABOUT", href: "#about" },
  { name: "EXPERIENCE", href: "#experience" },
  { name: "PROJECTS", href: "#projects" },
  { name: "BLOG", href: "#blog" },
  { name: "CONTACT", href: "#contact" },
];

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/RishiPandey9", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/in/rishi-pandey-dev", icon: "linkedin" },
  { label: "Twitter", href: "https://twitter.com/rishipandey", icon: "twitter" },
];

export const experience = [
  {
    role: "Forward Deployed Engineer Intern",
    company: "Botmartz AI Solutions",
    location: "Remote",
    period: "Feb 2026 – Present",
    technologies: ["Next.js", "Node.js", "Express.js", "PostgreSQL", "Prisma", "Redis", "Firebase", "Razorpay"],
    achievements: [
      "Ship full-stack features end-to-end on a live production platform — UI to database — working directly with the product team.",
      "Design and manage relational schemas across 50+ Prisma models, handling migrations, indexing, and query optimization.",
      "Integrate Firebase, PostgreSQL, and Razorpay to power authentication, real-time features, storage, and payments.",
    ],
  },
  {
    role: "Junior Software Engineer",
    company: "AnkHub Technology Services",
    location: "Nagpur",
    period: "Dec 2025 – Feb 2026",
    technologies: ["Node.js", "Express.js", "MongoDB", "JWT", "Postman"],
    achievements: [
      "Built a production backend from scratch with JWT authentication, role-based access control, and centralized error handling.",
      "Architected scalable MongoDB schemas and indexing strategies; tested and documented all APIs in Postman.",
    ],
  },
];

export const projects = [
  {
    id: "01",
    name: "Botmartz Academy",
    description: "Full-stack LMS for Botmartz's training academy — student onboarding, course delivery, payments, and live community features.",
    image: "/projects/botmartz-academy.png",
    technologies: ["Next.js", "Python"],
    category: "AI Platform",
    link: "https://academy.botmartz.com",
    github: "",
    role: "Forward Deployed Engineer Intern",
    scope: "Production LMS · Full-stack delivery",
    highlights: ["50+ Prisma models across the product domain", "Firebase, PostgreSQL, and Razorpay integrations", "Student onboarding, payments, and course delivery"],
  },
  {
    id: "02",
    name: "MobiwebGS",
    description: "Production digital agency platform with SEO-optimized static site generation and a Firestore-backed CMS.",
    image: "/projects/mobiwebs.png",
    technologies: ["React", "Node.js"],
    category: "SaaS Application",
    link: "https://mobiwebgs.com",
    github: "",
    role: "Full-stack product engineer",
    scope: "AI-first agency platform · CMS architecture",
    highlights: ["SEO-focused static site generation", "Firestore-backed content workflows", "Product, work, and insight pages built for conversion"],
  },
  {
    id: "03",
    name: "RAG AI Chatbot",
    description: "Multi-agent system using Weaviate vector search and OpenRouter API for intelligent knowledge-base Q&A.",
    image: "/projects/rag-ai.svg",
    technologies: ["Python", "LangChain"],
    category: "AI Agent System",
    link: "",
    github: "",
    role: "AI systems engineer",
    scope: "Retrieval augmented generation · Multi-agent workflows",
    highlights: ["Weaviate vector search", "OpenRouter-powered knowledge Q&A", "Context-aware responses across an indexed knowledge base"],
  },
  {
    id: "04",
    name: "CCToolkit",
    description: "Browser-based cryptography toolkit implementing 8 cipher techniques with multi-layer encryption mode.",
    image: "/projects/cctoolkit.svg",
    technologies: ["Next.js", "n8n"],
    category: "Automation Platform",
    link: "https://cctool-delta.vercel.app",
    github: "",
    role: "Product engineer",
    scope: "Security tooling · Browser-first experience",
    highlights: ["Eight cipher techniques in one toolkit", "Multi-layer encryption mode", "Fast client-side interaction without a setup step"],
  },
  {
    id: "05",
    name: "Multilingual OCR",
    description: "Multilingual OCR pipeline achieving 95% recognition accuracy via denoising, thresholding, and edge-detection.",
    image: "/projects/multilingual-ocr.svg",
    technologies: ["React", "PostgreSQL"],
    category: "Fintech Product",
    link: "",
    github: "https://github.com/RishiPandey9/Multilingual-OCR-System",
    role: "Applied AI engineer",
    scope: "Document intelligence · OCR pipeline",
    highlights: ["Denoising and thresholding pipeline", "Edge detection for difficult scans", "Multilingual recognition workflow"],
  },
];

export const services = [
  {
    icon: "ai",
    title: "AI Development",
    description: "Building intelligent systems and AI-powered applications that solve real-world problems.",
  },
  {
    icon: "stack",
    title: "Full-Stack Development",
    description: "End-to-end web applications using modern stacks and best practices.",
  },
  {
    icon: "design",
    title: "UI / UX Engineering",
    description: "Crafting beautiful, intuitive interfaces with seamless user experiences.",
  },
  {
    icon: "web",
    title: "Web Applications",
    description: "High-performance, scalable web apps for startups and enterprises.",
  },
  {
    icon: "automation",
    title: "AI Automation",
    description: "Automating workflows and business processes with AI and integrations.",
  },
  {
    icon: "product",
    title: "Product Engineering",
    description: "Building digital products from idea to launch with strong architecture.",
  },
];

export const technologies = [
  { name: "React", icon: "R" },
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "TS" },
  { name: "Node.js", icon: "N" },
  { name: "Python", icon: "Py" },
  { name: "PostgreSQL", icon: "PG" },
  { name: "Prisma", icon: "◆" },
  { name: "OpenAI", icon: "✦" },
  { name: "AWS", icon: "AWS" },
  { name: "Docker", icon: "D" },
  { name: "Git", icon: "◎" },
  { name: "Figma", icon: "F" },
  { name: "Framer Motion", icon: "◉" },
];

export const testimonials = [
  {
    quote: "Rishi is an exceptional engineer who understands both technology and business. A pleasure to work with!",
    name: "Sarah Johnson",
    role: "hello@manager, TechNova",
    avatar: "",
  },
  {
    quote: "He delivered beyond expectations. Clean code, on-time delivery and amazing communication.",
    name: "Daniel Carter",
    role: "CEO, Finsie",
    avatar: "",
  },
  {
    quote: "Rishi's AI expertise helped us build a product that our users absolutely love. Highly recommended!",
    name: "Aisha Khan",
    role: "@rayan_Morph",
    avatar: "",
  },
];

export const journeyStats = [
  { label: "Projects Shipped", value: "10+", sublabel: "Production Deployments", chart: true },
  { label: "Core Pillars", value: "3 Areas", tiers: ["Full-Stack", "Applied AI", "System Architecture"] },
  { label: "Tech Stack", value: "20+", sublabel: "Frameworks & Tools", badges: true },
  { label: "Satisfied Clients", value: "5+", sublabel: "High Impact Delivery", avatars: true },
];

