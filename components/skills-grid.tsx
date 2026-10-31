"use client"

import { useState } from "react"
import { BrainCircuit, DatabaseZap, MessageSquareCode, Workflow, Boxes, Gauge } from "lucide-react"
import type { Skill, SkillGroup } from "@/lib/data"
import { brandIcons } from "@/lib/brand-icons"

const groups: (SkillGroup | "All")[] = ["All", "Programming", "AI", "Backend", "Frontend", "Databases", "Developer Tools", "DevOps"]
const glyphs = { llm: BrainCircuit, rag: DatabaseZap, prompt: MessageSquareCode, agent: Workflow, vector: Boxes, eval: Gauge }

export function SkillIcon({ s, size = 26 }: { s: Pick<Skill, "icon" | "glyph" | "name">; size?: number }) {
  if (s.icon && brandIcons[s.icon]) {
    const b = brandIcons[s.icon]
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} role="img" aria-label={b.title} style={{ filter: `drop-shadow(0 0 8px ${b.color}55)` }}>
        <path d={b.path} fill={b.color} />
      </svg>
    )
  }
  const G = s.glyph ? glyphs[s.glyph] : BrainCircuit
  return <G size={size} className="text-violet-soft drop-shadow-[0_0_8px_rgba(124,92,255,0.6)]" aria-hidden />
}

export default function SkillsGrid({ skills }: { skills: Skill[] }) {
  const [g, setG] = useState<SkillGroup | "All">("All")
  const [all, setAll] = useState(false)
  const inGroup = g === "All" ? skills : skills.filter((s) => s.group === g)
  const list = g === "All" && !all ? inGroup.filter((s) => s.top) : inGroup

  return (
    <>
      <div role="tablist" aria-label="Filter skills by category" className="flex flex-wrap gap-2">
        {groups.map((x) => {
          const on = g === x
          return (
            <button
              key={x}
              role="tab"
              aria-selected={on}
              onClick={() => { setG(x); setAll(false) }}
              className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${on ? "border-violet/60 bg-[#120b2e] text-white shadow-glow" : "border-line bg-white/[0.02] text-muted hover:border-violet/30 hover:text-ink"}`}
            >
              {x}
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-sm text-muted">
        Showing {list.length} of {skills.length}
        {g === "All" && !all ? (
          <>
            {" "}— pick a category, or{" "}
            <button type="button" onClick={() => setAll(true)} className="text-violet-soft underline underline-offset-4 hover:text-white">
              show everything
            </button>
            .
          </>
        ) : null}
      </p>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        {list.map((s, i) => (
          <li
            key={s.name}
            className="pop-in group relative overflow-hidden rounded-2xl border border-line bg-panel/80 p-4 transition hover:-translate-y-0.5 hover:border-violet/50 hover:shadow-glow"
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-violet/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
            <SkillIcon s={s} />
            <div className="mt-4 flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold leading-tight">{s.name}</span>
              <span className="font-mono text-[11px] tabular-nums text-muted">{s.level}%</span>
            </div>
            <div
              className="mt-3 h-px w-full bg-white/[0.07]"
              role="meter"
              aria-label={`${s.name} proficiency`}
              aria-valuenow={s.level}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="h-px bg-gradient-to-r from-violet to-violet-soft transition-all duration-700" style={{ width: `${s.level}%` }} />
            </div>
            <p className="mt-2.5 text-xs text-muted">{s.group}</p>
          </li>
        ))}
      </ul>
    </>
  )
}
