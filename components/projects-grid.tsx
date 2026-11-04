"use client"

import { useMemo, useState } from "react"
import { ArrowRight, ArrowUpRight, Brain, Building2, ChevronDown, Globe, LayoutGrid, Star, Wrench, Github } from "lucide-react"
import type { Category, Project } from "@/lib/data"

const icons: Record<Category | "All", typeof Brain> = { All: LayoutGrid, Company: Building2, "AI / ML": Brain, "Web Apps": Globe, Tools: Wrench }
const tabLabel: Record<string, string> = { All: "All Projects", Company: "Company Work" }
const hues: Record<Category, [string, string]> = {
  Company: ["#7c5cff", "#22d3ee"],
  "AI / ML": ["#5b3df5", "#0ea5e9"],
  "Web Apps": ["#4b2fd6", "#a855f7"],
  Tools: ["#3b2bb8", "#22c55e"],
}

function Preview({ p }: { p: Project }) {
  const [a, b] = hues[p.category]
  const Icon = icons[p.category]
  return (
    <div className="relative h-44 overflow-hidden border-b border-line" style={{ background: `radial-gradient(120% 120% at 0% 0%, ${a}55, transparent 60%), radial-gradient(100% 100% at 100% 100%, ${b}40, #0b0919 70%)` }}>
      <div className="grid-bg absolute inset-0 opacity-60" />
      {/* faux app window */}
      <div className="absolute left-5 right-5 top-5 rounded-lg border border-white/10 bg-night/70 p-3 backdrop-blur">
        <div className="mb-3 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" /><span className="h-2 w-2 rounded-full bg-[#febc2e]" /><span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2.5">
          <Icon size={20} className="text-violet-soft" aria-hidden />
          <span className="font-display text-lg font-bold text-white">{p.title}</span>
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-4/5 rounded bg-white/10" />
          <div className="h-1.5 w-3/5 rounded bg-white/10" />
          <div className="h-1.5 w-2/5 rounded" style={{ background: `${b}80` }} />
        </div>
      </div>
      {p.company && (
        <span className="absolute bottom-3 right-5 inline-flex items-center gap-1 rounded-full border border-white/15 bg-night/70 px-2.5 py-1 text-[11px] font-medium text-ink backdrop-blur">
          <Building2 size={11} aria-hidden /> {p.company}
        </span>
      )}
      {p.featured && (
        <span className="absolute bottom-3 left-5 inline-flex items-center gap-1 rounded-full bg-violet px-2.5 py-1 text-[11px] font-semibold text-white shadow-glow">
          <Star size={11} fill="currentColor" aria-hidden /> Featured
        </span>
      )}
    </div>
  )
}

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const tabs = useMemo(() => ["All", ...(["Company", "AI / ML", "Web Apps", "Tools"] as Category[]).filter((c) => projects.some((p) => p.category === c))] as const, [projects])
  const [tab, setTab] = useState<string>("All")
  const shown = tab === "All" ? projects : projects.filter((p) => p.category === tab)

  return (
    <>
      <div role="tablist" aria-label="Filter projects" className="mb-10 flex flex-wrap justify-center gap-2">
        {tabs.map((t) => {
          const Icon = icons[t as Category | "All"]
          const on = tab === t
          return (
            <button
              key={t}
              role="tab"
              aria-selected={on}
              onClick={() => setTab(t)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${on ? "border-violet/50 bg-violet/15 text-white shadow-glow" : "border-line bg-white/[0.02] text-muted hover:text-ink"}`}
            >
              <Icon size={15} aria-hidden /> {tabLabel[t] ?? t}
            </button>
          )
        })}
      </div>

      <ul className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => <Card key={p.title} p={p} />)}
      </ul>
    </>
  )
}

function Card({ p }: { p: Project }) {
  const [open, setOpen] = useState(false)
  const href = p.demo || p.code
  return (
    <li className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:border-violet/40 hover:shadow-glow">
      <Preview p={p} />
      <div className="flex flex-1 flex-col p-6">
        <ul className="flex flex-wrap gap-2">
          {p.tags.map((t) => <li key={t} className="chip">{t}</li>)}
        </ul>
        <h3 className="mt-4 font-display text-xl font-bold">{p.title}</h3>
        {p.company && <p className="mt-1 text-xs text-violet-soft">{p.role ? `${p.role} · ` : ""}Built at {p.company}</p>}
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>

        {p.highlights && open && (
          <ul id={`hl-${p.title}`} className="pop-in mt-4 space-y-2 border-t border-line pt-4 text-sm text-ink/90">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-2.5"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-soft" />{h}</li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex items-center justify-between">
          {p.highlights ? (
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={`hl-${p.title}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-soft hover:text-white">
              {open ? "Show less" : "What I built"} <ChevronDown size={15} className={`transition ${open ? "rotate-180" : ""}`} aria-hidden />
            </button>
          ) : href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-soft hover:text-white">
              {p.demo ? "View Project" : "View Code"} <ArrowRight size={15} aria-hidden />
            </a>
          ) : <span />}
          {p.code && (
            <a href={p.code} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} source code on GitHub`} className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition hover:border-violet/50 hover:text-white">
              {p.demo ? <Github size={16} /> : <ArrowUpRight size={16} />}
            </a>
          )}
        </div>
      </div>
    </li>
  )
}
