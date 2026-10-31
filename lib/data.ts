// ---------------------------------------------------------------------------
// All site content lives here. Edit this file to update the portfolio —
// no component changes needed.
//
// Lines marked  // VERIFY  are positioning copy written for the AI-engineer
// rewrite. Check them against what you actually did before publishing.
// ---------------------------------------------------------------------------

export const site = {
  name: "Jagannath Patro",
  role: "AI Engineer",
  url: "https://jagannathintro.netlify.app",
  location: "India",
  email: "jagannathpatro234@gmail.com",
  github: "https://github.com/jagan786786",
  linkedin: "https://www.linkedin.com/in/jagannath-patro-37a192250/",
  // Drop a PDF into /public and set this to "/resume.pdf" to show a résumé link.
  resume: "" as string,
  formspree: "https://formspree.io/f/mqabbkgr",
}

// The hero "prompt" and the answer that streams in, token by token.
export const hero = {
  prompt: "Who is Jagannath Patro?",
  // VERIFY
  answer:
    "Jagannath is an AI engineer who builds products on top of large language models: retrieval pipelines, agents that call real tools, and the APIs and interfaces that put them in front of people. He came to AI from full-stack work in Next.js, Spring Boot and Node, so he cares about everything around the model too: latency, evaluation, and code that holds up in production.",
}

export type Project = {
  title: string
  kind: "AI" | "Full stack"
  summary: string
  stack: string[]
  code?: string
  demo?: string
}

// Put AI projects first — they are what a recruiter for an AI role looks for.
// Template:
// {
//   title: "Docs Q&A assistant",
//   kind: "AI",
//   summary: "RAG over internal PDFs with citations; answers grounded in retrieved chunks, evaluated on 50 hand-written questions.",
//   stack: ["Python", "FastAPI", "OpenAI", "pgvector"],
//   code: "https://github.com/jagan786786/...",
//   demo: "https://...",
// },
export const projects: Project[] = [
  {
    title: "University portal & dashboard",
    kind: "Full stack",
    summary:
      "One portal for students, faculty and administrators: course registration, attendance tracking and grade management.",
    stack: ["Next.js", "TypeScript", "Spring Boot", "PostgreSQL"],
    code: "https://github.com/jagan786786/unidashboard",
  },
  {
    title: "Real-time chat",
    kind: "Full stack",
    summary:
      "Live messaging over WebSockets with a responsive UI and JWT + bcrypt authentication.",
    stack: ["Node.js", "Express", "MongoDB", "WebSockets", "JWT"],
    code: "https://github.com/jagan786786/chat_application",
  },
  {
    title: "E-commerce store",
    kind: "Full stack",
    summary:
      "Catalogue, cart and checkout for buying and selling products, with server-side validation and a MySQL backend.",
    stack: ["PHP", "MySQL", "JavaScript", "HTML", "CSS"],
    code: "https://github.com/jagan786786/Ecommerce-Website",
  },
]

export type Job = {
  role: string
  company: string
  period: string
  points: string[]
}

export const experience: Job[] = [
  {
    role: "AI Engineer", // VERIFY title
    company: "Bilvantis",
    period: "2025 – present", // VERIFY dates
    points: [
      // VERIFY — replace with the specific things you built and shipped.
      "Builds AI-powered developer tooling: LLM integrations, prompt and retrieval pipelines, and the services around them.",
    ],
  },
  {
    role: "Full Stack Developer Intern",
    company: "Bharat Intern",
    period: "Jun – Jul 2024",
    points: [
      "Built a tour and travel platform with personalised itineraries, destination pages and activity recommendations.",
      "Implemented the booking flow end to end.",
    ],
  },
  {
    role: "Cybersecurity Analyst Intern",
    company: "Rinex",
    period: "Jan – Mar 2024",
    points: [
      "Cut page load time by 20% through front-end and caching fixes.",
      "Put DDoS mitigation in place, reducing downtime by 30%.",
    ],
  },
]

export const skills: { group: string; items: string[] }[] = [
  {
    group: "AI & LLMs", // VERIFY — keep only what you have used
    items: [
      "LLM APIs (OpenAI, Anthropic, Gemini)",
      "Prompt engineering",
      "RAG & embeddings",
      "Vector databases",
      "Tool calling & agents",
      "LangChain",
      "Evaluation",
    ],
  },
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "SQL", "C"] },
  {
    group: "Backend",
    items: ["FastAPI", "Node.js", "Express", "NestJS", "Spring Boot", "REST", "WebSockets"],
  },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "React Native", "Flutter"] },
  { group: "Data", items: ["PostgreSQL", "MySQL", "MongoDB"] },
  { group: "Tooling", items: ["Git", "Docker", "Linux"] }, // VERIFY Docker/Linux
]

export const education = {
  degree: "B.Tech, Computer Science and Engineering",
  school: "GIET University, Gunupur",
  period: "2021 – 2025",
  detail: "CGPA 8.4 / 10",
}

export const certifications = [
  "Joy of Computing using Python — NPTEL",
  "Java (Basic) — HackerRank, 4★",
  "SQL — HackerRank, 3★",
  "Object-Oriented PHP and MVC",
]
