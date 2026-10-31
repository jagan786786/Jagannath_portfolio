"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

export type QA = { q: string; a: string; jump?: string }

type Msg = { from: "bot" | "you"; text: string }

// Floating "Ask J-Bot" helper. Canned answers built from the portfolio data,
// so it never makes anything up.
export default function Assistant({ greeting, qa }: { greeting: string; qa: QA[] }) {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: greeting }])
  const [busy, setBusy] = useState(false)
  const log = useRef<HTMLDivElement>(null)

  // Scroll only the message list, never the page behind it.
  useEffect(() => { const el = log.current; if (el) el.scrollTop = el.scrollHeight }, [msgs, open])

  function ask(item: QA) {
    if (busy) return
    setBusy(true)
    setMsgs((m) => [...m, { from: "you", text: item.q }, { from: "bot", text: "" }])
    let i = 0
    const id = setInterval(() => {
      i += 2
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = { from: "bot", text: item.a.slice(0, i) }; return c })
      if (i >= item.a.length) {
        clearInterval(id)
        setBusy(false)
        if (item.jump) setTimeout(() => document.getElementById(item.jump!)?.scrollIntoView({ behavior: "smooth" }), 500)
      }
    }, 16)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {open && (
        <div role="dialog" aria-label="Ask J-Bot" className="pop-in flex h-[460px] max-h-[70vh] w-[min(360px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-violet/30 bg-panel/95 shadow-glow backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-2.5">
              <BotFace className="h-8 w-8" />
              <div>
                <p className="text-sm font-semibold">J-Bot</p>
                <p className="flex items-center gap-1.5 text-[11px] text-mint"><span className="h-1.5 w-1.5 rounded-full bg-mint" /> Knows Jagannath&apos;s work</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-lg p-1.5 text-muted hover:bg-white/5 hover:text-ink"><X size={18} /></button>
          </div>

          <div ref={log} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.from === "you" ? "flex justify-end" : "flex"}>
                <p className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 leading-relaxed ${m.from === "you" ? "rounded-br-sm bg-violet text-white" : "rounded-bl-sm border border-line bg-white/[0.04] text-ink"}`}>
                  {m.text || <span className="inline-flex gap-1"><Dot d="0s" /><Dot d=".15s" /><Dot d=".3s" /></span>}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-line p-3">
            {qa.map((item) => (
              <button key={item.q} type="button" disabled={busy} onClick={() => ask(item)} className="rounded-full border border-violet/30 bg-violet/10 px-3 py-1.5 text-xs text-violet-soft transition hover:bg-violet/20 disabled:opacity-50">
                {item.q}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close J-Bot" : "Ask J-Bot about Jagannath"}
        className="group flex items-center gap-2 rounded-full border border-violet/40 bg-[#120b2e] py-2 pl-2 pr-4 text-sm font-semibold text-white shadow-glow transition hover:bg-[#1a1040]"
      >
        <BotFace className="h-9 w-9 transition group-hover:rotate-[-8deg]" />
        {open ? "Close" : "Ask J-Bot"}
      </button>
    </div>
  )
}

function Dot({ d }: { d: string }) {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-soft" style={{ animationDelay: d }} />
}

function BotFace({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <line x1="20" y1="6" x2="20" y2="2" stroke="#a996ff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="2.5" r="2.5" fill="#7c5cff" className="antenna" />
      <rect x="4" y="7" width="32" height="28" rx="10" fill="#2b2366" stroke="#a996ff" strokeWidth="1.5" />
      <rect x="9" y="13" width="22" height="14" rx="6" fill="#05030d" />
      <circle cx="15" cy="20" r="3" fill="#67e8f9" />
      <circle cx="25" cy="20" r="3" fill="#67e8f9" />
    </svg>
  )
}
