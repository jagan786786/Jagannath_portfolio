"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Editor, useTyping } from "@/components/night-scene"

/*
  Brings the hero photo to life. Every overlay is placed in the photo's own
  pixel space (1024 x 572), then that whole layer is scaled and shifted exactly
  like the photo, so the live code always sits on the monitor, the glow on the
  keyboard, and so on, at any screen size.
*/

const IW = 1024
const IH = 572

// Monitor screen corners in the photo: top-left, top-right, bottom-right, bottom-left.
const SCREEN: [number, number][] = [[668, 215], [834, 221], [830, 352], [665, 334]]

const IDEAS = [
  "what if we rerank first?",
  "cache the embeddings…",
  "add an eval for this case",
  "hmm, edge case when k=0",
  "smaller prompt, same answer?",
]

// Projective transform that maps a w×h box onto any 4-point quad (CSS matrix3d).
function quadMatrix(w: number, h: number, q: [number, number][]) {
  const src = [[0, 0], [w, 0], [w, h], [0, h]]
  const A: number[][] = []
  const b: number[] = []
  for (let i = 0; i < 4; i++) {
    const [x, y] = src[i]
    const [u, v] = q[i]
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u)
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v)
  }
  // Gaussian elimination
  for (let c = 0; c < 8; c++) {
    let p = c
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r
    const rowTmp = A[c]; A[c] = A[p]; A[p] = rowTmp
    const bTmp = b[c]; b[c] = b[p]; b[p] = bTmp
    for (let r = 0; r < 8; r++) {
      if (r === c) continue
      const f = A[r][c] / A[c][c]
      for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k]
      b[r] -= f * b[c]
    }
  }
  const m = b.map((v, i) => v / A[i][i])
  return `matrix3d(${m[0]},${m[3]},0,${m[6]},${m[1]},${m[4]},0,${m[7]},0,0,1,0,${m[2]},${m[5]},0,1)`
}

// Deterministic sparkle positions over the city in the window.
function rng(seed: number) {
  return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
}

