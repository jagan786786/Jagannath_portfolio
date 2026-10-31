"use client"

import { useEffect, useMemo, useRef, useState } from "react"

// Illustrated Jagannath at his desk, seen over the shoulder, writing code that
// actually types out on the monitor. Look taken from his photo: black hair with
// volume on top, light stubble, navy varsity jacket with cream sleeves and
// striped rib trim.

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

const C = {
  kw: "#c4b5fd",
  str: "#86efac",
  fn: "#67e8f9",
  dec: "#f9a8d4",
  num: "#fcd34d",
  com: "#6b6890",
  txt: "#dcd8f0",
}

type Seg = [string, string]
function highlight(line: string): Seg[] {
  const re = /("""[^"]*"""|"[^"]*"|'[^']*')|(#.*$)|(@[\w.]+)|\b(from|import|def|return|for|in|assert|print|await|async)\b|(\b\w+(?=\())|(\b\d+(?:\.\d+)?\b)/g
  const out: Seg[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) {
    if (m.index > last) out.push([line.slice(last, m.index), C.txt])
    const color = m[1] ? C.str : m[2] ? C.com : m[3] ? C.dec : m[4] ? C.kw : m[5] ? C.fn : C.num
    out.push([m[0], color])
    last = m.index + m[0].length
  }
  if (last < line.length) out.push([line.slice(last), C.txt])
  return out
}

const FS = 7.4 // code font size (svg units)
const CW = FS * 0.6 // monospace char width
const LH = 11.6
const CODE_X = 190
const CODE_Y = 150

