// ---------------------------------------------------------------------------
// All site content lives here. Edit this file to update the portfolio —
// no component changes needed.
//
// Lines marked  // VERIFY  are AI-engineer positioning copy. Check them
// against what you actually did before publishing.
// ---------------------------------------------------------------------------

export const site = {
  name: "Jagannath Patro",
  short: "Jagannath",
  initials: "JP",
  role: "AI Engineer",
  url: "https://jagannathintro.netlify.app",
  location: "Hyderabad, India", // VERIFY
  timezone: "Asia/Kolkata",
  email: "jagannathpatro234@gmail.com",
  github: "https://github.com/jagan786786",
  linkedin: "https://www.linkedin.com/in/jagannath-patro-37a192250/",
  // Drop a PDF into /public and set this to "/resume.pdf" to show the Download Résumé button.
  resume: "" as string,
  formspree: "https://formspree.io/f/mqabbkgr",
  openToWork: true,
}

export const hero = {
  headline: ["I build AI that", "ships to production."],
  // VERIFY
  bio: "An AI engineer who turns large language models into working products: retrieval pipelines, tool-using agents, and the APIs and interfaces around them.",
  currently: "Building LLM-powered developer tools at Bilvantis", // VERIFY
}

export const about = {
  headline: ["Engineer first,", "AI by choice."],
  // VERIFY
  body: "I'm Jagannath, a Computer Science graduate from GIET University. I started out shipping full-stack apps in Next.js, Spring Boot and Node, and moved into AI because that's where the hardest product problems are now. I care about the unglamorous parts that make LLM features trustworthy: grounding, evaluation, latency and cost.",
  facts: [
    { title: "B.Tech CSE", detail: "GIET University, CGPA 8.4" },
    { title: "AI Engineer", detail: "Bilvantis" }, // VERIFY
    { title: "Based in India", detail: "Open to remote" }, // VERIFY
  ],
  quote: "Make the model useful, then make it reliable.",
  enjoys: [
    "Retrieval-augmented generation",
    "Agents and tool calling",
    "Evaluating LLM output",
    "Backend and API design",
    "Full-stack product work",
    "Debugging hard problems",
  ],
}

export type Category = "AI / ML" | "Web Apps" | "Tools"

export type Project = {
  title: string
  category: Category
  tags: string[]
  summary: string
  code?: string
  demo?: string
  featured?: boolean
}

// Put AI projects first — they are what a recruiter for an AI role looks for.
// Template:
// {
//   title: "Docs Q&A assistant",
//   category: "AI / ML",
//   tags: ["RAG", "FastAPI", "pgvector"],
//   summary: "Answers questions over internal PDFs with citations, evaluated on 50 hand-written questions.",
//   code: "https://github.com/jagan786786/...",
//   demo: "https://...",
//   featured: true,
// },
export const projects: Project[] = [
  {
    title: "University Portal",
    category: "Web Apps",
    tags: ["Next.js", "Spring Boot", "PostgreSQL"],
    summary: "One dashboard for students, faculty and admins: course registration, attendance and grades.",
    code: "https://github.com/jagan786786/unidashboard",
    featured: true,
  },
  {
    title: "Real-time Chat",
    category: "Web Apps",
    tags: ["Node.js", "WebSockets", "MongoDB"],
    summary: "Live messaging over WebSockets with JWT + bcrypt authentication and a responsive UI.",
    code: "https://github.com/jagan786786/chat_application",
  },
  {
    title: "E-commerce Store",
    category: "Web Apps",
    tags: ["PHP", "MySQL", "JavaScript"],
    summary: "Catalogue, cart and checkout for buying and selling products, backed by MySQL.",
    code: "https://github.com/jagan786786/Ecommerce-Website",
  },
]

export type Job = { role: string; company: string; period: string; points: string[] }

export const experience: Job[] = [
  {
    role: "AI Engineer", // VERIFY title
    company: "Bilvantis",
    period: "2025 — Present", // VERIFY dates
    points: [
      // VERIFY — replace with the specific things you built and shipped.
      "Building AI-powered developer tooling: LLM integrations, prompt and retrieval pipelines, and the services around them.",
    ],
  },
  {
    role: "Full Stack Developer Intern",
    company: "Bharat Intern",
    period: "Jun — Jul 2024",
    points: [
      "Built a tour and travel platform with personalised itineraries and activity recommendations.",
      "Implemented the booking flow end to end.",
    ],
  },
  {
    role: "Cybersecurity Analyst Intern",
    company: "Rinex",
    period: "Jan — Mar 2024",
    points: ["Cut page load time by 20%.", "Put DDoS mitigation in place, reducing downtime by 30%."],
  },
]

export type SkillGroup = "AI" | "Programming" | "Backend" | "Frontend" | "Databases" | "Tools"

// level is a rough self-rating out of 100. VERIFY all of these.
export const skills: { name: string; group: SkillGroup; level: number }[] = [
  { name: "Python", group: "Programming", level: 88 },
  { name: "LLM APIs", group: "AI", level: 85 },
  { name: "RAG & Embeddings", group: "AI", level: 80 },
  { name: "Prompt Engineering", group: "AI", level: 85 },
  { name: "LangChain", group: "AI", level: 75 },
  { name: "Agents & Tool Calling", group: "AI", level: 75 },
  { name: "Vector Databases", group: "AI", level: 72 },
  { name: "FastAPI", group: "Backend", level: 80 },
  { name: "TypeScript", group: "Programming", level: 80 },
  { name: "Java", group: "Programming", level: 82 },
  { name: "Spring Boot", group: "Backend", level: 78 },
  { name: "Node.js", group: "Backend", level: 80 },
  { name: "React", group: "Frontend", level: 82 },
  { name: "Next.js", group: "Frontend", level: 80 },
  { name: "Tailwind CSS", group: "Frontend", level: 85 },
  { name: "PostgreSQL", group: "Databases", level: 78 },
  { name: "MongoDB", group: "Databases", level: 75 },
  { name: "MySQL", group: "Databases", level: 80 },
  { name: "Git", group: "Tools", level: 88 },
  { name: "Docker", group: "Tools", level: 65 },
]

export const stats = [
  { value: "15+", label: "Technologies" },
  { value: "3", label: "Roles & internships" },
  { value: "8.4", label: "CGPA" },
  { value: "Always", label: "Shipping" },
]

export const education = {
  degree: "B.Tech, Computer Science and Engineering",
  school: "GIET University, Gunupur",
  period: "2021 — 2025",
  detail: "CGPA 8.4 / 10",
}

export const certifications = [
  "Joy of Computing using Python — NPTEL",
  "Java (Basic) — HackerRank, 4★",
  "SQL — HackerRank, 3★",
]
