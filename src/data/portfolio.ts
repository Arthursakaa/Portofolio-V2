export interface Project {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  highlights: string[];
  stack: string[];
  demoUrl?: string;
  githubUrl: string;
  featured?: boolean;
  status: "Completed" | "Active" | "Prototype";
  year: string;
}

export interface SkillCategory {
  name: string;
  slot: string;
  items: { name: string; tag: string; iconKey: string }[];
}

export interface TimelineItem {
  period: string;
  role: string;
  organization: string;
  description: string;
  type: "Education" | "Experience" | "Milestone";
}

export const portfolioData = {
  profile: {
    fullName: "I Gede Arthur Saka Dewantara",
    displayName: "Arthur Saka",
    callsign: "ARTHUR // SAKA",
    title: "Computer Science Student @ BINUS University",
    role: "Full-Stack Developer & AI Systems Enthusiast",
    guild: "BINUS University",
    major: "Computer Science",
    classType: "Full-Stack Engineer",
    level: "LVL.21",
    status: "OPEN FOR FULL-STACK INTERNSHIP",
    location: "Malang, Indonesia",
    tagline:
      "Bridging technical complexity with intuitive, human-centered interfaces. Building modern full-stack web applications, AI-driven systems, and retro-infused digital playgrounds.",
    about:
      "I am a Computer Science student at BINUS University based in Malang, Indonesia, and a Full-Stack Developer with a deep curiosity for AI systems, distributed design, and clean web engineering. Whether crafting high-throughput backends with Laravel and Go, building responsive React frontends, or experimenting with intelligent educational models, I strive to build software that is both technically rigorous and delightful to use. Currently seeking Full-Stack Developer internship opportunities to contribute to high-impact engineering teams.",
    traits: [
      { label: "FOCUS", val: "Full-Stack + AI" },
      { label: "GUILD", val: "BINUS University" },
      { label: "LOCATION", val: "Malang, ID" },
      { label: "STATUS", val: "Full-Stack Intern" },
    ],
    socials: {
      github: "https://github.com/Arthursakaa",
      githubRepos: "https://github.com/Arthursakaa?tab=repositories",
      linkedin: "https://www.linkedin.com/in/i-gede-arthur-saka-dewantara-143311326",
      email: "arthursakaa16@gmail.com",
    },
    resumeUrl: "/CV_Arthur_Saka.pdf",
    photo: "/profileporto.png",
  },

  resume: {
    fileName: "CV_Arthur_Saka.pdf",
    fileUrl: "/CV_Arthur_Saka.pdf",
    title: "Curriculum Vitae",
    subtitle: "Full-Stack Developer Intern",
    lastUpdated: "2026",
    status: "Available for Download",
    format: "PDF (Print & Machine Readable)",
    note: "Simpan file PDF Anda di folder 'public/CV_Arthur_Saka.pdf' untuk memperbarui CV kapan saja tanpa perlu mengubah kode.",
  },

  projects: [
    {
      id: "fitnessvals",
      title: "FitnessVals Ecosystem",
      category: "Full-Stack / AI Health",
      badge: "FEATURED QUEST",
      description:
        "Next-generation AI-powered gym management platform and personalized health ecosystem combining real-time tracking, intelligent workout routines, and high-performance microservices.",
      highlights: [
        "Hybrid backend architecture utilizing Laravel 12 for business domain and Go 1.25 for high-throughput metrics",
        "Real-time event broadcasting powered by Laravel Reverb WebSockets",
        "Modern interface built with Tailwind CSS 4 & Vite 7",
      ],
      stack: ["Laravel 12", "Go", "Tailwind CSS v4", "Vite", "WebSockets", "PHP"],
      githubUrl: "https://github.com/Arthursakaa/Web_FitnessVals",
      featured: true,
      status: "Active",
      year: "2026",
    },
    {
      id: "edubot",
      title: "EduBot: Learning Analyzer",
      category: "AI / Educational Tech",
      badge: "AI ENGINE",
      description:
        "Intelligent diagnostic platform determining children's learning styles based on the VAK (Visual, Auditory, Kinesthetic) model using supervised machine learning.",
      highlights: [
        "Custom ML classification model trained on student learning behavior datasets",
        "Interactive questionnaire interface with instant visual diagnostic breakdown",
        "Python Flask backend serving model inference endpoints to a responsive client",
      ],
      stack: ["Python", "scikit-learn", "Flask", "JavaScript", "HTML5/CSS3"],
      demoUrl: "https://arthursakaa.github.io/Edubot-GayaBelajar/",
      githubUrl: "https://github.com/Arthursakaa/Edubot-GayaBelajar",
      featured: true,
      status: "Completed",
      year: "2025",
    },
    {
      id: "debouquets",
      title: "Debouquets E-Commerce",
      category: "Web Application / Commerce",
      badge: "COMMERCE",
      description:
        "End-to-end floral boutique e-commerce web platform featuring dynamic catalog filtering, customer cart & wishlist, order tracking, and administrative order fulfillment.",
      highlights: [
        "Comprehensive database schema with Cart, Order, Payment, Shipping, and Review entities",
        "Full administrative dashboard for catalog management and transaction verification",
        "Clean server-rendered architecture with Laravel Blade and responsive styling",
      ],
      stack: ["Laravel", "PHP", "Blade", "MySQL", "Tailwind CSS"],
      githubUrl: "https://github.com/Arthursakaa/Web_Debouquets",
      status: "Completed",
      year: "2026",
    },
    {
      id: "webcv-ppt",
      title: "Interactive CV Portfolio v1",
      category: "Frontend / Creative",
      badge: "PORTFOLIO",
      description:
        "Dynamic web portfolio presenting professional milestones, technical competencies, and project showcases with smooth micro-interactions.",
      highlights: [
        "Component-driven React architecture built with Vite bundler",
        "Responsive bento-grid layouts with scroll-triggered animations",
      ],
      stack: ["React", "JavaScript", "Vite", "CSS3"],
      githubUrl: "https://github.com/Arthursakaa/WebCV_PPT",
      status: "Completed",
      year: "2026",
    },
  ] as Project[],

  skills: [
    {
      name: "Frontend Craft",
      slot: "SLOT 01 // INTERFACE",
      items: [
        { name: "React & Next.js", tag: "Primary", iconKey: "react" },
        { name: "TypeScript / JavaScript", tag: "Core", iconKey: "ts" },
        { name: "Tailwind CSS v4", tag: "Styling", iconKey: "tailwind" },
        { name: "HTML5 / Modern CSS", tag: "Base", iconKey: "html" },
        { name: "Vite Bundler", tag: "Build", iconKey: "vite" },
      ],
    },
    {
      name: "Backend & Systems",
      slot: "SLOT 02 // LOGIC & DATA",
      items: [
        { name: "Laravel (PHP)", tag: "Framework", iconKey: "laravel" },
        { name: "Go (Golang)", tag: "Systems", iconKey: "go" },
        { name: "Node.js & Express", tag: "Runtime", iconKey: "node" },
        { name: "MySQL & PostgreSQL", tag: "Database", iconKey: "database" },
        { name: "REST APIs & WebSockets", tag: "Protocol", iconKey: "api" },
      ],
    },
    {
      name: "AI & Intelligence",
      slot: "SLOT 03 // COGNITION",
      items: [
        { name: "Python", tag: "Primary", iconKey: "python" },
        { name: "scikit-learn", tag: "ML", iconKey: "scikit" },
        { name: "TensorFlow", tag: "DL", iconKey: "tf" },
        { name: "Data Analysis", tag: "Method", iconKey: "data" },
      ],
    },
    {
      name: "Tools & Workflow",
      slot: "SLOT 04 // ARSENAL",
      items: [
        { name: "Git & GitHub", tag: "VCS", iconKey: "git" },
        { name: "Docker", tag: "DevOps", iconKey: "docker" },
        { name: "Linux / Terminal", tag: "Environment", iconKey: "terminal" },
        { name: "Vercel / Cloud", tag: "Deploy", iconKey: "cloud" },
      ],
    },
  ] as SkillCategory[],

  timeline: [
    {
      period: "2024 - Present",
      role: "Undergraduate in Computer Science",
      organization: "Bina Nusantara (BINUS) University",
      description:
        "Focusing on Software Engineering, Data Structures & Algorithms, Distributed Systems, Object-Oriented Analysis, and Machine Learning.",
      type: "Education",
    },
    {
      period: "2025 - 2026",
      role: "Full-Stack Project Developer",
      organization: "Independent & Academic Labs",
      description:
        "Architected FitnessVals (Laravel 12 + Go + WebSockets) and built EduBot ML diagnostic system for personalized learning evaluation.",
      type: "Experience",
    },
    {
      period: "Current Quest",
      role: "Open for Full-Stack Developer Internship",
      organization: "Target: Summer / Fall 2026",
      description:
        "Seeking opportunities to contribute to high-impact teams in full-stack web applications, backend services, and modern UI architectures.",
      type: "Milestone",
    },
  ] as TimelineItem[],
};