export default function CoderScene({ className = "" }: { className?: string }) {
  const [si, setSi] = useState(0)
  const [typed, setTyped] = useState(0)
  const [phase, setPhase] = useState<"typing" | "running" | "done">("typing")
  const wrap = useRef<HTMLDivElement>(null)
  const visible = useRef(true)

  const snip = SNIPPETS[si]
  const lines = useMemo(() => snip.code.split("\n"), [snip])
  const total = snip.code.length

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting })
    if (wrap.current) io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(total); setPhase("done"); return
    }
    if (phase === "typing") {
      const id = setInterval(() => {
        if (!visible.current) return
        setTyped((t) => {
          // Type faster through whitespace, like a person does.
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
  }, [phase, snip, total])

  // Work out which lines/columns are visible so far.
  let start = 0
  let curLine = 0
  const shown = lines.map((l, i) => {
    if (typed >= start) curLine = i
    const take = Math.max(0, Math.min(l.length, typed - start))
    start += l.length + 1
    return l.slice(0, take)
  })
  const cursorX = CODE_X + shown[curLine].length * CW
  const cursorY = CODE_Y + curLine * LH

  // Scroll the code view if the snippet is taller than the screen.
  const maxLines = 12
  const offset = Math.max(0, curLine - (maxLines - 1)) * LH

  return (
    <div ref={wrap} className={className}>
      <svg viewBox="0 0 640 600" className="h-auto w-full" role="img" aria-label="Illustration of Jagannath at his desk at night, writing AI agent code on a monitor">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d0930" />
            <stop offset="0.7" stopColor="#2a1f6e" />
            <stop offset="1" stopColor="#3b2a8a" />
          </linearGradient>
          <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#231b4d" />
            <stop offset="1" stopColor="#120d2b" />
          </linearGradient>
          <linearGradient id="jacket" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#33467e" />
            <stop offset="0.45" stopColor="#1f2d58" />
            <stop offset="1" stopColor="#141c3a" />
          </linearGradient>
          <linearGradient id="sleeve" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#f1ece2" />
            <stop offset="1" stopColor="#bdb4c9" />
          </linearGradient>
          <linearGradient id="sleeveR" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c9c0d2" />
            <stop offset="1" stopColor="#8f86a6" />
          </linearGradient>
          <linearGradient id="skin" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#b07a57" />
            <stop offset="1" stopColor="#6e4630" />
          </linearGradient>
          <radialGradient id="screenGlow" cx="0.5" cy="0.5" r="0.6">
            <stop offset="0" stopColor="#7c5cff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#7c5cff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moon">
            <stop offset="0" stopColor="#f3efff" />
            <stop offset="0.5" stopColor="#c7bcff" stopOpacity="0.6" />
            <stop offset="1" stopColor="#7c5cff" stopOpacity="0" />
          </radialGradient>
          <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" /></filter>
          <filter id="glowF" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="screenClip"><rect x="122" y="128" width="300" height="168" /></clipPath>
          <clipPath id="windowClip"><rect x="24" y="18" width="592" height="384" rx="18" /></clipPath>
        </defs>

        {/* ---------------- window + night city ---------------- */}
        <g clipPath="url(#windowClip)">
          <rect x="24" y="18" width="592" height="384" fill="url(#sky)" />
          <circle cx="528" cy="78" r="70" fill="url(#moon)" opacity="0.55" />
          <circle cx="528" cy="78" r="17" fill="#efeaff" opacity="0.9" />
          {[[60, 50], [120, 90], [210, 40], [300, 70], [380, 36], [450, 120], [600, 150], [90, 160], [580, 40], [250, 120]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 ? 1 : 1.5} fill="#e4ddff" className="twinkle" style={{ animationDelay: `${i * 0.37}s` }} />
          ))}
          {/* far skyline */}
          <path d="M24 330 L24 290 L58 290 L58 262 L84 262 L84 300 L110 300 L110 248 L132 248 L132 230 L150 230 L150 300 L178 300 L178 270 L206 270 L206 310 L240 310 L240 255 L262 255 L262 240 L284 240 L284 300 L318 300 L318 276 L350 276 L350 236 L370 236 L370 216 L388 216 L388 290 L420 290 L420 262 L452 262 L452 300 L486 300 L486 244 L512 244 L512 228 L534 228 L534 296 L566 296 L566 268 L616 268 L616 402 L24 402 Z" fill="#1a1347" />
          {/* near skyline */}
          <path d="M24 402 L24 340 L70 340 L70 318 L104 318 L104 352 L150 352 L150 326 L196 326 L196 360 L250 360 L250 334 L300 334 L300 364 L360 364 L360 322 L400 322 L400 350 L454 350 L454 330 L500 330 L500 358 L560 358 L560 316 L616 316 L616 402 Z" fill="#0f0b2c" />
          {Array.from({ length: 34 }, (_, i) => {
            const x = 40 + ((i * 53) % 560)
            const y = 270 + ((i * 37) % 110)
            return <rect key={i} x={x} y={y} width="3" height="4" fill={i % 4 ? "#ffd27a" : "#a996ff"} opacity="0.75" className="twinkle" style={{ animationDelay: `${(i * 0.53) % 4}s`, animationDuration: `${3 + (i % 5)}s` }} />
          })}
          {/* handwriting on the glass */}
          <g fontFamily="Caveat, cursive" fill="#b7a8ff" filter="url(#glowF)" opacity="0.9">
            <text x="452" y="170" fontSize="22" transform="rotate(-8 452 170)">train → eval → ship</text>
            <text x="470" y="206" fontSize="17" transform="rotate(-8 470 206)" opacity="0.8">repeat.</text>
            <path d="M462 214 Q500 206 540 200" stroke="#b7a8ff" strokeWidth="1.5" fill="none" opacity="0.7" />
          </g>
          {/* window frame */}
          <rect x="24" y="18" width="592" height="384" rx="18" fill="none" stroke="#2b2266" strokeWidth="8" />
          <line x1="440" y1="18" x2="440" y2="402" stroke="#2b2266" strokeWidth="7" />
        </g>

        {/* ---------------- desk ---------------- */}
        <ellipse cx="270" cy="400" rx="230" ry="40" fill="url(#screenGlow)" />
        <path d="M0 398 L640 398 L640 452 L0 452 Z" fill="url(#desk)" />
        <path d="M0 398 L640 398" stroke="#6e5ae6" strokeOpacity="0.35" strokeWidth="1.5" />
        <rect x="0" y="452" width="640" height="22" fill="#0b0820" />

        {/* plant */}
        <g transform="translate(46 330)">
          {[[-30, -60], [-10, -75], [12, -68], [28, -50], [-22, -40], [20, -30]].map(([dx, dy], i) => (
            <ellipse key={i} cx={dx / 2} cy={dy / 2 + 10} rx="7" ry="24" fill={i % 2 ? "#2f6b55" : "#245746"} transform={`rotate(${dx * 1.2} ${dx / 2} ${dy / 2 + 10})`} className="sway" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
          <path d="M-18 48 L18 48 L14 70 L-14 70 Z" fill="#3a2f7a" />
        </g>

        {/* monitor glow behind */}
        <rect x="100" y="110" width="340" height="230" rx="30" fill="#7c5cff" opacity="0.35" filter="url(#soft)" />

        {/* monitor */}
        <rect x="262" y="320" width="22" height="66" fill="#1c1640" />
        <ellipse cx="273" cy="392" rx="58" ry="7" fill="#1c1640" />
        <rect x="112" y="110" width="320" height="214" rx="10" fill="#08061a" stroke="#3d3290" strokeWidth="2" />
        <rect x="122" y="118" width="300" height="198" rx="3" fill="#0c0b1e" />

        {/* editor chrome */}
        <rect x="122" y="118" width="300" height="12" fill="#151233" />
        <circle cx="130" cy="124" r="2" fill="#ff5f57" /><circle cx="137" cy="124" r="2" fill="#febc2e" /><circle cx="144" cy="124" r="2" fill="#28c840" />
        <rect x="160" y="119" width="52" height="11" fill="#0c0b1e" />
        <text x="166" y="127" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="#c4b5fd">{snip.file}</text>
        {/* sidebar */}
        <rect x="122" y="130" width="46" height="186" fill="#100e26" />
        {["src/", "agent.py", "rag.py", "tools.py", "evals.py", "evals/", "README.md"].map((f, i) => (
          <text key={f} x={f.endsWith("/") ? 127 : 132} y={142 + i * 10} fontFamily="JetBrains Mono, monospace" fontSize="5.4" fill={f === snip.file ? "#e9e4ff" : "#6f6a98"}>{f}</text>
        ))}
        {/* code */}
        <g clipPath="url(#screenClip)">
          <g transform={`translate(0 ${-offset})`} fontFamily="JetBrains Mono, monospace" fontSize={FS}>
            {shown.map((l, i) => i > curLine ? null : (
              <g key={`${si}-${i}`}>
                <text x={CODE_X - 8} y={CODE_Y + i * LH} fill="#3f3a6b" textAnchor="end" fontSize="6">{i + 1}</text>
                <text x={CODE_X} y={CODE_Y + i * LH} xmlSpace="preserve">
                  {highlight(l).map(([t, c], k) => <tspan key={k} fill={c}>{t}</tspan>)}
                </text>
              </g>
            ))}
            {phase === "typing" && <rect x={cursorX + 0.5} y={cursorY - FS + 1} width="1.2" height={FS + 1} fill="#e9e4ff" className="caret" />}
          </g>
        </g>
        {/* terminal */}
        <rect x="168" y="290" width="254" height="26" fill="#08071a" stroke="#1f1b45" strokeWidth="0.6" />
        <text x="174" y="300" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="#8f89c0">{phase === "typing" ? "$ _" : snip.run}</text>
        {phase !== "typing" && (
          <text x="174" y="311" fontFamily="JetBrains Mono, monospace" fontSize="6.4" fill={phase === "done" ? "#34d399" : "#fcd34d"}>
            {phase === "done" ? snip.result : "running…"}
          </text>
        )}

        {/* mug of chai */}
        <g transform="translate(150 360)">
          <path d="M6 0 C 2 -10, 12 -16, 6 -26" stroke="#d6ccff" strokeOpacity="0.5" strokeWidth="2" fill="none" className="steam" />
          <path d="M18 0 C 14 -12, 24 -18, 18 -30" stroke="#d6ccff" strokeOpacity="0.4" strokeWidth="2" fill="none" className="steam" style={{ animationDelay: "1.1s" }} />
          <rect x="-4" y="2" width="34" height="38" rx="5" fill="#2a2160" stroke="#5b49c9" />
          <path d="M30 10 C 42 10, 42 30, 30 30" stroke="#5b49c9" strokeWidth="4" fill="none" />
          <text x="13" y="25" textAnchor="middle" fontFamily="Caveat, cursive" fontSize="12" fill="#c4b5fd">chai</text>
        </g>

        {/* keyboard */}
        <path d="M218 404 L404 404 L414 424 L208 424 Z" fill="#1c1640" stroke="#3d3290" />
        {Array.from({ length: 3 }, (_, r) =>
          Array.from({ length: 14 }, (_, c) => (
            <rect key={`${r}-${c}`} x={216 + c * 13 + r * 1.5} y={407 + r * 5.5} width="10" height="3.6" rx="0.8" fill="#2c245e" className={(r * 14 + c) % 7 === 0 ? "keypress" : undefined} style={{ animationDelay: `${((r * 14 + c) * 0.23) % 2}s` }} />
          )),
        )}

        {/* mouse */}
        <g className="mouse-move">
          <ellipse cx="604" cy="418" rx="11" ry="7" fill="#1c1640" stroke="#3d3290" />
        </g>

        {/* ---------------- Jagannath ---------------- */}
        {/* left arm: upper arm down, forearm forward to the keyboard */}
        <path d="M404 360 L 376 432 L 340 410" stroke="#d9d2c6" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M398 366 L 372 428 L 344 412" stroke="#f3eee5" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7" />
        <path d="M404 360 L 380 420" stroke="#a996ff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" transform="translate(-13 -3)" />
        {/* striped rib cuff */}
        <path d="M350 414 L 336 406" stroke="#1d2a55" strokeWidth="28" strokeLinecap="butt" />
        <path d="M352 418 L 338 410" stroke="#ece5d6" strokeWidth="2" />
        <path d="M347 410 L 333 402" stroke="#ece5d6" strokeWidth="2" />
        <g className="typing-hand">
          <ellipse cx="326" cy="404" rx="16" ry="9" fill="#9a6849" />
          {[0, 1, 2, 3].map((f) => (
            <rect key={f} x={311 + f * 6.5} y={405} width="5" height="9" rx="2.5" fill="#8d5c3f" className="finger" style={{ animationDelay: `${f * 0.11}s` }} />
          ))}
        </g>

        {/* right arm: elbow out, hand on the mouse */}
        <g className="mouse-move">
          <path d="M548 362 L 580 446 L 600 414" stroke="#a79fbb" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M552 370 L 578 438 L 596 414" stroke="#c9c1d6" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
          <path d="M596 420 L 602 408" stroke="#1d2a55" strokeWidth="28" strokeLinecap="butt" />
          <path d="M592 418 L 598 406" stroke="#ece5d6" strokeWidth="2" />
          <path d="M600 422 L 606 410" stroke="#ece5d6" strokeWidth="2" />
          <ellipse cx="606" cy="402" rx="12" ry="8" fill="#7e5038" />
        </g>

        {/* torso: navy varsity jacket, seen from behind */}
        <path d="M398 352 C 412 334, 432 322, 452 318 L 486 318 C 510 322, 534 336, 548 356 C 560 400, 566 470, 566 600 L 386 600 C 384 480, 386 400, 398 352 Z" fill="url(#jacket)" />
        {/* raglan sleeve tops */}
        <path d="M452 318 C 428 322, 408 334, 396 354 C 392 366, 392 378, 394 388 C 404 366, 420 346, 442 332 Z" fill="#e6e0d4" />
        <path d="M486 318 C 512 322, 536 338, 550 360 C 554 372, 556 382, 556 392 C 546 370, 528 348, 498 332 Z" fill="#b3abc4" />
        {/* side seams */}
        <path d="M396 388 C 392 440, 390 520, 390 600" stroke="#0f1630" strokeWidth="2" opacity="0.6" fill="none" />
        <path d="M556 392 C 560 450, 562 520, 562 600" stroke="#0f1630" strokeWidth="2" opacity="0.6" fill="none" />
        {/* screen light on the left edge */}
        <path d="M398 352 C 412 334, 432 322, 452 318" stroke="#a996ff" strokeOpacity="0.55" strokeWidth="2" fill="none" />
        {/* chenille "JP" patch on the back */}
        <text x="478" y="428" textAnchor="middle" fontFamily="Sora Variable, sans-serif" fontWeight="800" fontSize="26" fill="#ece5d6" opacity="0.85" transform="rotate(-4 478 428)">JP</text>
        <text x="478" y="428" textAnchor="middle" fontFamily="Sora Variable, sans-serif" fontWeight="800" fontSize="26" fill="none" stroke="#1f2d58" strokeWidth="0.8" transform="rotate(-4 478 428)">JP</text>

        {/* head + neck (bobs gently while he types) */}
        <g className="head-bob">
          {/* neck */}
          <path d="M440 290 L 484 290 L 488 322 L 440 322 Z" fill="#7a4d34" />
          <path d="M440 300 L 486 300" stroke="#5a3624" strokeOpacity="0.5" strokeWidth="6" />
          {/* face / skin base */}
          <ellipse cx="456" cy="254" rx="50" ry="56" fill="url(#skin)" />
          {/* lost-profile cheek lit by the monitor */}
          <path d="M413 240 C 405 254, 403 270, 408 286 C 412 296, 420 304, 430 306" stroke="#c9b8ff" strokeOpacity="0.6" strokeWidth="2" fill="none" />
          {/* stubble along the jaw + hint of moustache */}
          <path d="M408 280 C 412 296, 424 306, 440 308 L 446 300 C 432 298, 420 290, 414 276 Z" fill="#2a1a14" opacity="0.45" />
          <path d="M404 268 C 407 270, 410 270, 412 268" stroke="#1e130f" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
          {/* hair: short sides, volume swept up on top */}
          <path d="M420 244 C 410 214, 424 186, 452 176 C 472 166, 502 170, 514 192 C 524 212, 522 242, 514 264 C 508 282, 498 296, 484 304 L 454 306 C 444 292, 436 274, 432 256 C 430 250, 426 246, 420 244 Z" fill="#110d15" />
          {/* front quiff */}
          <path d="M418 228 C 408 204, 418 180, 444 170 C 460 164, 478 164, 490 170 C 470 170, 452 176, 440 190 C 452 182, 468 180, 480 184 C 460 188, 442 200, 432 220 Z" fill="#17121d" />
          {/* a few swept-back strands on top, no outline rim (it read as headphones) */}
          <path d="M432 196 C 446 186, 462 182, 478 184" stroke="#3a3150" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M440 206 C 456 196, 474 194, 490 198" stroke="#2e2740" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M426 214 C 430 204, 436 196, 444 190" stroke="#9d8cff" strokeOpacity="0.5" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {/* faded side above the ear */}
          <path d="M484 240 C 494 238, 506 246, 510 258 C 506 272, 498 284, 488 292 C 484 276, 482 256, 484 240 Z" fill="#3a2e3a" opacity="0.55" />
          {/* ear */}
          <ellipse cx="496" cy="262" rx="8" ry="14" fill="#8a573b" />
          <path d="M496 252 C 501 256, 501 268, 496 272" stroke="#5e3a26" strokeWidth="2" fill="none" />
          {/* side-burn */}
          <path d="M486 240 L 490 262" stroke="#100c14" strokeWidth="3" />
        </g>

        {/* varsity rib collar: navy with two cream stripes */}
        <path d="M436 322 C 450 312, 476 312, 492 322" stroke="#1a2650" strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d="M434 319 C 450 309, 476 309, 494 319" stroke="#ece5d6" strokeWidth="1.6" fill="none" />
        <path d="M437 325 C 452 316, 474 316, 491 325" stroke="#ece5d6" strokeWidth="1.6" fill="none" />

        {/* chair back */}
        <path d="M412 486 C 412 470, 422 462, 438 462 L 532 462 C 548 462, 556 470, 556 486 L 560 600 L 408 600 Z" fill="#1b1542" stroke="#6a57e0" strokeOpacity="0.7" strokeWidth="2" />
        <path d="M424 474 C 470 468, 500 468, 544 474" stroke="#a996ff" strokeOpacity="0.35" strokeWidth="2" fill="none" />
        
        <rect x="469" y="500" width="30" height="5" rx="2.5" fill="#7c5cff" opacity="0.7" className="twinkle" />
      </svg>
    </div>
  )
}
