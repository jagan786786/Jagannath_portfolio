"use client"

import { useEffect, useRef } from "react"

/*
  A glowing line that fills the experience timeline as the reader moves down
  it; each dot lights up once the line reaches it. Rendered inside the <ol>.
*/
export default function TimelineFill() {
  const fill = useRef<HTMLLIElement>(null)
  useEffect(() => {
    const line = fill.current
    const list = line?.parentElement
    if (!line || !list) return
    const dots = [...list.querySelectorAll<HTMLElement>("[data-dot]")]
    let raf = 0
    const apply = () => {
      raf = 0
      const r = list.getBoundingClientRect()
      const mark = window.innerHeight * 0.6
      const p = Math.min(1, Math.max(0, (mark - r.top) / r.height))
      line.style.transform = `scaleY(${p})`
      dots.forEach((d) => d.classList.toggle("lit", d.getBoundingClientRect().top < mark))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf) }
  }, [])
  return (
    <li
      ref={fill}
      aria-hidden
      className="pointer-events-none absolute -left-px top-0 h-full w-0.5 origin-top scale-y-0 rounded-full bg-gradient-to-b from-violet-soft to-violet shadow-[0_0_12px_rgba(124,92,255,0.7)]"
      style={{ marginTop: 0 }}
    />
  )
}
