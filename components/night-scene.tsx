"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import StatusTicker from "@/components/status-ticker"

/*
  Cinematic hero scene: Jagannath at his desk at night, seen from behind his
  right shoulder, back-lit by the monitor. City lights through the window,
  live code typing on screen, a laptop with eval scores, and a glowing
  Earth in the foreground. Everything is vector + SVG filters (blur, grain),
  so it stays sharp and light.

  Coordinate space: 1600 x 1000. The left ~35% sits under the hero text and is
  faded out by the page.
*/

type Snippet = { file: string; code: string; run: string; result: string }

const SNIPPETS: Snippet[] = [
  {
    file: "agent.py",
    code: `from agents import Agent, tool
from rag import retrieve

@tool
def search_docs(query: str):
    """Find passages that answer it."""
    return retrieve(query, k=6)

agent = Agent(model="gemini-flash",
              tools=[search_docs])

answer = agent.run("Why did the build fail?")
print(answer.cited())`,
    run: "$ python agent.py",
    result: "✓ grounded answer · 3 sources",
  },
  {
    file: "evals.py",
    code: `import pytest
from agent import agent

CASES = load("evals/questions.jsonl")

@pytest.mark.parametrize("case", CASES)
def test_answer_is_grounded(case):
    out = agent.run(case.question)
    assert out.sources, "no citations"
    assert judge(out, case.expected) > 0.8`,
    run: "$ pytest evals/ -q",
    result: "✓ 24 passed in 3.1s",
  },
]

const C = { kw: "#c4b5fd", str: "#86efac", fn: "#67e8f9", dec: "#f9a8d4", num: "#fcd34d", com: "#6b6890", txt: "#dcd8f0" }

type Seg = [string, string]
function highlight(line: string): Seg[] {
  const re = /("""[^"]*"""|"[^"]*"|'[^']*')|(#.*$)|(@[\w.]+)|\b(from|import|def|return|for|in|assert|print|await|async)\b|(\b\w+(?=\())|(\b\d+(?:\.\d+)?\b)/g
  const out: Seg[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) {
    if (m.index > last) out.push([line.slice(last, m.index), C.txt])
    out.push([m[0], m[1] ? C.str : m[2] ? C.com : m[3] ? C.dec : m[4] ? C.kw : m[5] ? C.fn : C.num])
    last = m.index + m[0].length
  }
  if (last < line.length) out.push([line.slice(last), C.txt])
  return out
}

// Small seeded RNG so the city and Earth lights are identical on server and client.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

function useTyping(visible: React.MutableRefObject<boolean>) {
  const [si, setSi] = useState(0)
  const [typed, setTyped] = useState(0)
  const [phase, setPhase] = useState<"typing" | "running" | "done">("typing")
  const [thinking, setThinking] = useState(false)
  const snip = SNIPPETS[si]
  const total = snip.code.length

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setTyped(total); setPhase("done"); return }
    if (phase === "typing") {
      // He stops to think at each blank line (between blocks of code), hand on chin.
      const pauses = new Set<number>()
      for (let i = 1; i < snip.code.length; i++) if (snip.code[i] === "\n" && snip.code[i - 1] === "\n") pauses.add(i)
      let t = 0
      let held = false
      let timer: ReturnType<typeof setTimeout> | undefined
      const id = setInterval(() => {
        if (!visible.current || held) return
        let next = snip.code[t] === " " ? t + 3 : t + 1 + (Math.random() > 0.8 ? 1 : 0)
        const stop = [...pauses].find((p) => p > t && p <= next)
        if (stop !== undefined) {
          next = stop
          pauses.delete(stop)
          held = true
          setThinking(true)
          timer = setTimeout(() => { held = false; setThinking(false) }, 2600)
        }
        if (next >= total) { clearInterval(id); setTyped(total); setPhase("running"); return }
        t = next
        setTyped(next)
      }, 34)
      return () => { clearInterval(id); if (timer) clearTimeout(timer); setThinking(false) }
    }
    if (phase === "running") { const t = setTimeout(() => setPhase("done"), 1400); return () => clearTimeout(t) }
    const t = setTimeout(() => { setSi((i) => (i + 1) % SNIPPETS.length); setTyped(0); setPhase("typing") }, 3200)
    return () => clearTimeout(t)
  }, [phase, snip, total, visible])

  return { snip, typed, phase, si, thinking }
}

