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
      "Computer Science undergraduate crafting robust full-stack systems and practical AI tools. Focused on high-throughput backends, clean frontend architecture, and interfaces people enjoy using.",
    about:
      "I am a Computer Science student at BINUS University based in Malang, Indonesia, and a Full-Stack Developer focused on building reliable web applications and practical AI systems. I divide my time between engineering high-throughput backend services with Laravel and Go, crafting component-driven frontends in React and Next.js, and training applied machine learning models. I value clean code, thoughtful system architecture, and software that solves real user pain points. Currently seeking Full-Stack Developer internship opportunities to contribute and ship features alongside high-impact engineering teams.",
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
        "A full-stack fitness management ecosystem built with a dual-backend architecture—combining Laravel for rich business domains with Go for real-time telemetry and high-throughput metrics.",
      highlights: [
        "Designed dual-service architecture: Laravel 12 handles user authentication and membership domains, while Go 1.25 processes high-frequency workout telemetry",
        "Implemented instant live event broadcasting and notification feeds powered by Laravel Reverb WebSockets",
        "Built an optimized dashboard interface using Tailwind CSS v4 and Vite, ensuring snappy navigation across mobile and desktop",
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
        "An educational diagnostic platform that classifies students' cognitive learning preferences (VAK model) through a custom supervised machine learning pipeline.",
      highlights: [
        "Trained and evaluated a multi-class classifier using scikit-learn on student behavioral survey datasets",
        "Designed an engaging diagnostic questionnaire with immediate visual breakdown of learning style tendencies",
        "Deployed a lightweight Python Flask inference API delivering sub-second model predictions directly to the web client",
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
        "Architected comprehensive relational database schema covering Cart, Order, Payment, Shipping, and Review entities",
        "Engineered full administrative dashboard for real-time inventory management and transaction verification",
        "Implemented clean server-rendered architecture with Laravel Blade and responsive Tailwind CSS styling",
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
        "Interactive web portfolio presenting professional milestones, technical competencies, and project showcases with smooth micro-interactions.",
      highlights: [
        "Built component-driven React architecture bundled with Vite for fast HMR and optimized load times",
        "Designed responsive bento-grid layouts with scroll-triggered animations and high-contrast typography",
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
      period: "2021 - 2023",
      role: "High School Diploma — Science & Mathematics (MIPA)",
      organization: "SMAK Kesuma Mataram",
      description:
        "Majored in Science & Mathematics (MIPA). Developed an early passion for software development through Informatics coursework—learning computing fundamentals, building foundational HTML websites, and experimenting with introductory IoT systems.",
      type: "Education",
    },
    {
      period: "2024 - Present",
      role: "Undergraduate in Computer Science",
      organization: "Bina Nusantara (BINUS) University",
      description:
        "Pursuing B.Comp.Sc. with coursework focused on Software Engineering, Data Structures & Algorithms, Object-Oriented Analysis, and Database Systems. Actively translating classroom theory into production-ready web projects.",
      type: "Education",
    },
    {
      period: "2025 - 2026",
      role: "Full-Stack Project Developer",
      organization: "Independent & Academic Labs",
      description:
        "Architected FitnessVals (Laravel 12 + Go + WebSockets) and engineered the EduBot ML diagnostic system for personalized learning evaluation.",
      type: "Experience",
    },
    {
      period: "Current Quest",
      role: "Open for Full-Stack Developer Internship",
      organization: "Target: Summer / Fall 2026",
      description:
        "Seeking opportunities to contribute to high-impact engineering teams in full-stack web applications, backend services, and modern UI architectures.",
      type: "Milestone",
    },
  ] as TimelineItem[],
};
