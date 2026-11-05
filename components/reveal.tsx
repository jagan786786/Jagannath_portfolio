"use client"

import { useEffect } from "react"

/*
  Adds the "in" class to .reveal blocks as they scroll into view. Blocks that
  arrive together are staggered top-to-bottom, so a section unfolds as one
  orchestrated move rather than everything popping at once.
  Content stays visible if JavaScript never runs.
*/
export default function Reveal() {
  useEffect(() => {
    document.documentElement.classList.add("js")
    const io = new IntersectionObserver(
      (entries) => {
        const arriving = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement)
        arriving
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.getBoundingClientRect().left - b.getBoundingClientRect().left)
          .forEach((el, i) => {
            el.style.transitionDelay = `${Math.min(i, 4) * 90}ms`
            el.classList.add("in")
            io.unobserve(el)
          })
      },
      { rootMargin: "0px 0px -12% 0px" },
    )
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}