/* Editor drawn in its own 300 x 198 space, placed on the monitor with a nested <svg>. */
function Editor({ snip, typed, phase, si, thinking }: ReturnType<typeof useTyping>) {
  const FS = 7.4, CW = FS * 0.6, LH = 11.6, X = 68, Y = 32
  const lines = useMemo(() => snip.code.split("\n"), [snip])
  let start = 0
  let cur = 0
  const shown = lines.map((l, i) => {
    if (typed >= start) cur = i
    const take = Math.max(0, Math.min(l.length, typed - start))
    start += l.length + 1
    return l.slice(0, take)
  })
  const offset = Math.max(0, cur - 10) * LH
  return (
    <>
      <rect width="300" height="198" fill="#0a0919" />
      <rect width="300" height="12" fill="#14112e" />
      <circle cx="8" cy="6" r="2" fill="#ff5f57" /><circle cx="15" cy="6" r="2" fill="#febc2e" /><circle cx="22" cy="6" r="2" fill="#28c840" />
      <rect x="38" y="1" width="52" height="11" fill="#0a0919" />
      <text x="44" y="9" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="#c4b5fd">{snip.file}</text>
      <rect y="12" width="46" height="186" fill="#0f0d24" />
      {["src/", "agent.py", "rag.py", "tools.py", "evals.py", "evals/", "README.md"].map((f, i) => (
        <text key={f} x={f.endsWith("/") ? 5 : 10} y={24 + i * 10} fontFamily="JetBrains Mono, monospace" fontSize="5.4" fill={f === snip.file ? "#e9e4ff" : "#625d8c"}>{f}</text>
      ))}
      <clipPath id="ed-clip"><rect x="46" y="14" width="254" height="156" /></clipPath>
      <g clipPath="url(#ed-clip)">
        <g transform={`translate(0 ${-offset})`} fontFamily="JetBrains Mono, monospace" fontSize={FS}>
          {shown.map((l, i) => i > cur ? null : (
            <g key={`${si}-${i}`}>
              <text x={X - 8} y={Y + i * LH} fill="#3f3a6b" textAnchor="end" fontSize="6">{i + 1}</text>
              <text x={X} y={Y + i * LH} xmlSpace="preserve">{highlight(l).map(([t, c], k) => <tspan key={k} fill={c}>{t}</tspan>)}</text>
            </g>
          ))}
          {phase === "typing" && <rect x={X + shown[cur].length * CW + 0.5} y={Y + cur * LH - FS + 1} width="1.2" height={FS + 1} fill="#e9e4ff" className={thinking ? "caret" : undefined} />}
        </g>
      </g>
      <rect x="46" y="172" width="254" height="26" fill="#07061a" />
      <line x1="46" y1="172" x2="300" y2="172" stroke="#1f1b45" strokeWidth="0.6" />
      <text x="52" y="182" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="#8f89c0">{phase === "typing" ? "$ _" : snip.run}</text>
      {phase !== "typing" && (
        <text x="52" y="193" fontFamily="JetBrains Mono, monospace" fontSize="6.4" fill={phase === "done" ? "#34d399" : "#fcd34d"}>{phase === "done" ? snip.result : "running…"}</text>
      )}
    </>
  )
}

