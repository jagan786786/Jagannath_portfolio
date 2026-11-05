"use client"

import { useEffect } from "react"
import Lenis from "lenis"

/*
  Momentum ("inertia") scrolling for the whole page, plus smooth gliding for
  in-page links such as #projects. Turned off for people who ask their system
  for reduced motion; the page then scrolls natively.
*/
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9 })
    let raf = 0
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    // in-page links glide to their section, leaving room for the fixed header
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute("href")!
      const el = id === "#" ? null : document.querySelector<HTMLElement>(id)
      if (!el) return
      e.preventDefault()
      lenis.scrollTo(el, { offset: -56, duration: 1.2 })
      history.replaceState(null, "", id)
    }
    document.addEventListener("click", onClick)

    return () => { cancelAnimationFrame(raf); document.removeEventListener("click", onClick); lenis.destroy() }
  }, [])
  return null
}
