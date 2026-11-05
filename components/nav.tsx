"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, Menu, X } from "lucide-react"

const items = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
]

export default function Nav({ name, initials, linkedin }: { name: string; initials: string; linkedin: string }) {
  const [active, setActive] = useState("home")
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // header tightens after the first bit of scroll; the progress line tracks the whole page
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    )
    items.forEach((i) => { const el = document.getElementById(i.id); if (el) io.observe(el) })
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect() }
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${scrolled || open ? "border-line bg-night/70 backdrop-blur-xl backdrop-saturate-150" : "border-transparent"}`}
    >
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-[height] duration-300 ${scrolled ? "h-14" : "h-16"}`}>
        <a href="#home" className="flex items-center gap-2.5 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet to-violet-deep text-xs font-extrabold text-white shadow-glow">
            {initials}
          </span>
          {name}
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex gap-7 text-sm">
            {items.map((i) => (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
                  aria-current={active === i.id ? "true" : undefined}
                  className={active === i.id ? "text-violet-soft" : "text-muted hover:text-ink"}
                >
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="btn-primary hidden !rounded-full !px-4 !py-2 md:inline-flex">
          Let&apos;s Connect <ArrowRight size={15} aria-hidden />
        </a>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-muted hover:text-ink md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* reading progress */}
      <div ref={bar} aria-hidden className="absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-gradient-to-r from-violet to-violet-soft" />

      {open && (
        <nav aria-label="Sections" className="border-t border-line px-5 pb-5 md:hidden">
          <ul className="grid gap-1 pt-3">
            {items.map((i) => (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 ${active === i.id ? "bg-violet/10 text-violet-soft" : "text-muted"}`}
                >
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
