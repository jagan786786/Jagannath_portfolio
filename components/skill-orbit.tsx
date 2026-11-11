"use client"

import { useEffect, useRef } from "react"
import { brandIcons } from "@/lib/brand-icons"

/*
  Tech logos orbiting an "AI" core on a tilted 3D plane. Logos and the core
  always turn to face the viewer, so logos pass behind the core and in front of
  it. The plane leans as the section scrolls through the screen.
*/
export default function SkillOrbit({ icons }: { icons: string[] }) {
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const apply = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      // -1 when the orbit enters at the bottom, 0 at the middle, +1 leaving at the top
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - window.innerHeight / 2) / (window.innerHeight / 2)))
      el.style.setProperty("--tilt", `${60 + p * 14}deg`)
      el.style.setProperty("--spin", `${p * -18}deg`)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf) }
  }, [])

  const inner = icons.slice(0, 4)
  const outer = icons.slice(4)
  const ring = (list: string[], radius: number, cls: string) => (
    <div className={`orbit-ring absolute inset-0 ${cls}`}>
      {list.map((k, i) => {
        const b = brandIcons[k]
        if (!b) return null
        const a = (i / list.length) * Math.PI * 2
        return (
          <span key={k} className="orbit-slot absolute" style={{ left: `calc(50% + ${Math.cos(a) * radius}px - 22px)`, top: `calc(50% + ${Math.sin(a) * radius}px - 22px)` }} title={b.title}>
            <span className="orbit-counter block">
              <span className="orbit-upright grid h-11 w-11 place-items-center rounded-xl border border-line bg-panel/95 shadow-[0_0_18px_-6px_rgba(124,92,255,0.6)]">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden><path d={b.path} fill={b.color} /></svg>
              </span>
            </span>
          </span>
        )
      })}
    </div>
  )

  return (
    <div ref={box} className="orbit-3d relative mx-auto aspect-[4/3] w-full max-w-[340px]" aria-hidden>
      <div className="orbit-plane absolute left-1/2 top-1/2 h-[320px] w-[320px]">
        <div className="absolute inset-[18%] rounded-full border border-dashed border-violet/25" />
        <div className="absolute inset-[2%] rounded-full border border-violet/15 shadow-[0_0_40px_-10px_rgba(124,92,255,0.5)_inset]" />
        {ring(inner, 92, "orbit-cw")}
        {ring(outer, 150, "orbit-ccw")}
        <div className="orbit-upright absolute left-1/2 top-1/2 -ml-10 -mt-10 grid h-20 w-20 place-items-center rounded-2xl border border-violet/50 bg-[#120b2e] font-display text-xl font-extrabold text-white shadow-glow">
          AI
          <span className="absolute inset-0 animate-ping rounded-2xl border border-violet/30" style={{ animationDuration: "2.6s" }} />
        </div>
      </div>
    </div>
  )
}
