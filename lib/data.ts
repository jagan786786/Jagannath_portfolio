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
  bio: "An AI engineer who turns large language models into working products: RAG pipelines, agentic tools, LLM gateways, and the FastAPI services around them.",
  quote: "Ship it, measure it, make it better.",
  currently: "Building LLM-powered tools at Bilvantis",
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
  body: "I'm Jagannath, a Programmer Analyst at Bilvantis Technologies and a Computer Science graduate from GIET University. I build production Python services and LLM-powered tools with Anthropic, Gemini, OpenAI and Databricks, and I care about the parts that make them trustworthy: grounding, evaluation, latency and cost.",
  facts: [
    { title: "B.Tech CSE", detail: "GIET University, CGPA 8.4" },
    { title: "Programmer Analyst", detail: "Bilvantis Technologies" },
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
    title: "RAG File Query Chatbot",
    category: "Company",
    company: "Bilvantis",
    role: "Internal tool",
    tags: ["Python", "FastAPI", "LangChain", "PostgreSQL", "RAG"],
    summary: "An internal knowledge assistant: employees upload documents and ask questions about them in plain language.",
    highlights: [
      "Built the ingestion pipeline with LangChain: parsing, chunking, embeddings, vector indexing and semantic retrieval on PostgreSQL",
      "Connected Anthropic Claude, Google Gemini and Databricks with runtime model selection, so workflows stay vendor-agnostic",
      "Retrieves relevant context before every answer, improving accuracy and reducing hallucinations",
      "Scaled to index large volumes of internal docs and specs, served through FastAPI REST APIs",
    ],
    featured: true,
  },
  {
    title: "Genie — AI VS Code Extension",
    category: "Company",
    company: "Bilvantis",
    role: "Client: HSBC",
    tags: ["TypeScript", "FastAPI", "LangChain", "React", "Copilot API"],
    summary: "A VS Code extension with 7 AI features: code generation, code review, unit tests, repo docs and codebase analysis.",
    highlights: [
      "Built a LangChain agentic pipeline that understands multi-file project structure for context-aware help",
      "Cut AI token costs by 80% through tighter context management and prompt orchestration",
      "Wrote the FastAPI backend and wired it to the TypeScript extension through the GitHub Copilot API",
    ],
    featured: true,
  },
  {
    title: "Code Converter",
    category: "Company",
    company: "Bilvantis",
    role: "AI repository migration",
    tags: ["Python", "LangChain", "Gemini", "FastAPI", "React"],
    summary: "Converts whole codebases from one language or framework to another while keeping the business logic intact.",
    highlights: [
      "Agentic LangChain pipeline maps architecture, dependency graphs, cross-file references and state management before converting",
      "Gemini API performs context-aware transformation that preserves application flow and design patterns",
      "5 migration capabilities: state management, React Context, props, routing and API layers",
      "FastAPI + PostgreSQL backend with a React / shadcn/ui interface for uploads, progress, diffs and validation",
    ],
  },
  {
    title: "AI-Guard",
    category: "Company",
    company: "Bilvantis",
    role: "LLM proxy & monitoring",
    tags: ["Node.js", "Koa.js", "Redis", "MongoDB", "AWS EC2"],
    summary: "A production LLM proxy with one gateway, token tracking and cost control for OpenAI, Gemini, Claude and Databricks.",
    highlights: [
      "Cut token consumption by 60% with Redis caching, rate limiting and usage-driven optimisation",
      "Role-based quotas and subscription plans with automated monitoring, removing 90% of manual tracking",
      "Runs on AWS EC2 with Brevo email alerts for quota exhaustion and account events",
    ],
  },
  {
    title: "University Portal",
    category: "Web Apps",
    tags: ["Next.js", "Spring Boot", "PostgreSQL"],
    summary: "One dashboard for students, faculty and admins: course registration, attendance and grades.",
    code: "https://github.com/jagan786786/unidashboard",
  },
]

export type Job = { role: string; company: string; period: string; points: string[] }

