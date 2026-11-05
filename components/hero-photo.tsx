"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import CodeEditor from "@/components/code-editor"
import { useHumanTyping } from "@/lib/human-typing"
import { IH, IW, PhotoWarp, POINTS, type Fit } from "@/lib/photo-warp"
import { keyFor, keyPos } from "@/lib/keyboard"

/*
  Brings the hero photo to life. Every overlay is placed in the photo's own
  pixel space (1024 x 572), then that whole layer is scaled and shifted exactly
  like the photo, so the live code always sits on the monitor, the glow on the
  keyboard, and so on, at any screen size.
*/


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
  const [geo, setGeo] = useState<Fit | null>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const warp = useRef<PhotoWarp | null>(null)
  const [warpOn, setWarpOn] = useState(false)
  // per-frame motion values, written by the animator and read by the renderer
  const offs = useRef(new Float32Array(POINTS.length * 2))
  const headPose = useRef({ a: 0, x: 0, y: 0 })
  const fingerAt = useRef(new Float64Array(POINTS.length).fill(-1e9)) // last press time per finger
  const hands = useRef({ L: { x: 0, y: 0, tx: 0, ty: 0, last: 0 }, R: { x: 0, y: 0, tx: 0, ty: 0, last: 0 } })
  const glows = useRef<(HTMLSpanElement | null)[]>([])
  const glowNext = useRef(0)
  const thinkingRef = useRef(false)

  const typing = useHumanTyping(visible)
  // every keystroke: press the finger that types it (and Shift with the other
  // pinky), drift that hand toward the key, light the key up
  useEffect(() => {
    const k = typing.key
    if (!k || !warpOn) return
    const key = keyFor(k.ch)
    const now = performance.now()
    fingerAt.current[key.finger] = now
    if (key.shift) fingerAt.current[key.hand === "L" ? 8 : 0] = now
    const h = hands.current[key.hand]
    h.tx = key.hand === "L" ? (key.col - 2.5) * 0.45 : (key.col - 8.2) * 0.4
    h.ty = (key.row - 2) * 0.35
    h.last = now
    if (key.row < 4) {
      const g = glows.current[glowNext.current++ % glows.current.length]
      if (g) {
        const [x, y] = keyPos(key.row, key.col)
        g.style.left = `${x}px`; g.style.top = `${y}px`
        g.classList.add("hit")
        requestAnimationFrame(() => requestAnimationFrame(() => g.classList.remove("hit")))
      }
    }
  }, [typing.key, warpOn])
  useEffect(() => { thinkingRef.current = typing.thinking }, [typing.thinking])
  // which hand is down right now: each keystroke presses one hand for ~80 ms
  const [down, setDown] = useState<{ L: boolean; R: boolean; enter: boolean }>({ L: false, R: false, enter: false })
  useEffect(() => {
    const k = typing.key
    if (!k) return
    setDown((d) => ({ ...d, [k.hand]: true, enter: k.kind === "enter" ? true : d.enter }))
    const up = setTimeout(() => setDown((d) => ({ ...d, [k.hand]: false })), k.kind === "back" ? 60 : 85)
    const look = k.kind === "enter" ? setTimeout(() => setDown((d) => ({ ...d, enter: false })), 420) : undefined
    return () => { clearTimeout(up); if (look) clearTimeout(look) }
  }, [typing.key])
  const [idea, setIdea] = useState(0)

  // Fit the photo like object-fit: cover, and keep the overlay layer in step.
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const fit = () => {
      const cw = el.clientWidth, ch = el.clientHeight
      if (!cw || !ch) return
      const s = Math.max(cw / IW, ch / IH)
      setGeo({ s, x: (cw - IW * s) * posX, y: (ch - IH * s) * posY, w: cw, h: ch })
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

  // GPU renderer for the photo (falls back to the plain <img> without WebGL)
  useEffect(() => {
    if (!canvas.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const largest = (srcSet && srcSet.trim().match(/(\S+)\s+\d+w\s*$/)?.[1]) || src
    warp.current = PhotoWarp.create(canvas.current, largest, () => setWarpOn(true))
  }, [src, srcSet])
  useEffect(() => { if (geo && warp.current) warp.current.resize(geo) }, [geo, warpOn])
  useEffect(() => {
    if (!warpOn || !geo) return
    let raf = 0
    let prev = performance.now()
    const o = offs.current
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      // fingers: a quick 40 ms press, then a softer release
      for (let i = 0; i < POINTS.length; i++) {
        let v = 0
        if (i <= 10 && i !== 4 && i !== 9) {
          const e = (now - fingerAt.current[i]) / 1000
          v = e < 0 ? 0 : e < 0.04 ? e / 0.04 : Math.exp(-(e - 0.04) / 0.07)
        }
        o[i * 2] = v * 0.45
        o[i * 2 + 1] = v * 1.7
      }
      // hands drift to the keys in use, settle when idle, lift a little while thinking
      for (const [id, idx, fingers] of [["L", 4, [0, 1, 2, 3]], ["R", 9, [5, 6, 7, 8, 10]]] as const) {
        const h = hands.current[id]
        const idle = now - h.last > 1400
        const tx = idle ? 0 : h.tx
        const ty = thinkingRef.current ? -0.9 : idle ? -0.3 : h.ty
        const k = 1 - Math.exp(-dt * 7)
        h.x += (tx - h.x) * k
        h.y += (ty - h.y) * k
        o[idx * 2] = h.x
        o[idx * 2 + 1] = h.y
        for (const f of fingers) { o[f * 2] += h.x * 0.8; o[f * 2 + 1] += h.y * 0.8 }
      }
      if (visible.current) warp.current?.draw(geo, o, headPose.current)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [warpOn, geo])

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

  // "coding" = keys are actually going; short pauses between lines are not coding
  const coding = !typing.idle && (typing.phase === "edit" || typing.phase === "term")
  // largest candidate in srcSet (works for data: URLs too, which contain commas)
  const bgSrc = (srcSet && srcSet.trim().match(/(\S+)\s+\d+w\s*$/)?.[1]) || src

  // Pieces of the photo that move: cut out with a soft edge, animated in place.
  const piece = (x: number, y: number, w: number, h: number, cls: string, origin: string, extra: React.CSSProperties = {}) => (
    <div
      className={`absolute ${cls}`}
      style={{
        left: x, top: y, width: w, height: h,
        backgroundImage: `url(${bgSrc})`,
        backgroundSize: `${IW}px ${IH}px`,
        backgroundPosition: `${-x}px ${-y}px`,
        transformOrigin: origin,
        WebkitMaskImage: "radial-gradient(closest-side, #000 62%, transparent 100%)",
        maskImage: "radial-gradient(closest-side, #000 62%, transparent 100%)",
        ...extra,
      }}
    />
  )

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
      {/* the same photo drawn by the warp renderer, laid exactly over the <img> */}
      <canvas ref={canvas} aria-hidden className="absolute left-0 top-0 h-full w-full" style={{ opacity: warpOn ? 1 : 0 }} />

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

          {/* ---- he moves with the keys: each hand presses on its own keystrokes,
                the head dips to the new line on Enter, tilts back when thinking ---- */}
          {piece(452, 96, 168, 214, typing.thinking ? "pose-think" : down.enter ? "pose-glance" : "pose-rest", "70% 92%")}
          {!warpOn && piece(592, 376, 62, 46, `hand ${down.L ? "hand-down" : ""} ${typing.thinking ? "hand-lift" : ""}`, "50% 100%")}
          {!warpOn && piece(668, 392, 64, 52, `hand ${down.R ? "hand-down" : ""} ${typing.thinking ? "hand-lift" : ""}`, "50% 100%")}

          {/* screen light on his face: flickers while he types, steadies while he thinks */}
          <div
            className={`absolute rounded-full mix-blend-screen transition-opacity duration-700 ${coding ? "face-flicker" : ""}`}
            style={{ left: 545, top: 175, width: 110, height: 120, background: "radial-gradient(closest-side, rgba(150,130,255,0.35), rgba(150,130,255,0))", opacity: coding ? 1 : 0.55 }}
          />

          {/* live code on the monitor, projected onto the screen at its real angle */}
          <div className="absolute left-0 top-0" style={{ width: 300, height: 198, transformOrigin: "0 0", transform: screenM }}>
            <svg viewBox="0 0 300 198" width="300" height="198" className="block" style={{ opacity: 0.94 }}>
              <CodeEditor s={typing} />
            </svg>
            {/* screen glare so it reads as glass */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 40%)" }} />
          </div>
          {/* the monitor's glow spilling onto the desk */}
          <div className={`absolute rounded-full mix-blend-screen ${coding ? "face-flicker" : ""}`} style={{ left: 650, top: 340, width: 200, height: 40, background: "radial-gradient(closest-side, rgba(140,120,255,0.35), rgba(140,120,255,0))" }} />

          {/* laptop: live dot riding the end of the chart */}
          <span className="pulse-dot absolute h-[4px] w-[4px] rounded-full bg-mint" style={{ left: 648, top: 299 }} />
          <div className="laptop-scan absolute" style={{ left: 575, top: 292, width: 82, height: 54 }} />

          {/* keyboard RGB glow: soft base, and a flash under whichever half gets the key */}
          <div className="kbd-idle absolute rounded-full mix-blend-screen" style={{ left: 600, top: 410, width: 160, height: 46, background: "radial-gradient(closest-side, rgba(150,110,255,0.75), rgba(150,110,255,0))" }} />
          {!warpOn && <div className="absolute rounded-full mix-blend-screen transition-opacity duration-75" style={{ left: 596, top: 396, width: 80, height: 36, opacity: down.L ? 0.9 : 0, background: "radial-gradient(closest-side, rgba(180,150,255,0.85), rgba(180,150,255,0))" }} />}
          {!warpOn && <div className="absolute rounded-full mix-blend-screen transition-opacity duration-75" style={{ left: 668, top: 404, width: 84, height: 38, opacity: down.R ? 0.9 : 0, background: "radial-gradient(closest-side, rgba(180,150,255,0.85), rgba(180,150,255,0))" }} />}
          {/* the key under the finger lights up for a moment */}
          {Array.from({ length: 8 }, (_, i) => <span key={i} ref={(el) => { glows.current[i] = el }} className="key-glow" />)}

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
