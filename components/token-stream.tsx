"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type Token = { text: string; p: number }

// Cheap, deterministic string hash so every visitor sees the same "probabilities".
function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return (h >>> 0) / 4294967295
}

// Split text roughly the way a BPE tokenizer would: words carry their leading
// space, punctuation is its own token, long words break into sub-word pieces.
function tokenize(text: string): Token[] {
  const raw = text.match(/ ?[A-Za-z\-]+| ?\d+|[^\sA-Za-z\d]/g) ?? []
  const out: Token[] = []
  raw.forEach((word, wi) => {
    const bare = word.trim()
    if (bare.length > 8) {
      const cut = Math.ceil(word.length / 2)
      out.push({ text: word.slice(0, cut), p: 0.35 + hash(word + wi) * 0.45 })
      out.push({ text: word.slice(cut), p: 0.9 + hash(word) * 0.09 })
    } else if (/^[^\sA-Za-z\d]$/.test(bare)) {
      out.push({ text: word, p: 0.92 + hash(word + wi) * 0.07 })
    } else {
      const base = bare.length <= 3 ? 0.82 : 0.45
      out.push({ text: word, p: Math.min(0.99, base + hash(word + wi) * (1 - base)) })
    }
  })
  return out
}

export default function TokenStream({ prompt, answer }: { prompt: string; answer: string }) {
  const tokens = useMemo(() => tokenize(answer), [answer])
  const [shown, setShown] = useState(0)
  const [heat, setHeat] = useState(true)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const timer = useRef<number>()

  const run = useCallback(() => {
    window.clearInterval(timer.current)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setShown(tokens.length)
      setElapsed(0)
      return
    }
    setShown(0)
    setElapsed(null)
    const start = performance.now()
    let i = 0
    timer.current = window.setInterval(() => {
      // Bursty, like a real stream: occasionally emit two tokens per tick.
      i += hash(String(i)) > 0.75 ? 2 : 1
      if (i >= tokens.length) {
        i = tokens.length
        window.clearInterval(timer.current)
        setElapsed((performance.now() - start) / 1000)
      }
      setShown(i)
    }, 38)
  }, [tokens])

  useEffect(() => {
    const t = window.setTimeout(run, 450)
    return () => {
      window.clearTimeout(t)
      window.clearInterval(timer.current)
    }
  }, [run])

  const done = shown >= tokens.length

  return (
    <div>
      <p className="font-mono text-sm text-muted">
        <span aria-hidden className="select-none text-accent">
          &gt;{" "}
        </span>
        {prompt}
      </p>

      {/* Full text for screen readers and crawlers; the animated copy is decorative. */}
      <p className="sr-only">{answer}</p>

      <p
        aria-hidden
        className="mt-5 max-w-prose font-display text-[1.45rem] leading-[1.45] tracking-[-0.01em] text-ink sm:text-[1.7rem]"
      >
        {tokens.slice(0, shown).map((t, i) => {
          // Keep the leading space outside the highlight so line ends stay clean.
          const lead = t.text.startsWith(" ") ? " " : ""
          return (
            <span key={i} className="whitespace-pre-wrap">
              {lead}
              <span
                className="token rounded-[3px]"
                style={heat && t.p < 0.8 ? { backgroundColor: `rgb(var(--heat) / ${(((0.8 - t.p) / 0.45) * 0.55).toFixed(2)})` } : undefined}
              >
                {t.text.slice(lead.length)}
              </span>
            </span>
          )
        })}
        {!done && <span className="caret" />}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted">
        <span className="tabular-nums">
          {done && elapsed !== null
            ? `${tokens.length} tokens${elapsed > 0 ? ` in ${elapsed.toFixed(1)}s` : ""}`
            : `${shown} / ${tokens.length} tokens`}
        </span>
        <button
          type="button"
          onClick={() => setHeat((h) => !h)}
          aria-pressed={heat}
          className="underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-ink"
        >
          {heat ? "Hide" : "Show"} token confidence
        </button>
        <button
          type="button"
          onClick={run}
          className="underline decoration-rule underline-offset-4 hover:text-ink hover:decoration-ink"
        >
          Regenerate
        </button>
      </div>
    </div>
  )
}
