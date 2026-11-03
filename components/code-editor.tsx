"use client"

import type { TypingState } from "@/lib/human-typing"

/* A tiny VS Code-style editor drawn in a 300 x 198 SVG box. */

const C = { kw: "#c4b5fd", str: "#86efac", fn: "#67e8f9", dec: "#f9a8d4", num: "#fcd34d", com: "#6b6890", txt: "#dcd8f0" }

type Seg = [string, string]
function highlight(line: string): Seg[] {
  // strings are matched even when still open, so they colour as they are typed
  const re = /("""[^"]*(?:"""|$)|"[^"]*(?:"|$)|'[^']*(?:'|$))|(#.*$)|(@[\w.]+)|\b(from|import|def|return|for|in|assert|print|await|async|class|if|else)\b|(\b\w+(?=\())|(\b\d+(?:\.\d+)?\b)/g
  const out: Seg[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) {
    if (m[0] === "") { re.lastIndex++; continue }
    if (m.index > last) out.push([line.slice(last, m.index), C.txt])
    out.push([m[0], m[1] ? C.str : m[2] ? C.com : m[3] ? C.dec : m[4] ? C.kw : m[5] ? C.fn : C.num])
    last = m.index + m[0].length
  }
  if (last < line.length) out.push([line.slice(last), C.txt])
  return out
}

// Other plausible entries for the autocomplete list.
const POOL = ["search_docs", "retrieve", "return", "result", "requests", "parametrize", "params", "print", "question", "queries", "expected", "export", "sources", "source_id", "import", "importlib", "passages", "agents", "Agent"]

const FS = 7.4
const CW = FS * 0.6
const LH = 11.6
const X = 68
const TOP = 32
const VISIBLE = 11

