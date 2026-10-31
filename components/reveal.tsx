"use client"

import { useEffect } from "react"

// Adds the "in" class to .reveal elements as they scroll into view.
// Content stays visible if JavaScript never runs.
export default function Reveal() {
  useEffect(() => {
    document.documentElement.classList.add("js")
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target) } }),
      { rootMargin: "0px 0px -10% 0px" },
    )
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}
