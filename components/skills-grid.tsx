"use client"

import { useState } from "react"
import type { SkillGroup } from "@/lib/data"

type Skill = { name: string; group: SkillGroup; level: number }
const groups: (SkillGroup | "All")[] = ["All", "AI", "Programming", "Backend", "Frontend", "Databases", "Tools"]

export default function SkillsGrid({ skills }: { skills: Skill[] }) {
  const [g, setG] = useState<SkillGroup | "All">("All")
  const list = g === "All" ? skills : skills.filter((s) => s.group === g)

  return (
    <>
      <div role="tablist" aria-label="Filter skills" className="flex flex-wrap gap-2">
        {groups.map((x) => (
          <button
            key={x}
            role="tab"
            aria-selected={g === x}
            onClick={() => setG(x)}
            className={`rounded-lg px-3.5 py-1.5 text-sm transition ${g === x ? "bg-violet text-white shadow-glow" : "text-muted hover:bg-white/[0.04] hover:text-ink"}`}
          >
            {x}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">Showing {list.length} of {skills.length}</p>

      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {list.map((s) => (
          <li key={s.name} className="card p-4 transition hover:border-violet/40">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold">{s.name}</span>
              <span className="font-mono text-[11px] tabular-nums text-muted">{s.level}%</span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]" role="meter" aria-valuenow={s.level} aria-valuemin={0} aria-valuemax={100} aria-label={`${s.name} proficiency`}>
              <div className="h-full rounded-full bg-gradient-to-r from-violet-deep to-violet-soft" style={{ width: `${s.level}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted">{s.group}</p>
          </li>
        ))}
      </ul>
    </>
  )
}
