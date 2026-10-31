import { brandIcons } from "@/lib/brand-icons"

// Tech logos circling an "AI" core. Pure CSS animation, no JavaScript.
export default function SkillOrbit({ icons }: { icons: string[] }) {
  const inner = icons.slice(0, 4)
  const outer = icons.slice(4)
  const ring = (list: string[], radius: number, cls: string) => (
    <div className={`absolute inset-0 ${cls}`}>
      {list.map((k, i) => {
        const b = brandIcons[k]
        if (!b) return null
        const a = (i / list.length) * Math.PI * 2
        return (
          <span
            key={k}
            className="absolute grid h-11 w-11 place-items-center rounded-xl border border-line bg-panel/90 shadow-[0_0_18px_-6px_rgba(124,92,255,0.6)]"
            style={{ left: `calc(50% + ${Math.cos(a) * radius}px - 22px)`, top: `calc(50% + ${Math.sin(a) * radius}px - 22px)` }}
            title={b.title}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" className="orbit-counter" aria-hidden><path d={b.path} fill={b.color} /></svg>
          </span>
        )
      })}
    </div>
  )
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px]" aria-hidden>
      <div className="absolute inset-[18%] rounded-full border border-dashed border-violet/20" />
      <div className="absolute inset-[2%] rounded-full border border-line" />
      {ring(inner, 92, "orbit-cw")}
      {ring(outer, 150, "orbit-ccw")}
      <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-violet/50 bg-[#120b2e] font-display text-xl font-extrabold text-white shadow-glow">
        AI
        <span className="absolute inset-0 animate-ping rounded-2xl border border-violet/30" style={{ animationDuration: "2.6s" }} />
      </div>
    </div>
  )
}
