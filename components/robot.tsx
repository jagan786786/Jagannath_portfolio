"use client"

import { useEffect, useRef, useState } from "react"

// J-Bot: the hero mascot. Hovers above the planet, waves once on load, follows
// the cursor with its eyes, and narrates the kind of work Jagannath does.
export default function Robot({ lines }: { lines: string[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [eye, setEye] = useState({ x: 0, y: 0 })
  const [blink, setBlink] = useState(false)
  const [lineIdx, setLineIdx] = useState(0)
  const [typed, setTyped] = useState("")

  // Eyes track the pointer.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = svgRef.current?.getBoundingClientRect()
      if (!r) return
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height * 0.3)
      const d = Math.hypot(dx, dy) || 1
      const k = Math.min(1, d / 400)
      setEye({ x: (dx / d) * 7 * k, y: (dy / d) * 5 * k })
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  // Blink every few seconds.
  useEffect(() => {
    let t: number
    const loop = () => {
      t = window.setTimeout(() => { setBlink(true); window.setTimeout(() => setBlink(false), 140); loop() }, 2800 + Math.random() * 2500)
    }
    loop()
    return () => window.clearTimeout(t)
  }, [])

  // Type each status line, hold, then move to the next.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const full = lines[lineIdx]
    if (reduce) { setTyped(full); const t = setTimeout(() => setLineIdx((i) => (i + 1) % lines.length), 3500); return () => clearTimeout(t) }
    let i = 0
    setTyped("")
    const id = setInterval(() => {
      i++
      setTyped(full.slice(0, i))
      if (i >= full.length) {
        clearInterval(id)
        setTimeout(() => setLineIdx((n) => (n + 1) % lines.length), 2200)
      }
    }, 38)
    return () => clearInterval(id)
  }, [lineIdx, lines])

  return (
    <div className="relative flex flex-col items-center">
      {/* speech bubble */}
      <div className="relative mb-4 min-h-[64px] w-72 rounded-2xl border border-violet/30 bg-night/80 px-4 py-3 shadow-glow backdrop-blur" aria-live="polite">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-soft/80">J-Bot · live</p>
        <p className="mt-1 font-mono text-sm text-ink">
          {typed}
          <span aria-hidden className="caret ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-violet-soft" />
        </p>
        <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b border-r border-violet/30 bg-night/90" />
      </div>

      <div className="floaty">
        <svg ref={svgRef} viewBox="0 0 240 300" className="h-[360px] w-[288px] xl:h-[400px] xl:w-[320px]" role="img" aria-label="J-Bot, a small robot mascot">
          <defs>
            <linearGradient id="rb-shell" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2b2366" />
              <stop offset="1" stopColor="#140f36" />
            </linearGradient>
            <linearGradient id="rb-edge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#a996ff" />
              <stop offset="1" stopColor="#4b2fd6" />
            </linearGradient>
            <radialGradient id="rb-eye">
              <stop offset="0" stopColor="#e0fbff" />
              <stop offset="0.5" stopColor="#67e8f9" />
              <stop offset="1" stopColor="#0891b2" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rb-thrust" cx="0.5" cy="0">
              <stop offset="0" stopColor="#a996ff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#7c5cff" stopOpacity="0" />
            </radialGradient>
            <filter id="rb-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* thruster glow */}
          <ellipse cx="120" cy="282" rx="34" ry="16" fill="url(#rb-thrust)" className="thrust" />

          {/* antenna */}
          <line x1="120" y1="38" x2="120" y2="16" stroke="#a996ff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="120" cy="12" r="7" fill="#7c5cff" filter="url(#rb-glow)" className="antenna" />

          {/* head */}
          <rect x="52" y="36" width="136" height="104" rx="34" fill="url(#rb-shell)" stroke="url(#rb-edge)" strokeWidth="2" />
          <rect x="44" y="72" width="12" height="34" rx="6" fill="#3a2f8a" />
          <rect x="184" y="72" width="12" height="34" rx="6" fill="#3a2f8a" />
          {/* visor */}
          <rect x="66" y="58" width="108" height="62" rx="24" fill="#05030d" stroke="#3b3180" strokeWidth="1.5" />
          <g transform={`translate(${eye.x} ${eye.y})`} style={{ transition: "transform 120ms ease-out" }}>
            <g filter="url(#rb-glow)">
              <ellipse cx="98" cy="89" rx="11" ry={blink ? 1.5 : 12} fill="url(#rb-eye)" />
              <ellipse cx="142" cy="89" rx="11" ry={blink ? 1.5 : 12} fill="url(#rb-eye)" />
            </g>
          </g>
          <path d="M108 108 Q120 114 132 108" stroke="#67e8f9" strokeOpacity="0.6" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* neck */}
          <rect x="106" y="138" width="28" height="12" rx="4" fill="#2a2260" />

          {/* body */}
          <rect x="66" y="148" width="108" height="104" rx="28" fill="url(#rb-shell)" stroke="url(#rb-edge)" strokeWidth="2" />
          {/* chest screen with a live signal */}
          <rect x="84" y="166" width="72" height="44" rx="10" fill="#05030d" stroke="#3b3180" />
          <polyline className="signal" points="90,190 100,190 106,178 114,202 122,184 128,194 134,190 150,190" fill="none" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="98" cy="230" r="4" fill="#7c5cff" className="led-a" />
          <circle cx="112" cy="230" r="4" fill="#67e8f9" className="led-b" />
          <circle cx="126" cy="230" r="4" fill="#34d399" className="led-c" />
          <rect x="136" y="226" width="20" height="8" rx="4" fill="#3a2f8a" />

          {/* left arm (resting) */}
          <g>
            <rect x="38" y="160" width="22" height="64" rx="11" fill="url(#rb-shell)" stroke="url(#rb-edge)" strokeWidth="1.5" />
            <circle cx="49" cy="230" r="10" fill="#3a2f8a" stroke="#a996ff" strokeWidth="1.5" />
          </g>
          {/* right arm (waves) */}
          <g className="wave" style={{ transformOrigin: "191px 162px" }}>
            <rect x="180" y="160" width="22" height="64" rx="11" fill="url(#rb-shell)" stroke="url(#rb-edge)" strokeWidth="1.5" />
            <circle cx="191" cy="230" r="10" fill="#3a2f8a" stroke="#a996ff" strokeWidth="1.5" />
          </g>

          {/* base */}
          <rect x="92" y="250" width="56" height="18" rx="9" fill="#2a2260" stroke="url(#rb-edge)" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  )
}
