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
  leetcode: "https://leetcode.com/u/jagannathpatro234/",
  // Drop a PDF into /public and set this to "/resume.pdf" to show the Download Résumé button.
  resume: "" as string,
  formspree: "https://formspree.io/f/mqabbkgr",
  openToWork: true,
}

export const hero = {
  // Full-background hero picture (e.g. Jagannath at his desk at night, made from his photo).
  // Put the file in /public and set this to "/hero.webp". Leave empty to use the animated illustration.
  image: "/hero.webp" as string,
  headline: ["I build AI that", "ships to production."],
  // VERIFY
  bio: "An AI engineer who turns large language models into working products: retrieval pipelines, tool-using agents, and the APIs and interfaces around them.",
  quote: "Ship it, measure it, make it better.",
  currently: "Building LLM-powered developer tools at Bilvantis", // VERIFY
}

// Status lines typed out in the hero's "// right now" card. Keep them about the kind of work you do.
export const statusLines = [
  "Reviewing a pull request with an LLM…",
  "Retrieving context from the codebase…",
  "Calling tool: run_static_analysis()",
  "Grounding the answer in sources ✓",
  "Shipping it to production 🚀",
]

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

export type Category = "Company" | "AI / ML" | "Web Apps" | "Tools"

export type Project = {
  title: string
  category: Category
  tags: string[]
  summary: string
  code?: string
  demo?: string
  featured?: boolean
  // Company work: set `company` and leave code/demo empty. The card shows
  // "Built at <company>" and expands to show `highlights`.
  company?: string
  role?: string
  highlights?: string[]
}

// Put company and AI projects first — they are what a recruiter for an AI role looks for.
// Company project template (no source link needed):
// {
//   title: "Project name",
//   category: "Company",
//   company: "Bilvantis",
//   role: "AI Engineer",
//   tags: ["LangChain", "Python", "VS Code API"],
//   summary: "One line on what it does and who uses it.",
//   highlights: ["What you built", "A measurable result", "An interesting technical decision"],
//   featured: true,
// },
// Personal project template:
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

export type SkillGroup = "Programming" | "AI" | "Backend" | "Frontend" | "Databases" | "Developer Tools" | "DevOps"

export type Skill = {
  name: string
  group: SkillGroup
  level: number // rough self-rating out of 100 — VERIFY all of these
  icon?: string // a key from lib/brand-icons.ts; concept skills use `glyph` instead
  glyph?: "rag" | "prompt" | "agent" | "vector" | "eval" | "llm"
  top?: boolean // shown in the default "All" view
}

export const skills: Skill[] = [
  { name: "Python", group: "Programming", level: 90, icon: "python", top: true },
  { name: "LLM APIs", group: "AI", level: 85, glyph: "llm", top: true },
  { name: "RAG & Embeddings", group: "AI", level: 82, glyph: "rag", top: true },
  { name: "LangChain", group: "AI", level: 78, icon: "langchain", top: true },
  { name: "FastAPI", group: "Backend", level: 85, icon: "fastapi", top: true },
  { name: "TypeScript", group: "Programming", level: 80, icon: "typescript", top: true },
  { name: "React", group: "Frontend", level: 82, icon: "react", top: true },
  { name: "Git", group: "Developer Tools", level: 90, icon: "git", top: true },
  { name: "Prompt Engineering", group: "AI", level: 88, glyph: "prompt" },
  { name: "Agents & Tool Calling", group: "AI", level: 76, glyph: "agent" },
  { name: "Vector Databases", group: "AI", level: 74, glyph: "vector" },
  { name: "LLM Evaluation", group: "AI", level: 70, glyph: "eval" },
  { name: "Gemini", group: "AI", level: 80, icon: "googlegemini" },
  { name: "Hugging Face", group: "AI", level: 65, icon: "huggingface" },
  { name: "Java", group: "Programming", level: 82, icon: "openjdk" },
  { name: "JavaScript", group: "Programming", level: 82, icon: "javascript" },
  { name: "C", group: "Programming", level: 70, icon: "c" },
  { name: "Node.js", group: "Backend", level: 80, icon: "nodedotjs" },
  { name: "Spring Boot", group: "Backend", level: 76, icon: "springboot" },
  { name: "Express", group: "Backend", level: 78, icon: "express" },
  { name: "NestJS", group: "Backend", level: 68, icon: "nestjs" },
  { name: "Next.js", group: "Frontend", level: 80, icon: "nextdotjs" },
  { name: "Tailwind CSS", group: "Frontend", level: 86, icon: "tailwindcss" },
  { name: "Flutter", group: "Frontend", level: 60, icon: "flutter" },
  { name: "PostgreSQL", group: "Databases", level: 78, icon: "postgresql" },
  { name: "MongoDB", group: "Databases", level: 76, icon: "mongodb" },
  { name: "MySQL", group: "Databases", level: 80, icon: "mysql" },
  { name: "GitHub", group: "Developer Tools", level: 88, icon: "github" },
  { name: "Postman", group: "Developer Tools", level: 80, icon: "postman" },
  { name: "Docker", group: "DevOps", level: 65, icon: "docker" },
  { name: "Linux", group: "DevOps", level: 70, icon: "linux" },
]

// Icons orbiting the "AI core" beside the skills grid.
export const orbitIcons = ["python", "langchain", "googlegemini", "huggingface", "fastapi", "react", "docker", "postgresql"]

export const stats = [
  { value: "30+", label: "Technologies" },
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
