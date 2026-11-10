"use client"

import { useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react"
import { ArrowRight, ArrowUpRight, Brain, Building2, ChevronDown, Globe, LayoutGrid, Star, Wrench, Github, X } from "lucide-react"
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
        <div className="flex min-w-0 items-center gap-2.5">
          <Icon size={20} className="shrink-0 text-violet-soft" aria-hidden />
          <span className="truncate font-display text-lg font-bold text-white">{p.title}</span>
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

      <ul className="deal grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => <Card key={p.title} p={p} i={i} />)}
      </ul>
    </>
  )
}

function Card({ p, i }: { p: Project; i: number }) {
  const [open, setOpen] = useState(false)
  const el = useRef<HTMLLIElement>(null)

  // 3D tilt toward the cursor, with a sheen that follows it (mouse and pen only)
  const onMove = (e: RPointerEvent<HTMLLIElement>) => {
    if (e.pointerType === "touch" || open || !el.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const r = el.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.current.style.setProperty("--ry", `${(x - 0.5) * 10}deg`)
    el.current.style.setProperty("--rx", `${(0.5 - y) * 8}deg`)
    el.current.style.setProperty("--gx", `${x * 100}%`)
    el.current.style.setProperty("--gy", `${y * 100}%`)
    el.current.classList.add("tilting")
  }
  const onLeave = () => {
    if (!el.current) return
    el.current.classList.remove("tilting")
    el.current.style.setProperty("--rx", "0deg")
    el.current.style.setProperty("--ry", "0deg")
  }
  const href = p.demo || p.code
  const shownTags = p.tags.slice(0, 3)
  const moreTags = p.tags.length - shownTags.length
  return (
    <li
      ref={el}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="tilt-card card group relative flex h-full flex-col overflow-hidden hover:border-violet/40 hover:shadow-glow"
      style={{ ["--i" as string]: i }}
    >
      <span aria-hidden className="tilt-sheen" />
      <Preview p={p} />
      <div className="flex flex-1 flex-col p-6">
        {/* one row of tags on every card */}
        <ul className="flex flex-nowrap gap-2 overflow-hidden" aria-label="Tech stack">
          {shownTags.map((t) => <li key={t} className="chip shrink-0 whitespace-nowrap">{t}</li>)}
          {moreTags > 0 && <li className="chip shrink-0" title={p.tags.slice(3).join(", ")}>+{moreTags}</li>}
        </ul>
        <h3 className="mt-4 truncate font-display text-xl font-bold" title={p.title}>{p.title}</h3>
        <p className="mt-1 truncate text-xs text-violet-soft">{p.company ? `${p.role ? `${p.role} · ` : ""}Built at ${p.company}` : "Personal project"}</p>
        <p className="mt-2 line-clamp-3 min-h-[4.25rem] text-sm leading-relaxed text-muted">{p.summary}</p>

        <div className="mt-auto flex items-center justify-between pt-6">
          {p.highlights ? (
            <button type="button" onClick={() => { onLeave(); setOpen(true) }} aria-expanded={open} aria-controls={`hl-${p.title}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-soft hover:text-white">
              What I built <ChevronDown size={15} aria-hidden />
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

      {/* "What I built" opens over the card, so the card never changes size */}
      {p.highlights && open && (
        <div id={`hl-${p.title}`} role="region" aria-label={`What I built on ${p.title}`} className="pop-in absolute inset-0 z-10 flex flex-col bg-[#0b0919]/[0.97] p-6 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold">{p.title}</p>
              <p className="mt-0.5 truncate text-xs text-violet-soft">{p.role ? `${p.role} · ` : ""}Built at {p.company}</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted hover:border-violet/50 hover:text-white">
              <X size={15} />
            </button>
          </div>
          <ul className="mt-4 flex-1 space-y-2.5 overflow-y-auto overscroll-contain pr-1 text-sm leading-relaxed text-ink/90">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-2.5"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-soft" />{h}</li>
            ))}
          </ul>
          <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
            {p.tags.map((t) => <li key={t} className="chip !px-2.5 !py-0.5 text-[11px]">{t}</li>)}
          </ul>
        </div>
      )}
    </li>
  )
}
