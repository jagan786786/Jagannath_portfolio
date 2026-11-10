"use client"

import { useEffect, useRef, useState } from "react"

/*
  Counts a figure up from zero the first time it scrolls into view, keeping its
  prefix/suffix and decimals ("30+", "8.4"). Words like "Always" show as is.
*/
export default function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const m = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/)
  const [text, setText] = useState(value)
  const el = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!m || !el.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const [, pre, num, post] = m
    const target = parseFloat(num)
    const decimals = num.includes(".") ? num.split(".")[1].length : 0
    setText(`${pre}${(0).toFixed(decimals)}${post}`)
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / duration)
        const eased = 1 - Math.pow(1 - k, 3)
        setText(`${pre}${(target * eased).toFixed(decimals)}${post}`)
        if (k < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(el.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration])

  return (
    <span ref={el} className="tabular-nums" aria-label={value}>
      {text}
    </span>
  )
}
