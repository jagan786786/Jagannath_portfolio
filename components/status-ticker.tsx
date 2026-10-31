"use client"

import { useEffect, useState } from "react"

// Types each line, holds it, then moves on. Used for the "// now" card in the hero.
export default function StatusTicker({ lines }: { lines: string[] }) {
  const [i, setI] = useState(0)
  const [n, setN] = useState(0)
  useEffect(() => {
    const full = lines[i]
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(full.length)
      const t = setTimeout(() => setI((x) => (x + 1) % lines.length), 3500)
      return () => clearTimeout(t)
    }
    setN(0)
    let k = 0
    let hold: ReturnType<typeof setTimeout>
    const id = setInterval(() => {
      k++
      setN(k)
      if (k >= full.length) { clearInterval(id); hold = setTimeout(() => setI((x) => (x + 1) % lines.length), 2200) }
    }, 36)
    return () => { clearInterval(id); clearTimeout(hold) }
  }, [i, lines])
  return (
    <span className="font-mono text-[13px] text-ink" aria-live="polite">
      {lines[i].slice(0, n)}
      <span aria-hidden className="caret ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-violet-soft" />
    </span>
  )
}