export default function NightScene({ className = "", crop = false, showPerson = false, quote, author, status = [] }: { className?: string; crop?: boolean; showPerson?: boolean; quote?: string; author?: string; status?: string[] }) {
  const wrap = useRef<HTMLDivElement>(null)
  const visible = useRef(true)
  const typing = useTyping(visible)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  // City lights, reflections and Earth lights — generated once, deterministically.
  const city = useMemo(() => {
    const r = rng(7)
    const bokeh = Array.from({ length: 70 }, () => ({ x: 1000 + r() * 600, y: 430 + r() * 50, s: 2 + r() * 5, warm: r() > 0.35, d: r() * 4 }))
    const windows = Array.from({ length: 140 }, () => ({ x: 1004 + r() * 592, y: 300 + r() * 160, warm: r() > 0.4, d: r() * 5 }))
    const streaks = Array.from({ length: 40 }, () => ({ x: 1000 + r() * 600, y: 486 + r() * 30, h: 6 + r() * 22, warm: r() > 0.35 }))
    const towers = Array.from({ length: 26 }, (_, i) => ({ x: 990 + i * 24 + r() * 8, w: 16 + r() * 22, h: 50 + r() * 170 }))
    return { bokeh, windows, streaks, towers }
  }, [])

  const earth = useMemo(() => {
    const r = rng(42)
    const cx = 1560, cy = 1560, R = 820
    const pts: { x: number; y: number; s: number; warm: boolean }[] = []
    // clustered "cities"
    for (let c = 0; c < 40; c++) {
      const ang = Math.PI * (1.18 + r() * 0.34)
      const dist = R * (0.55 + r() * 0.43)
      const px = cx + Math.cos(ang) * dist, py = cy + Math.sin(ang) * dist
      const n = 4 + Math.floor(r() * 14)
      for (let k = 0; k < n; k++) {
        const x = px + (r() - 0.5) * 40, y = py + (r() - 0.5) * 22
        if (y < 1000 && Math.hypot(x - cx, y - cy) < R - 6) pts.push({ x, y, s: 0.6 + r() * 1.6, warm: r() > 0.25 })
      }
    }
    const nodes = pts.filter((_, i) => i % 11 === 0).slice(0, 10)
    const arcs = nodes.slice(1).map((n, i) => ({ a: nodes[i], b: n, d: i * 0.7 }))
    return { cx, cy, R, pts, arcs }
  }, [])

  const vb = crop ? "620 140 980 760" : "0 0 1600 1000"
  // Left arm: typing on the keyboard, or up at the chin while thinking.
  const armD = typing.thinking ? "M388 372 L 352 456 L 402 318" : "M388 372 L 358 456 L 318 404"
  const rimD = typing.thinking ? "M376 382 L 346 450" : "M376 382 L 352 450"

  return (
    <div ref={wrap} className={className}>
      <svg viewBox={vb} preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label="Illustration of Jagannath coding at his desk at night, city lights through the window and the glowing Earth below">
        <defs>
          <linearGradient id="ns-wall" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#05030d" />
            <stop offset="0.55" stopColor="#0d0926" />
            <stop offset="1" stopColor="#140d36" />
          </linearGradient>
          <linearGradient id="ns-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0c0830" />
            <stop offset="0.6" stopColor="#2a1f75" />
            <stop offset="0.8" stopColor="#4a35b0" />
            <stop offset="1" stopColor="#1a1250" />
          </linearGradient>
          <linearGradient id="ns-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c2180" />
            <stop offset="1" stopColor="#0b0826" />
          </linearGradient>
          <linearGradient id="ns-desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2068" />
            <stop offset="0.25" stopColor="#151036" />
            <stop offset="1" stopColor="#07051a" />
          </linearGradient>
          <linearGradient id="ns-jacket" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0" stopColor="#2b3870" />
            <stop offset="0.35" stopColor="#151c40" />
            <stop offset="1" stopColor="#080b1c" />
          </linearGradient>
          <linearGradient id="ns-sleeveL" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b9b0e6" />
            <stop offset="1" stopColor="#5d567f" />
          </linearGradient>
          <linearGradient id="ns-sleeveR" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4c4668" />
            <stop offset="1" stopColor="#24203a" />
          </linearGradient>
          <linearGradient id="ns-skin" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#a87358" />
            <stop offset="0.35" stopColor="#5e3a28" />
            <stop offset="1" stopColor="#2a1a12" />
          </linearGradient>
          <linearGradient id="ns-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#4d4866" />
            <stop offset="0.5" stopColor="#2a2640" />
            <stop offset="1" stopColor="#141221" />
          </linearGradient>
          <linearGradient id="ns-bezel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#24212f" />
            <stop offset="1" stopColor="#0b0a12" />
          </linearGradient>
          <linearGradient id="ns-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.07" />
            <stop offset="0.35" stopColor="#fff" stopOpacity="0.015" />
            <stop offset="0.36" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ns-key" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b3560" />
            <stop offset="1" stopColor="#1d1934" />
          </linearGradient>
          <linearGradient id="ns-kbd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#24203a" />
            <stop offset="1" stopColor="#100d1e" />
          </linearGradient>
          <linearGradient id="ns-rgb" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7c5cff" />
            <stop offset="0.5" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="ns-denim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4a5f9a" />
            <stop offset="1" stopColor="#141d3c" />
          </linearGradient>
          <linearGradient id="ns-pot" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c9c0f0" />
            <stop offset="1" stopColor="#3b3466" />
          </linearGradient>
          <radialGradient id="ns-mouse" cx="0.35" cy="0.25" r="0.9">
            <stop offset="0" stopColor="#4a4470" />
            <stop offset="0.6" stopColor="#1c1830" />
            <stop offset="1" stopColor="#0a0812" />
          </radialGradient>
          <radialGradient id="ns-screenGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#8f7bff" stopOpacity="0.85" />
            <stop offset="0.5" stopColor="#5b3df5" stopOpacity="0.35" />
            <stop offset="1" stopColor="#5b3df5" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ns-earth" cx="0.42" cy="0.08" r="0.75">
            <stop offset="0" stopColor="#2b2a8a" />
            <stop offset="0.25" stopColor="#141452" />
            <stop offset="0.7" stopColor="#070726" />
            <stop offset="1" stopColor="#030312" />
          </radialGradient>
          <radialGradient id="ns-vignette" cx="0.62" cy="0.5" r="0.75">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.7" />
          </radialGradient>
          <filter id="ns-blur2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" /></filter>
          <filter id="ns-blur5" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
          <filter id="ns-blur18" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18" /></filter>
          <filter id="ns-blur40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40" /></filter>
          <filter id="ns-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="ns-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <clipPath id="ns-window"><rect x="1000" y="-260" width="700" height="785" /></clipPath>
          <clipPath id="ns-earthClip"><rect x="0" y="0" width="1600" height="1000" /></clipPath>
        </defs>

        {/* ---------- room ---------- */}
        <rect width="1600" height="1000" fill="url(#ns-wall)" />
        <g transform={crop ? undefined : "translate(330 190) scale(0.8)"}>
        {/* soft violet bloom on the wall from the monitor */}
        <ellipse cx="880" cy="380" rx="420" ry="260" fill="#5b3df5" opacity="0.28" filter="url(#ns-blur40)" />

        {/* ---------- window + city ---------- */}
        <g clipPath="url(#ns-window)">
          <rect x="1000" y="-260" width="700" height="785" fill="url(#ns-sky)" />
          {/* stars */}
          {[[1040, 40], [1120, 90], [1210, 30], [1330, 70], [1420, 20], [1510, 110], [1580, 50], [1060, 160], [1280, 140], [1470, 180], [1100, -120], [1240, -200], [1380, -60], [1560, -150], [1650, -40], [1180, -40]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 ? 1 : 1.6} fill="#ece6ff" className="twinkle" style={{ animationDelay: `${i * 0.41}s` }} />
          ))}
          <circle cx="1180" cy="-120" r="90" fill="#cfc4ff" opacity="0.18" filter="url(#ns-blur18)" />
          <circle cx="1180" cy="-120" r="24" fill="#f1edff" opacity="0.85" />
          {/* far haze skyline */}
          <g filter="url(#ns-blur2)" opacity="0.8">
            {city.towers.map((t, i) => <rect key={i} x={t.x} y={475 - t.h * 0.7} width={t.w} height={t.h * 0.7} fill="#3a2d8c" />)}
            <rect x="1386" y="250" width="8" height="40" fill="#3a2d8c" />
            <rect x="1376" y="285" width="28" height="195" fill="#3a2d8c" />
          </g>
          {/* near skyline */}
          {city.towers.filter((_, i) => i % 2 === 0).map((t, i) => <rect key={i} x={t.x + 10} y={480 - t.h * 0.45} width={t.w + 8} height={t.h * 0.45} fill="#150f3e" />)}
          {city.windows.map((w, i) => (
            <rect key={i} x={w.x} y={w.y + 90} width="2.5" height="3" fill={w.warm ? "#ffd59a" : "#b9a9ff"} opacity="0.75" className="twinkle" style={{ animationDelay: `${w.d}s`, animationDuration: `${4 + w.d}s` }} />
          ))}
          {/* bokeh along the waterfront */}
          <g filter="url(#ns-blur5)">
            {city.bokeh.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.s} fill={b.warm ? "#ffcf8a" : "#9d8cff"} opacity="0.85" />)}
          </g>
          {city.bokeh.filter((_, i) => i % 2).map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={b.s * 0.35} fill="#fff4dd" />)}
          {/* water + reflections */}
          <rect x="1000" y="482" width="600" height="43" fill="url(#ns-water)" />
          <g filter="url(#ns-blur2)">
            {city.streaks.map((s, i) => <rect key={i} x={s.x} y={s.y} width="2.4" height={s.h} fill={s.warm ? "#ffcf8a" : "#9d8cff"} opacity="0.45" className="shimmer" style={{ animationDelay: `${i * 0.13}s` }} />)}
          </g>
          {/* handwriting on the glass */}
          <g fontFamily="Caveat, cursive" fill="#d6ccff" filter="url(#ns-glow)" opacity="0.85">
            <text x="1488" y="70" fontSize="34" transform="rotate(-4 1488 70)">Think</text>
            <text x="1488" y="112" fontSize="34" transform="rotate(-4 1488 112)">Build</text>
            <text x="1488" y="154" fontSize="34" transform="rotate(-4 1488 154)">Ship</text>
            <text x="1488" y="196" fontSize="34" transform="rotate(-4 1488 196)">Repeat</text>
            <path d="M1490 214 L1520 212" stroke="#d6ccff" strokeWidth="2.5" />
            <text x="1300" y="110" fontSize="30" transform="rotate(-12 1300 110)">Small steps,</text>
            <text x="1312" y="146" fontSize="30" transform="rotate(-12 1312 146)">big systems</text>
            <path d="M1306 176 Q1350 162 1400 150" stroke="#d6ccff" strokeWidth="2.5" fill="none" />
          </g>
        </g>
        {/* window frame + mullions */}
        <rect x="994" y="-260" width="12" height="785" fill="#090620" />
        <rect x="1290" y="-260" width="10" height="785" fill="#0b0824" />
        <rect x="1290" y="-260" width="2" height="785" fill="#6b5ae0" opacity="0.4" />
        <rect x="1470" y="-260" width="10" height="785" fill="#0b0824" />
        <rect x="1470" y="-260" width="2" height="785" fill="#6b5ae0" opacity="0.4" />

        {/* ---------- desk ---------- */}
        <ellipse cx="900" cy="540" rx="420" ry="46" fill="#7c5cff" opacity="0.4" filter="url(#ns-blur18)" />
        {/* top surface: back edge 524, front edge 604 */}
        <path d="M520 524 L1700 524 L1700 604 L520 604 Z" fill="url(#ns-desk)" />
        {/* soft monitor reflection in the glossy top */}
        <rect x="730" y="528" width="300" height="34" rx="10" fill="#8f7bff" opacity="0.28" filter="url(#ns-blur5)" />
        <path d="M520 524 L1700 524" stroke="#b7a8ff" strokeOpacity="0.35" strokeWidth="1.5" />
        {/* front edge with a lit bevel */}
        <path d="M520 604 L1700 604" stroke="#a996ff" strokeOpacity="0.55" strokeWidth="2" />
        <rect x="520" y="605" width="1180" height="16" fill="#0a0820" />
        <rect x="520" y="621" width="1180" height="6" fill="#000" opacity="0.6" />

        {/* plant in a ceramic pot, in the window corner (back-right of the desk) */}
        <ellipse cx="1540" cy="546" rx="36" ry="5" fill="#000" opacity="0.55" filter="url(#ns-blur5)" />
        <g>
          {[[-46, -150], [-18, -184], [12, -170], [40, -130], [-36, -96], [30, -84], [2, -120], [-8, -200]].map(([dx, dy], i) => (
            <g key={i} transform={`rotate(${dx * 0.8} ${1540 + dx / 2} ${514 + dy / 2})`}>
              <ellipse cx={1540 + dx / 2} cy={514 + dy / 2} rx="11" ry="48" fill={i % 2 ? "#1f4a4f" : "#163a40"} stroke="#6fd6c0" strokeOpacity="0.22" className="sway" style={{ animationDelay: `${i * 0.35}s` }} />
            </g>
          ))}
          <path d="M1514 510 L1566 510 L1560 544 Q1540 548 1520 544 Z" fill="url(#ns-pot)" />
          <ellipse cx="1540" cy="510" rx="26" ry="4" fill="#2a2450" />
        </g>

        {/* stack of books, right side of the desk, squared up with spines facing out */}
        <ellipse cx="1410" cy="578" rx="80" ry="6" fill="#000" opacity="0.65" filter="url(#ns-blur5)" />
        {[
          { y: 558, x: 1346, w: 130, c: "#232a63", t: "PYTHON" },
          { y: 541, x: 1350, w: 124, c: "#3f2a6e", t: "SYSTEMS" },
          { y: 524, x: 1347, w: 128, c: "#1d4756", t: "LLMs" },
          { y: 507, x: 1351, w: 122, c: "#4a3324", t: "AGENTS" },
          { y: 490, x: 1349, w: 126, c: "#2c2350", t: "EVALS" },
        ].map((b) => (
          <g key={b.t}>
            {/* cover seen from the front: spine face with title + page block at the side */}
            <rect x={b.x} y={b.y} width={b.w} height="16" rx="1.6" fill={b.c} />
            <rect x={b.x + b.w - 14} y={b.y + 1.5} width="12" height="13" rx="1" fill="#d9d2c4" />
            {[4, 7.5, 11].map((k) => <line key={k} x1={b.x + b.w - 13} x2={b.x + b.w - 3} y1={b.y + k} y2={b.y + k} stroke="#b0a896" strokeWidth="0.5" />)}
            <rect x={b.x} y={b.y} width={b.w} height="1.2" fill="#fff" opacity="0.18" />
            <rect x={b.x} y={b.y + 14.6} width={b.w} height="1.4" fill="#000" opacity="0.35" />
            <rect x={b.x + 6} y={b.y + 3} width="1.2" height="10" fill="#e8dcb0" opacity="0.6" />
            <text x={b.x + 14} y={b.y + 11.4} fontFamily="Sora Variable, sans-serif" fontWeight="700" fontSize="8.5" letterSpacing="1.2" fill="#efe9ff" opacity="0.88">{b.t}</text>
          </g>
        ))}
        {/* window light catching the top book */}
        <rect x="1349" y="490" width="126" height="1.4" fill="#c9d6ff" opacity="0.6" />

        {/* ---------- main monitor ---------- */}
        {/* ambient back-light on the wall */}
        <rect x="680" y="226" width="400" height="290" rx="30" fill="#7c5cff" opacity="0.6" filter="url(#ns-blur40)" />
        {/* stand: brushed-metal neck and a thin base, reflected on the desk */}
        <path d="M866 470 L898 470 L902 520 L862 520 Z" fill="url(#ns-metal)" />
        <path d="M866 470 L870 520" stroke="#8a84aa" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M806 520 Q881 512 956 520 L960 526 Q881 532 802 526 Z" fill="url(#ns-metal)" />
        <path d="M808 521 Q881 514 954 521" stroke="#c9c3e6" strokeOpacity="0.5" strokeWidth="1" fill="none" />
        <ellipse cx="881" cy="532" rx="90" ry="6" fill="#000" opacity="0.5" filter="url(#ns-blur5)" />
        {/* body */}
        <rect x="701" y="248" width="360" height="252" rx="9" fill="url(#ns-bezel)" />
        <rect x="701.5" y="248.5" width="359" height="251" rx="8.5" fill="none" stroke="#8e88b0" strokeOpacity="0.45" />
        {/* screen */}
        <svg x="711" y="256" width="340" height="224" viewBox="0 0 300 198" preserveAspectRatio="none">
          <Editor {...typing} />
        </svg>
        <rect x="711" y="256" width="340" height="224" fill="url(#ns-glass)" />
        <rect x="711" y="256" width="340" height="224" fill="none" stroke="#000" strokeOpacity="0.6" strokeWidth="2" />
        {/* chin with power light */}
        <circle cx="1046" cy="490" r="1.8" fill="#34d399" filter="url(#ns-glow)" />
        <rect x="868" y="487" width="26" height="3" rx="1.5" fill="#3a3550" />

        {/* ---------- laptop with eval scores ---------- */}
        <ellipse cx="1194" cy="556" rx="130" ry="8" fill="#000" opacity="0.6" filter="url(#ns-blur5)" />
        <g>
          {/* lid */}
          <path d="M1102 420 L1292 410 L1296 528 L1106 534 Z" fill="url(#ns-bezel)" stroke="#8e88b0" strokeOpacity="0.4" strokeWidth="1" />
          <path d="M1110 428 L1286 419 L1289 520 L1113 525 Z" fill="#0a0919" />
          <text x="1122" y="444" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#9d8cff" transform="rotate(-3 1122 444)">eval score</text>
          {[0, 1, 2, 3].map((k) => <line key={k} x1="1120" x2="1280" y1={470 + k * 14} y2={469 + k * 14 - 3} stroke="#2a2550" strokeWidth="0.6" />)}
          <polyline points="1122,508 1150,502 1176,494 1202,478 1228,474 1254,456 1278,448" fill="none" stroke="#34d399" strokeWidth="2.5" className="draw-line" filter="url(#ns-glow)" />
          <path d="M1110 428 L1194 424 L1124 522 L1113 525 Z" fill="#fff" opacity="0.03" />
          {/* base with keyboard deck */}
          <path d="M1094 534 L1308 528 L1330 552 L1076 560 Z" fill="url(#ns-metal)" />
          <path d="M1094 534 L1308 528" stroke="#c9c3e6" strokeOpacity="0.45" strokeWidth="1" />
          <path d="M1114 538 L1294 533 L1308 546 L1102 552 Z" fill="#100d1e" />
          <path d="M1076 560 L1330 552 L1330 556 L1076 564 Z" fill="#0a0814" />
        </g>

        {/* ---------- desk mat, keyboard, mouse (centred under the monitor) ---------- */}
        <path d="M700 540 L1210 540 L1236 600 L676 600 Z" fill="#0c0a22" stroke="#7c5cff" strokeOpacity="0.3" strokeWidth="1.2" />
        <path d="M700 540 L1210 540" stroke="#b7a8ff" strokeOpacity="0.25" />
        {/* keyboard */}
        <ellipse cx="881" cy="592" rx="178" ry="7" fill="#000" opacity="0.65" filter="url(#ns-blur5)" />
        <path d="M712 590 L1050 590" stroke="url(#ns-rgb)" strokeWidth="5" opacity="0.85" filter="url(#ns-blur5)" />
        <path d="M734 548 L1028 548 L1048 586 L714 586 Z" fill="url(#ns-kbd)" />
        <path d="M734 548 L1028 548" stroke="#b7a8ff" strokeOpacity="0.5" strokeWidth="1" />
        <path d="M714 586 L1048 586 L1047 592 L715 592 Z" fill="#06050d" />
        {Array.from({ length: 5 }, (_, r) => {
          const t0 = (r * 7 + 1.5) / 38, t1 = (r * 7 + 7) / 38
          const y0 = 548 + r * 7 + 1.5, y1 = y0 + 5.4
          const l0 = 734 - 20 * t0 + 4, r0 = 1028 + 20 * t0 - 4
          const keys = r === 4 ? [1.4, 1.2, 1.2, 6.5, 1.2, 1.2, 1.4] : Array.from({ length: 14 }, () => 1)
          const units = keys.reduce((a2, k) => a2 + k, 0)
          const gap = 1.6
          const span = r0 - l0 - gap * (keys.length - 1)
          let x = l0
          return keys.map((k, c) => {
            const w = (span * k) / units
            const el = (
              <g key={`${r}-${c}`}>
                <rect x={x} y={y0} width={w} height={y1 - y0} rx="1.1" fill="#120f22" />
                <rect x={x + 0.5} y={y0} width={w - 1} height={y1 - y0 - 1.4} rx="1" fill="url(#ns-key)" className={(r * 14 + c) % 6 === 0 ? "keypress" : undefined} style={{ animationDelay: `${((r * 14 + c) * 0.19) % 2}s` }} />
              </g>
            )
            x += w + gap
            void t1
            return el
          })
        })}
        {/* mouse */}
        <ellipse cx="1124" cy="588" rx="22" ry="5" fill="#000" opacity="0.7" filter="url(#ns-blur5)" />
        <g className="mouse-idle" transform="rotate(-8 1122 566)">
          <path d="M1122 544 C 1136 544, 1140 556, 1140 568 C 1140 582, 1132 590, 1122 590 C 1112 590, 1104 582, 1104 568 C 1104 556, 1108 544, 1122 544 Z" fill="url(#ns-mouse)" />
          <path d="M1122 545 L1122 562" stroke="#05040c" strokeWidth="1" />
          <path d="M1108 556 C 1110 548, 1116 545, 1121 545" stroke="#d8d0ff" strokeOpacity="0.6" strokeWidth="1.2" fill="none" />
          <rect x="1120.5" y="550" width="3" height="7" rx="1.5" fill="#22d3ee" filter="url(#ns-glow)" />
        </g>

        {/* ---------- Jagannath (drawn in a 640-wide space, scaled into the scene) ---------- */}
        <g transform="translate(534 -13) scale(1.35)">
          {showPerson && (<>
          {/* mechanical keyboard with RGB under-glow */}
          <path d="M196 434 L418 434" stroke="url(#ns-rgb)" strokeWidth="4" opacity="0.9" filter="url(#ns-blur2)" />
          <path d="M204 400 L410 400 L422 428 L192 428 Z" fill="url(#ns-kbd)" stroke="#6b5ae0" strokeOpacity="0.45" strokeWidth="0.8" />
          <path d="M192 428 L422 428 L421 433 L193 433 Z" fill="#07060f" />
          {Array.from({ length: 4 }, (_, r) => {
            const left = 207 - r * 2.4, right = 407 + r * 2.4, n = 15, gap = 1.1
            const w = (right - left - gap * (n - 1)) / n
            return Array.from({ length: n }, (_, c) => (
              <rect key={`${r}-${c}`} x={left + c * (w + gap)} y={402.4 + r * 5} width={w} height={3.9} rx="0.7" fill="url(#ns-key)" className={(r * 15 + c) % 6 === 0 ? "keypress" : undefined} style={{ animationDelay: `${((r * 15 + c) * 0.19) % 2}s` }} />
            ))
          })}
          {[[197, 20], [219, 14], [235, 112], [349, 14], [365, 14], [381, 14], [397, 16]].map(([x, w], i) => (
            <rect key={i} x={x} y={422.4} width={w} height={4} rx="0.7" fill="url(#ns-key)" />
          ))}
          <path d="M204 400 L410 400" stroke="#b7a8ff" strokeOpacity="0.55" strokeWidth="0.8" />

          {/* mouse on a mouse-pad */}
          <path d="M566 404 L640 404 L650 432 L558 432 Z" fill="#0b0920" stroke="#7c5cff" strokeOpacity="0.35" strokeWidth="0.8" />
          <g className="mouse-move">
            <ellipse cx="606" cy="417" rx="8.5" ry="11.5" fill="url(#ns-kbd)" stroke="#8f7bff" strokeOpacity="0.5" strokeWidth="0.8" />
            <path d="M606 406 L606 413" stroke="#000" strokeOpacity="0.6" strokeWidth="0.8" />
            <rect x="605" y="408" width="2" height="3.5" rx="1" fill="#22d3ee" filter="url(#ns-glow)" />
          </g>

          </>)}
          {showPerson && (
          <>
          {/* cross-legged on the chair: knees stick out on both sides */}
          <path d="M424 548 C 402 538, 360 542, 346 562 C 338 578, 350 594, 372 596 C 394 598, 416 590, 428 582 Z" fill="url(#ns-denim)" />
          <path d="M424 548 C 402 538, 360 542, 346 562" stroke="#b7a8ff" strokeOpacity="0.6" strokeWidth="2" fill="none" filter="url(#ns-blur2)" />
          <path d="M546 548 C 568 538, 610 542, 622 562 C 630 578, 618 594, 596 596 C 574 598, 554 590, 542 582 Z" fill="#141c3a" />
          <path d="M600 548 C 612 552, 620 558, 622 564" stroke="#7dd3fc" strokeOpacity="0.3" strokeWidth="2" fill="none" filter="url(#ns-blur2)" />

          {/* everything above the hips leans a little to the left, toward the screen */}
          <g transform="rotate(-6 476 620)">
            {/* right arm: hand on the mouse (in shadow) */}
            <g className="mouse-move">
              <path d="M560 372 L 598 468 L 626 430" stroke="url(#ns-sleeveR)" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M578 392 L 604 456" stroke="#7dd3fc" strokeOpacity="0.25" strokeWidth="2.5" strokeLinecap="round" filter="url(#ns-blur2)" />
              <path d="M620 438 L 628 425" stroke="#0c1024" strokeWidth="29" />
              <path d="M615 435 L 623 422" stroke="#8e86ad" strokeWidth="2" />
              <path d="M625 441 L 633 428" stroke="#8e86ad" strokeWidth="2" />
              <ellipse cx="631" cy="418" rx="12" ry="9" fill="#4a2f22" />
            </g>

            {/* left arm: types, then comes up to the chin to think */}
            <g className={`think-arm ${typing.thinking ? "is-thinking" : ""}`}>
              <path className="arm-sleeve" d={armD} style={{ d: `path("${armD}")` } as React.CSSProperties} stroke="url(#ns-sleeveL)" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path className="arm-rim" d={rimD} style={{ d: `path("${rimD}")` } as React.CSSProperties} stroke="#e0d8ff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" filter="url(#ns-blur2)" fill="none" />
              <g className="arm-hand-type" opacity={typing.thinking ? 0 : 1}>
                <path d="M330 412 L 316 401" stroke="#141a3c" strokeWidth="29" />
                <path d="M333 417 L 319 406" stroke="#d8d0f0" strokeWidth="2" />
                <path d="M327 407 L 313 396" stroke="#d8d0f0" strokeWidth="2" />
                <g className="typing-hand">
                  <ellipse cx="304" cy="398" rx="16" ry="9" fill="#7a4e38" />
                  {[0, 1, 2, 3].map((f) => <rect key={f} x={289 + f * 6.5} y={399} width="5" height="9" rx="2.5" fill="#6a4230" className="finger" style={{ animationDelay: `${f * 0.11}s` }} />)}
                </g>
              </g>
              <g className="arm-hand-think" opacity={typing.thinking ? 1 : 0}>
                <path d="M396 334 L 392 320" stroke="#141a3c" strokeWidth="29" />
                <path d="M383 333 L 381 319" stroke="#d8d0f0" strokeWidth="2" />
                <path d="M409 333 L 405 319" stroke="#d8d0f0" strokeWidth="2" />
                {/* loose fist resting under the jaw */}
                <ellipse cx="398" cy="304" rx="13" ry="15" fill="#8a5a40" />
                <path d="M388 296 C 392 290, 404 290, 408 296" stroke="#5e3a28" strokeWidth="1.6" fill="none" />
                <path d="M386 302 L 409 302" stroke="#5e3a28" strokeWidth="1.2" strokeOpacity="0.6" />
                <path d="M386 296 C 384 304, 386 312, 392 318" stroke="#e8dcff" strokeOpacity="0.7" strokeWidth="1.6" fill="none" />
              </g>
            </g>

            {/* torso: varsity jacket */}
            <path d="M386 362 C 400 342, 424 326, 446 320 L 482 320 C 508 326, 540 342, 562 362 C 576 410, 580 480, 578 640 L 374 640 C 370 480, 374 410, 386 362 Z" fill="url(#ns-jacket)" />
            <path d="M446 320 C 422 326, 400 342, 386 362 C 380 376, 380 392, 382 404 C 392 380, 410 356, 436 336 Z" fill="#b2a8e0" />
            <path d="M482 320 C 508 326, 540 342, 562 362 C 568 378, 570 392, 568 404 C 556 380, 530 354, 494 334 Z" fill="#3e3858" />
            <path d="M382 404 C 376 460, 374 540, 374 640" stroke="#05070f" strokeWidth="2" opacity="0.6" fill="none" />
            <path d="M568 404 C 574 460, 578 540, 578 640" stroke="#05070f" strokeWidth="2" opacity="0.6" fill="none" />
            {/* back pleat / shoulder-blade shading */}
            <path d="M430 400 C 450 430, 500 430, 524 400" stroke="#05070f" strokeOpacity="0.35" strokeWidth="6" fill="none" filter="url(#ns-blur5)" />
            <text x="480" y="452" textAnchor="middle" fontFamily="Sora Variable, sans-serif" fontWeight="800" fontSize="24" fill="#a59cc8" opacity="0.4" transform="rotate(-3 480 452)">JP</text>
            {/* rim light */}
            <path d="M386 362 C 400 342, 424 326, 446 320" stroke="#c9bcff" strokeWidth="3" fill="none" filter="url(#ns-blur2)" />
            <path d="M386 362 C 400 342, 424 326, 446 320" stroke="#efeaff" strokeWidth="1" fill="none" />
            <path d="M386 362 C 376 410, 372 480, 374 640" stroke="#8f7bff" strokeOpacity="0.5" strokeWidth="2" fill="none" filter="url(#ns-blur2)" />
            <path d="M562 362 C 576 410, 580 480, 578 640" stroke="#7dd3fc" strokeOpacity="0.3" strokeWidth="2" fill="none" filter="url(#ns-blur2)" />

            {/* head: a little smaller for natural proportions; tilts further when thinking */}
            <g className={`think-tilt ${typing.thinking ? "is-thinking" : ""}`}>
              <g className={typing.thinking ? undefined : "head-bob"}>
                <g transform="translate(462 312) scale(0.84) translate(-462 -312)">
                  <path d="M440 290 L 484 290 L 488 326 L 440 326 Z" fill="#3e271b" />
                  <ellipse cx="456" cy="254" rx="50" ry="56" fill="url(#ns-skin)" />
                  <path d="M408 280 C 412 296, 424 306, 440 308 L 446 300 C 432 298, 420 290, 414 276 Z" fill="#1a100b" opacity="0.5" />
                  <path d="M404 268 C 407 270, 410 270, 412 268" stroke="#140c08" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
                  <path d="M413 240 C 405 254, 403 270, 408 286 C 412 296, 420 304, 430 306" stroke="#d8ccff" strokeWidth="3" fill="none" filter="url(#ns-blur2)" />
                  <path d="M413 240 C 405 254, 403 270, 408 286 C 412 296, 420 304, 430 306" stroke="#fbf9ff" strokeWidth="1" fill="none" />
                  <path d="M420 244 C 410 214, 424 186, 452 176 C 472 166, 502 170, 514 192 C 524 212, 522 242, 514 264 C 508 282, 498 296, 484 304 L 454 306 C 444 292, 436 274, 432 256 C 430 250, 426 246, 420 244 Z" fill="#07050b" />
                  <path d="M418 228 C 408 204, 418 180, 444 170 C 460 164, 478 164, 490 170 C 470 170, 452 176, 440 190 C 452 182, 468 180, 480 184 C 460 188, 442 200, 432 220 Z" fill="#0d0a14" />
                  <path d="M418 230 C 410 206, 420 182, 446 170" stroke="#b9a9ff" strokeWidth="2.5" fill="none" filter="url(#ns-blur2)" />
                  <path d="M432 196 C 446 186, 462 182, 478 184" stroke="#2a2340" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M440 206 C 456 196, 474 194, 490 198" stroke="#221c34" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  <path d="M484 240 C 494 238, 506 246, 510 258 C 506 272, 498 284, 488 292 C 484 276, 482 256, 484 240 Z" fill="#241b24" opacity="0.6" />
                  <ellipse cx="496" cy="262" rx="8" ry="14" fill="#4a2e20" />
                  <path d="M496 252 C 501 256, 501 268, 496 272" stroke="#2e1c13" strokeWidth="2" fill="none" />
                  <path d="M486 240 L 490 262" stroke="#07050b" strokeWidth="3" />
                  <path d="M512 196 C 522 214, 520 240, 512 262" stroke="#7dd3fc" strokeOpacity="0.35" strokeWidth="2" fill="none" filter="url(#ns-blur2)" />
                </g>
              </g>
            </g>

            {/* varsity collar */}
            <path d="M438 324 C 452 314, 476 314, 490 324" stroke="#0e1430" strokeWidth="13" fill="none" strokeLinecap="round" />
            <path d="M436 321 C 452 311, 476 311, 492 321" stroke="#cfc6ec" strokeWidth="1.6" fill="none" />
            <path d="M439 327 C 454 318, 474 318, 489 327" stroke="#cfc6ec" strokeWidth="1.6" fill="none" />

            {/* thinking: a small glass bubble with dots */}
            <g className="thought" opacity={typing.thinking ? 1 : 0}>
              <circle cx="392" cy="232" r="3" fill="#cfc6ff" opacity="0.6" />
              <circle cx="380" cy="216" r="5" fill="#cfc6ff" opacity="0.7" />
              <rect x="318" y="168" width="64" height="34" rx="17" fill="#120d30" fillOpacity="0.85" stroke="#b7a8ff" strokeOpacity="0.7" />
              {[0, 1, 2].map((d) => <circle key={d} cx={337 + d * 13} cy="185" r="3.4" fill="#e6e0ff" className="think-dot" style={{ animationDelay: `${d * 0.18}s` }} />)}
            </g>
          </g>

          {/* chair back (does not lean) */}
          <path d="M412 486 C 412 470, 422 462, 438 462 L 532 462 C 548 462, 556 470, 556 486 L 560 660 L 408 660 Z" fill="#0b0920" />
          <path d="M412 486 C 412 470, 422 462, 438 462 L 532 462" stroke="#8f7bff" strokeOpacity="0.55" strokeWidth="2" fill="none" />
          <path d="M412 486 L 408 660" stroke="#8f7bff" strokeOpacity="0.35" strokeWidth="2" />
          <rect x="470" y="500" width="28" height="4" rx="2" fill="#7c5cff" opacity="0.6" />
          </>
          )}
        </g>

        {/* ---------- glowing Earth in the foreground ---------- */}
        <g clipPath="url(#ns-earthClip)">
          <circle cx={earth.cx} cy={earth.cy} r={earth.R + 40} fill="#6d5cff" opacity="0.35" filter="url(#ns-blur40)" />
          <circle cx={earth.cx} cy={earth.cy} r={earth.R} fill="url(#ns-earth)" />
          <circle cx={earth.cx} cy={earth.cy} r={earth.R} fill="none" stroke="#a9b8ff" strokeWidth="6" opacity="0.7" filter="url(#ns-blur5)" />
          <circle cx={earth.cx} cy={earth.cy} r={earth.R} fill="none" stroke="#e5e9ff" strokeWidth="1.4" opacity="0.8" />
          <g filter="url(#ns-glow)">
            {earth.pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.s} fill={p.warm ? "#ffd59a" : "#c4b5fd"} opacity="0.9" />)}
          </g>
          {earth.arcs.map(({ a, b, d }, i) => {
            const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - Math.abs(a.x - b.x) * 0.35 - 30
            return (
              <path key={i} d={`M${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`} fill="none" stroke="#9fd8ff" strokeWidth="1.6" opacity="0.7" className="arc-flow" style={{ animationDelay: `${d}s` }} filter="url(#ns-glow)" />
            )
          })}
        </g>


          {/* ---------- glass quote board, hung on the wall left of the window ---------- */}
          {quote && (
            <g transform="rotate(-4 805 145)">
              <g className="floaty">
                <rect x="650" y="62" width="312" height="150" rx="18" fill="#0c0826" fillOpacity="0.55" stroke="#c9bcff" strokeOpacity="0.7" strokeWidth="2" filter="url(#ns-glow)" />
                <rect x="650" y="62" width="312" height="150" rx="18" fill="none" stroke="#efeaff" strokeOpacity="0.35" strokeWidth="1" />
                <text fontFamily="Caveat, cursive" fill="#ece6ff" fontSize="38">
                  <tspan x="676" y="112">&ldquo;{quote.slice(0, quote.lastIndexOf(",") + 1)}</tspan>
                  <tspan x="676" y="152">{quote.slice(quote.lastIndexOf(",") + 1).trim()}&rdquo;</tspan>
                </text>
                <text x="936" y="192" textAnchor="end" fontFamily="Caveat, cursive" fontSize="24" letterSpacing="3" fill="#ece6ff" opacity="0.85">— {author}</text>
              </g>
            </g>
          )}

          {/* ---------- "right now" card, under the desk, centred on the keyboard ---------- */}
          {status.length > 0 && (
            <foreignObject x="736" y="644" width="300" height="88">
              <div className="h-full rounded-xl border border-white/10 bg-[#0a0720]/85 px-4 py-3 backdrop-blur-md">
                <p className="eyebrow !text-[10px]">// right now</p>
                <p className="mt-1.5 leading-snug"><StatusTicker lines={status} /></p>
              </div>
            </foreignObject>
          )}
        </g>

        {/* film grain + vignette for the painted feel */}
        <rect width="1600" height="1000" filter="url(#ns-grain)" opacity="0.07" style={{ mixBlendMode: "overlay" }} />
        <rect width="1600" height="1000" fill="url(#ns-vignette)" />
      </svg>
    </div>
  )
}