export default function CodeEditor({ s, files = ["agent.py", "evals.py"] }: { s: TypingState; files?: string[] }) {
  const full = s.doc + s.closers
  const lines = full.split("\n")
  const before = s.doc.split("\n")
  const curLine = before.length - 1
  const curCol = before[curLine].length
  const offset = Math.max(0, curLine - (VISIBLE - 2))
  const cx = X + curCol * CW
  const cy = TOP + (curLine - offset) * LH

  const options = s.suggest
    ? [s.suggest.word, ...POOL.filter((w) => w !== s.suggest!.word && w.toLowerCase().startsWith(s.suggest!.word.slice(0, s.suggest!.typed).toLowerCase()))].slice(0, 3)
    : []

  return (
    <>
      <rect width="300" height="198" fill="#0a0919" />
      {/* title bar + tabs */}
      <rect width="300" height="12" fill="#14112e" />
      <circle cx="8" cy="6" r="2" fill="#ff5f57" /><circle cx="15" cy="6" r="2" fill="#febc2e" /><circle cx="22" cy="6" r="2" fill="#28c840" />
      <rect x="38" y="1" width="56" height="11" fill="#0a0919" />
      <rect x="38" y="1" width="56" height="1" fill="#8f7bff" />
      <text x="44" y="9" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="#e9e4ff">{s.file}</text>
      {s.dirty ? <circle cx="88" cy="6.5" r="1.8" fill="#e9e4ff" /> : <text x="86" y="9" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="#6f6a98">×</text>}
      {files.filter((f) => f !== s.file).map((f, i) => (
        <text key={f} x={102 + i * 50} y="9" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="#6f6a98">{f}</text>
      ))}

      {/* explorer */}
      <rect y="12" width="46" height="186" fill="#0f0d24" />
      {["src/", "agent.py", "rag.py", "tools.py", "evals.py", "evals/", "README.md"].map((f, i) => (
        <g key={f}>
          {f === s.file && <rect x="0" y={18 + i * 10} width="46" height="9" fill="#1e1a44" />}
          <text x={f.endsWith("/") ? 5 : 10} y={24 + i * 10} fontFamily="JetBrains Mono, monospace" fontSize="5.4" fill={f === s.file ? "#e9e4ff" : "#625d8c"}>{f}</text>
        </g>
      ))}

      {/* code */}
      <clipPath id="ce-clip"><rect x="46" y="14" width="254" height="146" /></clipPath>
      <g clipPath="url(#ce-clip)" fontFamily="JetBrains Mono, monospace" fontSize={FS}>
        {s.phase === "edit" && <rect x="46" y={cy - FS - 1.5} width="254" height={LH} fill="#ffffff" opacity="0.04" />}
        {lines.slice(offset, offset + VISIBLE + 1).map((l, k) => {
          const i = k + offset
          return (
            <g key={i}>
              <text x={X - 8} y={TOP + k * LH} fill={i === curLine ? "#a59ccf" : "#3f3a6b"} textAnchor="end" fontSize="6">{i + 1}</text>
              <text x={X} y={TOP + k * LH} xmlSpace="preserve">{highlight(l).map(([t, c], j) => <tspan key={j} fill={c}>{t}</tspan>)}</text>
            </g>
          )
        })}
        {/* cursor: solid while keys are going, blinking when he stops */}
        {s.phase === "edit" && <rect x={cx + 0.3} y={cy - FS + 1} width="1.1" height={FS + 1} fill="#e9e4ff" className={s.idle ? "caret" : undefined} />}
      </g>

      {/* autocomplete popup */}
      {options.length > 0 && (
        <g fontFamily="JetBrains Mono, monospace" fontSize="6">
          <rect x={cx - 2} y={cy + 3} width="78" height={options.length * 9 + 3} rx="1.5" fill="#1b1838" stroke="#3d3580" strokeWidth="0.6" />
          {options.map((w, i) => (
            <g key={w}>
              {i === 0 && <rect x={cx - 1.4} y={cy + 4.2 + i * 9} width="76.8" height="8.6" fill="#2f2a6b" />}
              <text x={cx + 2} y={cy + 10.6 + i * 9} fill="#8f7bff">ƒ</text>
              <text x={cx + 8} y={cy + 10.6 + i * 9} fill={i === 0 ? "#ffffff" : "#b9b3dc"}>
                <tspan fontWeight="700" fill="#a996ff">{w.slice(0, s.suggest!.typed)}</tspan>{w.slice(s.suggest!.typed)}
              </text>
            </g>
          ))}
        </g>
      )}

      {/* status bar */}
      <rect y="160" width="300" height="8" fill="#5b3df5" opacity="0.85" />
      <text x="50" y="166" fontFamily="JetBrains Mono, monospace" fontSize="5" fill="#f1edff">{`Ln ${curLine + 1}, Col ${curCol + 1}`}</text>
      <text x="294" y="166" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="5" fill="#f1edff">{s.dirty ? "● unsaved" : "saved"}  ·  Python 3.12</text>

      {/* terminal */}
      <rect x="0" y="168" width="300" height="30" fill="#07061a" />
      <text x="6" y="176" fontFamily="JetBrains Mono, monospace" fontSize="5" fill="#5f5a8a">TERMINAL</text>
      <text x="6" y="185" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="#8f89c0" xmlSpace="preserve">
        <tspan fill="#34d399">jagannath</tspan><tspan fill="#8f89c0">:~/agent$ </tspan><tspan fill="#e9e4ff">{s.phase === "edit" ? "" : s.term}</tspan>
      </text>
      {(s.phase === "edit" || s.phase === "term") && (
        <rect x={6 + (19 + (s.phase === "term" ? s.term.length : 0)) * 3.6} y="179.6" width="3" height="6.4" fill="#e9e4ff" className={s.phase === "edit" ? "caret" : undefined} opacity={s.phase === "edit" ? 0.5 : 1} />
      )}
      {s.phase === "running" && <text x="6" y="194" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="#fcd34d">running…</text>}
      {s.phase === "done" && <text x="6" y="194" fontFamily="JetBrains Mono, monospace" fontSize="6.2" fill="#34d399">{s.result}</text>}
    </>
  )
}
