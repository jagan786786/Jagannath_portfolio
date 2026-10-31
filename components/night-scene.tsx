"use client"

import { useEffect, useMemo, useRef, useState } from "react"

/*
  Cinematic hero scene: Jagannath at his desk at night, seen from behind his
  right shoulder, back-lit by the monitor. City lights through the window,
  live code typing on screen, a laptop with eval scores, chai, and a glowing
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
  const snip = SNIPPETS[si]
  const total = snip.code.length

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setTyped(total); setPhase("done"); return }
    if (phase === "typing") {
      const id = setInterval(() => {
        if (!visible.current) return
        setTyped((t) => {
          const next = snip.code[t] === " " ? t + 3 : t + 1 + (Math.random() > 0.8 ? 1 : 0)
          if (next >= total) { clearInterval(id); setPhase("running"); return total }
          return next
        })
      }, 34)
      return () => clearInterval(id)
    }
    if (phase === "running") { const t = setTimeout(() => setPhase("done"), 1400); return () => clearTimeout(t) }
    const t = setTimeout(() => { setSi((i) => (i + 1) % SNIPPETS.length); setTyped(0); setPhase("typing") }, 3200)
    return () => clearTimeout(t)
  }, [phase, snip, total, visible])

  return { snip, typed, phase, si }
}

/* Editor drawn in its own 300 x 198 space, placed on the monitor with a nested <svg>. */
function Editor({ snip, typed, phase, si }: ReturnType<typeof useTyping>) {
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
          {phase === "typing" && <rect x={X + shown[cur].length * CW + 0.5} y={Y + cur * LH - FS + 1} width="1.2" height={FS + 1} fill="#e9e4ff" className="caret" />}
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

export default function NightScene({ className = "", crop = false }: { className?: string; crop?: boolean }) {
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

        {/* framed print on the wall: a tiny transformer diagram */}
        <g opacity="0.55">
          <rect x="770" y="96" width="120" height="150" rx="4" fill="#0b0824" stroke="#3a2f7a" strokeWidth="3" />
          {[0, 1, 2].map((i) => <rect key={i} x="800" y={118 + i * 34} width="60" height="20" rx="3" fill="none" stroke="#8f7bff" strokeOpacity="0.6" />)}
          <path d="M830 138 L830 152 M830 172 L830 186" stroke="#8f7bff" strokeOpacity="0.6" />
          <text x="830" y="234" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="#8f7bff" opacity="0.7">attention</text>
        </g>

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
        <ellipse cx="870" cy="530" rx="360" ry="40" fill="#7c5cff" opacity="0.45" filter="url(#ns-blur18)" />
        <path d="M520 524 L1700 524 L1700 600 L520 600 Z" fill="url(#ns-desk)" />
        <path d="M520 524 L1700 524" stroke="#9d8cff" strokeOpacity="0.45" strokeWidth="2" />
        <rect x="520" y="600" width="1180" height="18" fill="#05040f" />

        {/* plant */}
        <g opacity="0.85">
          {[[-40, -110], [-14, -140], [14, -128], [38, -96], [-30, -70], [26, -60], [0, -90]].map(([dx, dy], i) => (
            <g key={i} transform={`rotate(${dx * 0.9} ${575 + dx / 2} ${500 + dy / 2})`}>
              <ellipse cx={575 + dx / 2} cy={500 + dy / 2} rx="9" ry="38" fill={i % 2 ? "#1c3e46" : "#152f3a"} stroke="#5ec4b0" strokeOpacity="0.25" className="sway" style={{ animationDelay: `${i * 0.35}s` }} />
            </g>
          ))}
          <path d="M552 500 L598 500 L592 524 L558 524 Z" fill="#1b1542" stroke="#4a3ab0" strokeOpacity="0.6" />
        </g>

        {/* chai */}
        <g transform="translate(650 466)">
          <path d="M14 0 C 8 -16, 22 -24, 14 -40" stroke="#e4dcff" strokeOpacity="0.45" strokeWidth="3" fill="none" className="steam" />
          <path d="M30 0 C 24 -18, 38 -26, 30 -46" stroke="#e4dcff" strokeOpacity="0.35" strokeWidth="3" fill="none" className="steam" style={{ animationDelay: "1.1s" }} />
          <rect x="0" y="4" width="46" height="54" rx="7" fill="#17123c" stroke="#6b5ae0" strokeOpacity="0.8" strokeWidth="2" />
          <path d="M46 16 C 62 16, 62 42, 46 42" stroke="#6b5ae0" strokeOpacity="0.8" strokeWidth="5" fill="none" />
          <text x="23" y="30" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="15" fill="#d6ccff">fueled</text>
          <text x="23" y="46" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="15" fill="#d6ccff">by chai</text>
        </g>

        {/* ---------- main monitor ---------- */}
        <rect x="690" y="236" width="380" height="270" rx="26" fill="#7c5cff" opacity="0.55" filter="url(#ns-blur40)" />
        <rect x="868" y="488" width="26" height="36" fill="#120d30" />
        <ellipse cx="881" cy="524" rx="70" ry="7" fill="#120d30" />
        <rect x="700" y="250" width="362" height="242" rx="10" fill="#06051a" stroke="#4a3ab0" strokeWidth="2" />
        <svg x="711" y="260" width="340" height="224" viewBox="0 0 300 198" preserveAspectRatio="none">
          <Editor {...typing} />
        </svg>
        {/* glass reflection */}
        <path d="M711 260 L820 260 L740 484 L711 484 Z" fill="#fff" opacity="0.035" />

        {/* ---------- laptop with eval scores ---------- */}
        <g>
          <path d="M1336 414 L1530 404 L1534 520 L1340 524 Z" fill="#06051a" stroke="#4a3ab0" strokeWidth="1.5" />
          <path d="M1344 422 L1524 413 L1527 512 L1347 516 Z" fill="#0d0b22" />
          <text x="1356" y="438" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#9d8cff" transform="rotate(-3 1356 438)">eval score</text>
          <polyline points="1356,500 1384,494 1410,486 1436,470 1462,466 1488,448 1512,440" fill="none" stroke="#34d399" strokeWidth="2.5" className="draw-line" filter="url(#ns-glow)" />
          <path d="M1320 524 L1550 520 L1560 532 L1312 536 Z" fill="#1b1542" />
        </g>

        {/* ---------- Jagannath (old 640-space drawing scaled into the scene) ---------- */}
        <g transform="translate(534 -13) scale(1.35)">
          {/* keyboard + mouse */}
          <path d="M218 404 L404 404 L414 424 L208 424 Z" fill="#120d30" stroke="#4a3ab0" />
          {Array.from({ length: 3 }, (_, r) =>
            Array.from({ length: 14 }, (_, c) => (
              <rect key={`${r}-${c}`} x={216 + c * 13 + r * 1.5} y={407 + r * 5.5} width="10" height="3.6" rx="0.8" fill="#221a52" className={(r * 14 + c) % 7 === 0 ? "keypress" : undefined} style={{ animationDelay: `${((r * 14 + c) * 0.23) % 2}s` }} />
            )),
          )}
          <path d="M218 404 L404 404" stroke="#a996ff" strokeOpacity="0.6" />
          <ellipse cx="604" cy="418" rx="11" ry="7" fill="#120d30" stroke="#4a3ab0" className="mouse-move" />

          {/* left arm (monitor side, catches the light) */}
          <path d="M404 360 L 376 432 L 340 410" stroke="url(#ns-sleeveL)" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M392 368 L 368 428" stroke="#e0d8ff" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round" filter="url(#ns-blur2)" />
          <path d="M350 414 L 336 406" stroke="#141a3c" strokeWidth="28" />
          <path d="M352 418 L 338 410" stroke="#d8d0f0" strokeWidth="2" />
          <path d="M347 410 L 333 402" stroke="#d8d0f0" strokeWidth="2" />
          <g className="typing-hand">
            <ellipse cx="326" cy="404" rx="16" ry="9" fill="#7a4e38" />
            {[0, 1, 2, 3].map((f) => <rect key={f} x={311 + f * 6.5} y={405} width="5" height="9" rx="2.5" fill="#6a4230" className="finger" style={{ animationDelay: `${f * 0.11}s` }} />)}
          </g>

          {/* right arm (in shadow, hand on the mouse) */}
          <g className="mouse-move">
            <path d="M548 362 L 580 446 L 600 414" stroke="url(#ns-sleeveR)" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M566 380 L 590 440" stroke="#7dd3fc" strokeOpacity="0.25" strokeWidth="2.5" strokeLinecap="round" filter="url(#ns-blur2)" />
            <path d="M596 420 L 602 408" stroke="#0c1024" strokeWidth="28" />
            <path d="M592 418 L 598 406" stroke="#8e86ad" strokeWidth="2" />
            <path d="M600 422 L 606 410" stroke="#8e86ad" strokeWidth="2" />
            <ellipse cx="606" cy="402" rx="12" ry="8" fill="#4a2f22" />
          </g>

          {/* torso */}
          <path d="M398 352 C 412 334, 432 322, 452 318 L 486 318 C 510 322, 534 336, 548 356 C 560 400, 566 470, 566 600 L 386 600 C 384 480, 386 400, 398 352 Z" fill="url(#ns-jacket)" />
          <path d="M452 318 C 428 322, 408 334, 396 354 C 392 366, 392 378, 394 388 C 404 366, 420 346, 442 332 Z" fill="#b2a8e0" />
          <path d="M486 318 C 512 322, 536 338, 550 360 C 554 372, 556 382, 556 392 C 546 370, 528 348, 498 332 Z" fill="#3e3858" />
          <text x="478" y="428" textAnchor="middle" fontFamily="Sora Variable, sans-serif" fontWeight="800" fontSize="26" fill="#a59cc8" opacity="0.45" transform="rotate(-4 478 428)">JP</text>
          {/* rim light from the monitor along the left edge of the shoulders */}
          <path d="M398 352 C 412 334, 432 322, 452 318" stroke="#c9bcff" strokeWidth="3" fill="none" filter="url(#ns-blur2)" />
          <path d="M398 352 C 412 334, 432 322, 452 318" stroke="#efeaff" strokeWidth="1" fill="none" />
          <path d="M398 352 C 390 400, 388 460, 388 600" stroke="#8f7bff" strokeOpacity="0.5" strokeWidth="2" fill="none" filter="url(#ns-blur2)" />
          {/* cool window light on the right edge */}
          <path d="M548 356 C 560 400, 566 470, 566 600" stroke="#7dd3fc" strokeOpacity="0.3" strokeWidth="2" fill="none" filter="url(#ns-blur2)" />

          {/* head */}
          <g className="head-bob">
            <path d="M440 290 L 484 290 L 488 322 L 440 322 Z" fill="#3e271b" />
            <ellipse cx="456" cy="254" rx="50" ry="56" fill="url(#ns-skin)" />
            <path d="M408 280 C 412 296, 424 306, 440 308 L 446 300 C 432 298, 420 290, 414 276 Z" fill="#1a100b" opacity="0.5" />
            <path d="M404 268 C 407 270, 410 270, 412 268" stroke="#140c08" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
            {/* rim light on the cheek, the brightest edge in the scene */}
            <path d="M413 240 C 405 254, 403 270, 408 286 C 412 296, 420 304, 430 306" stroke="#d8ccff" strokeWidth="3" fill="none" filter="url(#ns-blur2)" />
            <path d="M413 240 C 405 254, 403 270, 408 286 C 412 296, 420 304, 430 306" stroke="#fbf9ff" strokeWidth="1" fill="none" />
            {/* hair */}
            <path d="M420 244 C 410 214, 424 186, 452 176 C 472 166, 502 170, 514 192 C 524 212, 522 242, 514 264 C 508 282, 498 296, 484 304 L 454 306 C 444 292, 436 274, 432 256 C 430 250, 426 246, 420 244 Z" fill="#07050b" />
            <path d="M418 228 C 408 204, 418 180, 444 170 C 460 164, 478 164, 490 170 C 470 170, 452 176, 440 190 C 452 182, 468 180, 480 184 C 460 188, 442 200, 432 220 Z" fill="#0d0a14" />
            <path d="M418 230 C 410 206, 420 182, 446 170" stroke="#b9a9ff" strokeWidth="2.5" fill="none" filter="url(#ns-blur2)" />
            <path d="M432 196 C 446 186, 462 182, 478 184" stroke="#2a2340" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M440 206 C 456 196, 474 194, 490 198" stroke="#221c34" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M484 240 C 494 238, 506 246, 510 258 C 506 272, 498 284, 488 292 C 484 276, 482 256, 484 240 Z" fill="#241b24" opacity="0.6" />
            <ellipse cx="496" cy="262" rx="8" ry="14" fill="#4a2e20" />
            <path d="M496 252 C 501 256, 501 268, 496 272" stroke="#2e1c13" strokeWidth="2" fill="none" />
            <path d="M486 240 L 490 262" stroke="#07050b" strokeWidth="3" />
            {/* cool rim on the back of the head from the window */}
            <path d="M512 196 C 522 214, 520 240, 512 262" stroke="#7dd3fc" strokeOpacity="0.35" strokeWidth="2" fill="none" filter="url(#ns-blur2)" />
          </g>

          {/* varsity collar */}
          <path d="M436 322 C 450 312, 476 312, 492 322" stroke="#0e1430" strokeWidth="13" fill="none" strokeLinecap="round" />
          <path d="M434 319 C 450 309, 476 309, 494 319" stroke="#cfc6ec" strokeWidth="1.6" fill="none" />
          <path d="M437 325 C 452 316, 474 316, 491 325" stroke="#cfc6ec" strokeWidth="1.6" fill="none" />

          {/* chair */}
          <path d="M412 486 C 412 470, 422 462, 438 462 L 532 462 C 548 462, 556 470, 556 486 L 560 640 L 408 640 Z" fill="#0b0920" />
          <path d="M412 486 C 412 470, 422 462, 438 462 L 532 462" stroke="#8f7bff" strokeOpacity="0.55" strokeWidth="2" fill="none" />
          <path d="M412 486 L 408 640" stroke="#8f7bff" strokeOpacity="0.35" strokeWidth="2" />
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

        </g>

        {/* film grain + vignette for the painted feel */}
        <rect width="1600" height="1000" filter="url(#ns-grain)" opacity="0.07" style={{ mixBlendMode: "overlay" }} />
        <rect width="1600" height="1000" fill="url(#ns-vignette)" />
      </svg>
    </div>
  )
}