export const experience: Job[] = [
  {
    role: "Programmer Analyst — Python, AI & Full Stack",
    company: "Bilvantis Technologies",
    period: "Oct 2025 — Present",
    points: [
      "Built an internal RAG chatbot over company documents with LangChain, FastAPI and PostgreSQL, switchable across Claude, Gemini and Databricks.",
      "Shipped Genie, an AI VS Code extension for HSBC with 7 features, and cut its token costs by 80%.",
      "Built Code Converter, an agentic platform that migrates whole repositories between languages and frameworks.",
      "Launched AI-Guard, an LLM proxy across 4 providers that reduced token use by 60% with Redis caching and quotas.",
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
  { name: "LLM APIs", group: "AI", level: 88, glyph: "llm", top: true },
  { name: "RAG & Embeddings", group: "AI", level: 85, glyph: "rag", top: true },
  { name: "LangChain", group: "AI", level: 84, icon: "langchain", top: true },
  { name: "FastAPI", group: "Backend", level: 88, icon: "fastapi", top: true },
  { name: "PostgreSQL", group: "Databases", level: 82, icon: "postgresql", top: true },
  { name: "React", group: "Frontend", level: 80, icon: "react", top: true },
  { name: "Redis", group: "Databases", level: 75, icon: "redis", top: true },
  { name: "AI Agents", group: "AI", level: 80, glyph: "agent" },
  { name: "Prompt Engineering", group: "AI", level: 88, glyph: "prompt" },
  { name: "Vector Databases", group: "AI", level: 78, glyph: "vector" },
  { name: "LLM Evaluation", group: "AI", level: 72, glyph: "eval" },
  { name: "Anthropic Claude", group: "AI", level: 85, icon: "claude" },
  { name: "Gemini", group: "AI", level: 84, icon: "googlegemini" },
  { name: "Databricks", group: "AI", level: 70, icon: "databricks" },
  { name: "SQL", group: "Programming", level: 82, glyph: "vector" },
  { name: "TypeScript", group: "Programming", level: 76, icon: "typescript" },
  { name: "JavaScript", group: "Programming", level: 80, icon: "javascript" },
  { name: "Java", group: "Programming", level: 80, icon: "openjdk" },
  { name: "Node.js", group: "Backend", level: 80, icon: "nodedotjs" },
  { name: "Koa.js", group: "Backend", level: 72, icon: "koa" },
  { name: "Express", group: "Backend", level: 76, icon: "express" },
  { name: "NestJS", group: "Backend", level: 66, icon: "nestjs" },
  { name: "Next.js", group: "Frontend", level: 76, icon: "nextdotjs" },
  { name: "Tailwind CSS", group: "Frontend", level: 82, icon: "tailwindcss" },
  { name: "MongoDB", group: "Databases", level: 78, icon: "mongodb" },
  { name: "MySQL", group: "Databases", level: 80, icon: "mysql" },
  { name: "Git & GitHub", group: "Developer Tools", level: 88, icon: "github" },
  { name: "GitHub Copilot", group: "Developer Tools", level: 85, icon: "githubcopilot" },
  { name: "Postman", group: "Developer Tools", level: 82, icon: "postman" },
  { name: "Docker", group: "DevOps", level: 66, icon: "docker" },
  { name: "CircleCI", group: "DevOps", level: 72, icon: "circleci" },
  { name: "Netlify", group: "DevOps", level: 78, icon: "netlify" },
]

// Icons orbiting the "AI core" beside the skills grid.
export const orbitIcons = ["python", "langchain", "claude", "googlegemini", "fastapi", "redis", "react", "postgresql"]

export const stats = [
  { value: "30+", label: "Technologies" },
  { value: "4", label: "Production AI projects" },
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
  "Claude MCP Integration and Claude Code in Action — Anthropic",
  "Joy of Computing using Python — NPTEL",
  "Java (Basic) — HackerRank, 4★",
  "SQL — HackerRank, 3★",
]
