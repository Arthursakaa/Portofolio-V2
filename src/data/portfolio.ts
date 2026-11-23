export interface ProjectImage {
  src: string;
  label: string;
  bg?: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  highlights: string[];
  stack: string[];
  imageUrl?: string;
  images?: ProjectImage[];
  demoUrl?: string;
  videoUrl?: string;
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

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  category: string;
  credentialId?: string;
  summary?: string;
  /** Path gambar sertifikat di folder public/certificates/ (misal: "/certificates/nama-file.png") */
  imageUrl?: string;
  /** Path dokumen PDF sertifikat di folder public/certificates/ (misal: "/certificates/nama-file.pdf") */
  pdfUrl?: string;
  /** Tautan verifikasi kredensial eksternal (misal: Coursera, Dicoding, Credly, HackerRank) */
  verifyUrl?: string;
}

export const portfolioData = {
  profile: {
    fullName: "I Gede Arthur Saka Dewantara",
    displayName: "Arthur Saka",
    callsign: "ARTHUR // SAKA",
    title: "Computer Science Student @ BINUS University",
    role: "Software & Web Developer (Full-Stack • Frontend • Backend • AI)",
    guild: "BINUS University",
    major: "Computer Science",
    classType: "Software & Web Engineer",
    level: "LVL.21",
    status: "OPEN TO TECH INTERNSHIPS (SWE / WEB / AI — 2026)",
    location: "Malang, Indonesia",
    tagline:
      "Computer Science undergraduate crafting reliable web applications, backend systems, and practical AI tools. Open to Software Engineering, Full-Stack, Frontend, Backend, or AI internships.",
    about:
      "I am a Computer Science student at BINUS University based in Malang, Indonesia, focused on building reliable web applications, backend services, and practical AI systems. I divide my time between engineering backends with Laravel, Go, and Express.js, crafting responsive frontends in React and Next.js, and integrating applied machine learning with Python. I value clean code, thoughtful architecture, and software that solves real user pain points. Currently seeking 2026 internship opportunities in Software Engineering, Full-Stack, Frontend, Backend, or AI development.",
    traits: [
      { label: "FOCUS", val: "Web • Backend • AI" },
      { label: "GUILD", val: "BINUS University" },
      { label: "LOCATION", val: "Malang, ID" },
      { label: "STATUS", val: "Open to Internships" },
    ],
    socials: {
      github: "https://github.com/Arthursakaa",
      githubRepos: "https://github.com/Arthursakaa?tab=repositories",
      linkedin: "https://www.linkedin.com/in/arthur-saka-16d",
      email: "arthursakaa16@gmail.com",
    },
    resumeUrl: "/CV_I_Gede_Arthur_Saka_Dewantara.pdf",
    photo: "/profileporto.png",
  },

  resume: {
    fileName: "CV_I_Gede_Arthur_Saka_Dewantara.pdf",
    fileUrl: "/CV_I_Gede_Arthur_Saka_Dewantara.pdf",
    title: "Curriculum Vitae",
    subtitle: "Software Engineering & Web/AI Internships",
    lastUpdated: "2026",
    status: "Available for Download",
    format: "PDF (Print & Machine Readable)",
    note: "Simpan file PDF Anda di folder 'public/CV_I_Gede_Arthur_Saka_Dewantara.pdf' untuk memperbarui CV kapan saja tanpa perlu mengubah kode.",
  },

  projects: [
    {
      id: "fitnessvals",
      title: "FitnessVals Ecosystem",
      category: "Full-Stack / AI Health",
      badge: "FEATURED QUEST",
      description:
        "An end-to-end gym management and health tracking platform built with a dual-backend architecture—pairing Laravel 12 for web workflows and WebSocket broadcasting with a Go 1.25 (Gin, GORM) REST microservice.",
      highlights: [
        "Built dual-backend architecture pairing Laravel 12 (Blade, Tailwind CSS v4, Vite) and a Go 1.25 (Gin, GORM) service backed by a 23-migration MySQL schema",
        "Engineered 27 Go REST endpoints with JWT auth, a rule-based meal recommendation engine, and a Mifflin-St Jeor BMI/BMR/TDEE calculator",
        "Synced live gym class capacity across clients using SQL transaction booking guards and Laravel Reverb WebSockets (ClassBooked events)",
      ],
      stack: ["Laravel 12", "Go (Gin)", "GORM", "MySQL", "WebSockets", "Tailwind CSS v4", "Vite"],
      images: [
        {
          src: "/projects/fitnessvals-hero.jpg",
          label: "Landing Page",
          bg: "#18181b",
        },
        {
          src: "/projects/fitnessvals-member.jpg",
          label: "Member Dashboard",
          bg: "#f8fafc",
        },
        {
          src: "/projects/fitnessvals-admin.png",
          label: "Admin Console",
          bg: "#f8fafc",
        },
      ],
      videoUrl: "https://youtu.be/tH5LhTrzbOs?si=b_J93EbtoCH1-P8k",
      githubUrl: "https://github.com/Arthursakaa/Web_FitnessVals",
      featured: true,
      status: "Active",
      year: "2026",
    },
    {
      id: "edubot",
      title: "EduBot: Learning Analyzer",
      category: "Full-Stack / AI EdTech",
      badge: "AI ENGINE",
      description:
        "Decoupled 3-tier educational platform helping elementary students identify their VAK (Visual, Auditory, Kinesthetic) learning preferences via a 10-question quiz, backed by a teacher analytics portal and ML inference API.",
      highlights: [
        "Built a decoupled 3-tier web app (Vercel, Railway, TiDB Cloud MySQL) with a 10-question VAK quiz and 4-table relational schema",
        "Created 11 Express.js REST API endpoints for quiz results and Chart.js teacher analytics, secured with JWT, bcryptjs, Helmet, Zod validation, and rate limiting",
        "Integrated a Python Flask and scikit-learn DecisionTreeClassifier microservice with score normalization and rule-based fallback on timeout",
      ],
      stack: [
        "Express.js",
        "Node.js",
        "MySQL",
        "Python",
        "Flask",
        "scikit-learn",
        "Tailwind CSS",
        "Chart.js",
      ],
      imageUrl: "/projects/edubot-preview.jpg",
      demoUrl: "https://edubot-gayabelajar.vercel.app/",
      githubUrl: "https://github.com/Arthursakaa/Edubot-GayaBelajar",
      featured: true,
      status: "Completed",
      year: "2026",
    },
    {
      id: "debouquets",
      title: "DeBouquets E-Commerce",
      category: "Web Application / Commerce",
      badge: "COMMERCE",
      description:
        "Collaborative floral boutique e-commerce platform featuring role-based Customer, Admin, and Owner dashboards, dynamic catalog filtering, checkout logistics, and real-time order status updates.",
      highlights: [
        "Co-built on Laravel 12, Blade, Tailwind CSS, Vite, and MySQL across an 18-migration, 13-model relational schema",
        "Implemented Customer, Admin, and Owner portals with catalog filtering, wishlists, reviews, payment verification, and auto-restocked cancellations",
        "Added distance/quantity shipping and tax checkout logic plus real-time order broadcasting via Laravel Reverb WebSockets (OrderCreated, OrderUpdated)",
      ],
      stack: ["Laravel 12", "PHP", "Blade", "MySQL", "WebSockets", "Tailwind CSS", "Vite"],
      images: [
        {
          src: "/projects/debouquets-hero.jpg",
          label: "Storefront",
          bg: "#fffdf9",
        },
        {
          src: "/projects/debouquets-customer.png",
          label: "Customer Portal",
          bg: "#f3efe4",
        },
        {
          src: "/projects/debouquets-admin.png",
          label: "Admin Panel",
          bg: "#f3efe4",
        },
      ],
      videoUrl: "https://youtu.be/j-rX8YLNG2Y?si=GQi3cgTZg3OMODU1",
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
        { name: "HTML5 / CSS3 & Blade", tag: "Markup", iconKey: "html" },
        { name: "Vite & Chart.js", tag: "Web UI", iconKey: "vite" },
      ],
    },
    {
      name: "Backend & Systems",
      slot: "SLOT 02 // LOGIC & DATA",
      items: [
        { name: "Laravel (PHP) & Eloquent", tag: "Framework", iconKey: "laravel" },
        { name: "Go (Gin / GORM) & C", tag: "Systems", iconKey: "go" },
        { name: "Node.js & Express.js", tag: "Runtime", iconKey: "node" },
        { name: "MySQL, PostgreSQL & SQLite", tag: "Database", iconKey: "database" },
        { name: "REST APIs, WebSockets & JWT", tag: "Protocol", iconKey: "api" },
      ],
    },
    {
      name: "AI & Intelligence",
      slot: "SLOT 03 // COGNITION",
      items: [
        { name: "Python", tag: "Primary", iconKey: "python" },
        { name: "scikit-learn", tag: "ML", iconKey: "scikit" },
        { name: "Pandas & NumPy", tag: "Data", iconKey: "data" },
        { name: "Flask (ML Inference)", tag: "API", iconKey: "flask" },
      ],
    },
    {
      name: "Tools & Workflow",
      slot: "SLOT 04 // ARSENAL",
      items: [
        { name: "Git & GitHub", tag: "VCS", iconKey: "git" },
        { name: "Postman & Zod", tag: "API / Val", iconKey: "postman" },
        { name: "Figma", tag: "UI/UX", iconKey: "figma" },
        { name: "Vercel & Railway", tag: "Deploy", iconKey: "cloud" },
        { name: "Antigravity", tag: "AI IDE", iconKey: "antigravity" },
      ],
    },
  ] as SkillCategory[],

  timeline: [
    {
      period: "2021 - 2024",
      role: "High School Diploma — Science & Mathematics (MIPA)",
      organization: "SMAK Kesuma Mataram",
      description:
        "Majored in Science & Mathematics (MIPA). Developed an early passion for software development through Informatics coursework—learning computing fundamentals, building foundational HTML websites, and experimenting with introductory IoT systems.",
      type: "Education",
    },
    {
      period: "2024 - Present",
      role: "Undergraduate in Computer Science",
      organization: "Bina Nusantara (BINUS) University @Malang",
      description:
        "Pursuing B.Comp.Sc. (GPA: 3.34/4.00) with coursework focused on Software Engineering, Data Structures & Algorithms, Object-Oriented Analysis, and Database Systems. Actively translating classroom theory into full-stack web projects.",
      type: "Education",
    },
    {
      period: "2025 - 2026",
      role: "Full-Stack Project Developer",
      organization: "Independent & Academic Projects",
      description:
        "Built FitnessVals (Laravel 12 + Go + WebSockets), EduBot (Express.js + Flask scikit-learn + TiDB Cloud MySQL), and DeBouquets E-Commerce (Laravel 12 + WebSockets).",
      type: "Experience",
    },
    {
      period: "Current Quest",
      role: "Seeking Software & Tech Internships",
      organization: "Target: 2026 • SWE, Full-Stack, Frontend, Backend & AI",
      description:
        "Actively seeking internship opportunities where I can contribute with React, Next.js, Laravel, Go, Node.js, MySQL, and Python across full-stack, frontend, backend, or AI engineering teams.",
      type: "Milestone",
    },
  ] as TimelineItem[],

  // Simpan file gambar (.png/.jpg/.webp) atau dokumen (.pdf) di folder public/certificates/
  // lalu arahkan imageUrl / pdfUrl / verifyUrl di bawah ini.
  certificates: [
    {
      id: "cert-uiux-specialskill",
      title: "UI/UX Design — Webinar Completion",
      issuer: "SpecialSkill Indonesia",
      issueDate: "Nov 2026",
      category: "UI/UX Design",
      credentialId: "0d495ada49fdd782",
      summary:
        "Awarded a Certificate of Completion for active participation in the UI/UX Design webinar hosted by SpecialSkill (PT Special Skill Indonesia), reinforcing user-centered interface design principles alongside full-stack web development.",
      imageUrl: "/certificates/uiux-specialskill.jpg",
      pdfUrl: "/certificates/uiux-specialskill.pdf",
      verifyUrl: "https://specialskill.id/certificate/?cert_hash=0d495ada49fdd782",
    },
    {
      id: "cert-beelingua-cefr-c12",
      title: "Professional Office (V2) — English CEFR C1.2",
      issuer: "BINUS University (Beelingua)",
      issueDate: "Jul 2026",
      category: "Language Proficiency",
      credentialId: "2026-C-xTRdRYUnzr5dO",
      summary:
        "Verified certificate from BINUS University's Beelingua digital language learning system for completing English C1.2-level coursework and passing Professional Office (V2) (CEFR C1.2), demonstrating advanced professional English proficiency.",
      imageUrl: "/certificates/beelingua-cefr-c12.jpg",
      pdfUrl: "/certificates/beelingua-cefr-c12.pdf",
    },
  ] as Certificate[],
};