export default function HeroPhoto({
  src,
  srcSet,
  alt,
  className = "",
  posX = 0.9,
  posY = 0.4,
  sizes,
  priority = false,
}: {
  src: string
  srcSet?: string
  alt: string
  className?: string
  posX?: number
  posY?: number
  sizes?: string
  priority?: boolean
}) {
  const box = useRef<HTMLDivElement>(null)
  const visible = useRef(true)
  const [geo, setGeo] = useState<{ s: number; x: number; y: number } | null>(null)
  const typing = useTyping(visible)
  const [idea, setIdea] = useState(0)

  // Fit the photo like object-fit: cover, and keep the overlay layer in step.
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => {
      const cw = el.clientWidth, ch = el.clientHeight
      if (!cw || !ch) return
      const s = Math.max(cw / IW, ch / IH)
      setGeo({ s, x: (cw - IW * s) * posX, y: (ch - IH * s) * posY })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [posX, posY])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting })
    if (box.current) io.observe(box.current)
    return () => io.disconnect()
  }, [])

  // New idea each time he stops to think.
  const wasThinking = useRef(false)
  useEffect(() => {
    if (typing.thinking && !wasThinking.current) setIdea((i) => (i + 1) % IDEAS.length)
    wasThinking.current = typing.thinking
  }, [typing.thinking])

  const screenM = useMemo(() => quadMatrix(300, 198, SCREEN), [])
  const sparkles = useMemo(() => {
    const r = rng(11)
    return Array.from({ length: 26 }, () => ({ x: 650 + r() * 370, y: 150 + r() * 160, d: r() * 4, s: 0.8 + r() * 1.4 }))
  }, [])

  const coding = !typing.thinking && typing.phase === "typing"

  return (
    <div ref={box} className={`overflow-hidden ${className}`}>
      {/* the photo itself */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        fetchPriority={priority ? "high" : undefined}
        className="absolute max-w-none select-none"
        style={geo ? { left: geo.x, top: geo.y, width: IW * geo.s, height: IH * geo.s } : { inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${posX * 100}% ${posY * 100}%` }}
      />

      {/* overlay layer in photo pixel space */}
      {geo && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0"
          style={{ width: IW, height: IH, transformOrigin: "0 0", transform: `translate(${geo.x}px, ${geo.y}px) scale(${geo.s})` }}
        >
          {/* city lights twinkling through the window */}
          {sparkles.map((p, i) => (
            <span
              key={i}
              className="twinkle absolute rounded-full"
              style={{ left: p.x, top: p.y, width: p.s, height: p.s, background: i % 3 ? "#ffd9a0" : "#d4c8ff", boxShadow: `0 0 ${p.s * 3}px ${i % 3 ? "#ffcf8a" : "#b9a9ff"}`, animationDelay: `${p.d}s`, animationDuration: `${2.5 + p.d}s` }}
            />
          ))}

          {/* screen light on his face: flickers while he types, steadies while he thinks */}
          <div
            className={`absolute rounded-full mix-blend-screen transition-opacity duration-700 ${coding ? "face-flicker" : ""}`}
            style={{ left: 545, top: 175, width: 110, height: 120, background: "radial-gradient(closest-side, rgba(150,130,255,0.35), rgba(150,130,255,0))", opacity: coding ? 1 : 0.55 }}
          />

          {/* live code on the monitor, projected onto the screen at its real angle */}
          <div className="absolute left-0 top-0" style={{ width: 300, height: 198, transformOrigin: "0 0", transform: screenM }}>
            <svg viewBox="0 0 300 198" width="300" height="198" className="block" style={{ opacity: 0.94 }}>
              <Editor {...typing} />
            </svg>
            {/* screen glare so it reads as glass */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 40%)" }} />
          </div>
          {/* the monitor's glow spilling onto the desk */}
          <div className={`absolute rounded-full mix-blend-screen ${coding ? "face-flicker" : ""}`} style={{ left: 650, top: 340, width: 200, height: 40, background: "radial-gradient(closest-side, rgba(140,120,255,0.35), rgba(140,120,255,0))" }} />

          {/* laptop: live dot riding the end of the chart */}
          <span className="pulse-dot absolute h-[4px] w-[4px] rounded-full bg-mint" style={{ left: 648, top: 299 }} />
          <div className="laptop-scan absolute" style={{ left: 575, top: 292, width: 82, height: 54 }} />

          {/* keyboard RGB glow: quick pulses while typing */}
          <div
            className={`absolute rounded-full mix-blend-screen ${coding ? "kbd-type" : "kbd-idle"}`}
            style={{ left: 600, top: 410, width: 160, height: 46, background: "radial-gradient(closest-side, rgba(150,110,255,0.75), rgba(150,110,255,0))" }}
          />

          {/* thinking: a glass bubble with the idea he is weighing */}
          <div className={`absolute transition-all duration-500 ${typing.thinking ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`} style={{ left: 612, top: 84 }}>
            <div className="whitespace-nowrap rounded-[14px] border border-[#cfc6ff]/50 bg-[#120d30]/75 px-3 py-1.5 shadow-[0_0_18px_rgba(124,92,255,0.6)] backdrop-blur-[2px]">
              <span className="font-hand text-[15px] leading-none text-[#efeaff]">{IDEAS[idea]}</span>
              <span className="ml-1.5 inline-flex gap-[3px] align-middle">
                {[0, 1, 2].map((d) => <span key={d} className="think-dot inline-block h-[3px] w-[3px] rounded-full bg-[#efeaff]" style={{ animationDelay: `${d * 0.18}s` }} />)}
              </span>
            </div>
            <span className="absolute -bottom-3 left-3 h-[7px] w-[7px] rounded-full border border-[#cfc6ff]/50 bg-[#120d30]/75" />
            <span className="absolute -bottom-6 left-1 h-[4px] w-[4px] rounded-full border border-[#cfc6ff]/50 bg-[#120d30]/75" />
          </div>
        </div>
      )}
    </div>
  )
}
