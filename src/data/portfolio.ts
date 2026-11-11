export interface Project {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  highlights: string[];
  stack: string[];
  imageUrl?: string;
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
        "Full-stack educational platform helping elementary students identify their VAK (Visual, Auditory, Kinesthetic) learning preferences through an interactive quiz, backed by a teacher classroom portal and ML inference API.",
      highlights: [
        "Built a decoupled 3-tier architecture: Tailwind CSS & Chart.js client (Vercel), Express.js + MySQL (TiDB Cloud) API, and a Python Flask ML service",
        "Trained and deployed a scikit-learn classification pipeline serving real-time VAK predictions with visual proportion charts",
        "Engineered a JWT-authenticated Teacher Portal & classroom management dashboard secured with Zod validation, Helmet, and rate limiting",
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
