"use client"

import { useEffect, useState } from "react"

// Types the text once on load, then leaves a blinking caret.
export default function Typed({ text }: { text: string }) {
  const [n, setN] = useState(text.length)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    setN(0)
    let i = 0
    const id = setInterval(() => { i++; setN(i); if (i >= text.length) clearInterval(id) }, 70)
    return () => clearInterval(id)
  }, [text])
  return (
    <span>
      <span aria-label={text}>{text.slice(0, n)}</span>
      <span aria-hidden className="caret ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-violet-soft" />
    </span>
  )
}
