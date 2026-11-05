"use client"

import { useEffect } from "react"

/*
  As the visitor scrolls past the hero, the photo drifts down slowly and zooms a
  touch while fading, and the text lifts away a little faster — a calm hand-off
  into the next section instead of a hard cut.
*/
export default function HeroScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const hero = document.getElementById("home")
    const stage = hero?.querySelector<HTMLElement>(".hero-photo")
    const copy = hero?.querySelector<HTMLElement>("[data-hero-copy]")
    if (!hero || !copy) return
    let raf = 0
    const apply = () => {
      raf = 0
      const h = hero.offsetHeight || window.innerHeight
      const t = Math.min(1, Math.max(0, window.scrollY / h))
      if (stage) {
        stage.style.transform = `translate3d(0, ${t * h * 0.16}px, 0) scale(${1 + t * 0.05})`
        stage.style.opacity = String(1 - t * 0.65)
      }
      copy.style.transform = `translate3d(0, ${-t * 70}px, 0)`
      copy.style.opacity = String(Math.max(0, 1 - t * 1.4))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }
    apply()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf) }
  }, [])
  return null
}
