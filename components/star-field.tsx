"use client"

import { useEffect, useRef } from "react"

/*
  A quiet 3D star field fixed behind the whole page. Stars drift toward the
  viewer; scrolling pushes you through them (faster scroll, longer streaks),
  and the field leans slightly toward the cursor. Pauses when the tab is
  hidden; drawn once, still, for people who prefer reduced motion.
*/
export default function StarField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext("2d")!
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const small = window.matchMedia("(max-width: 767px)").matches
    const N = small ? 180 : 420
    let w = 0, h = 0, dpr = 1
    type Star = { x: number; y: number; z: number; px: number; py: number; hue: number }
    const stars: Star[] = []
    const spawn = (s: Partial<Star> = {}, far = false): Star => ({
      x: (Math.random() - 0.5) * 2.4, y: (Math.random() - 0.5) * 2.4,
      z: far ? 1 : 0.05 + Math.random() * 0.95, px: NaN, py: NaN, hue: Math.random(), ...s,
    })
    for (let i = 0; i < N; i++) stars.push(spawn())

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    let mx = 0, my = 0, cx = 0, cy = 0
    const onMove = (e: PointerEvent) => { mx = (e.clientX / w - 0.5) * 2; my = (e.clientY / h - 0.5) * 2 }
    window.addEventListener("pointermove", onMove, { passive: true })

    let lastY = window.scrollY, vel = 0, prev = performance.now(), raf = 0, running = true
    const draw = (dtSec: number) => {
      const y = window.scrollY
      const dy = y - lastY
      lastY = y
      // smoothed scroll speed (px per second), either direction
      vel += (Math.abs(dy) / Math.max(dtSec, 0.001) - vel) * 0.12
      const speed = 0.035 + Math.min(vel, 4000) / 4000 * 0.9
      cx += (mx - cx) * 0.04; cy += (my - cy) * 0.04
      const ox = w / 2 - cx * 30, oy = h / 2 - cy * 22
      const f = Math.max(w, h) * 0.5

      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        s.z -= speed * dtSec * (dy < 0 ? -0.6 : 1) // scrolling up pulls the field back
        if (s.z < 0.03) Object.assign(s, spawn({}, true))
        if (s.z > 1) Object.assign(s, spawn({ z: 0.04 }))
        const sx = ox + (s.x / s.z) * f * 0.5
        const sy = oy + (s.y / s.z) * f * 0.5
        if (sx < -50 || sx > w + 50 || sy < -50 || sy > h + 50) { Object.assign(s, spawn({}, true)); s.px = NaN; continue }
        const near = 1 - s.z
        const a = Math.min(1, near * 1.2) * 0.75
        const col = s.hue < 0.65 ? `rgba(214,206,255,${a})` : `rgba(150,128,255,${a})`
        if (!Number.isNaN(s.px) && vel > 250) {
          ctx.strokeStyle = col
          ctx.lineWidth = Math.max(0.6, near * 1.8)
          ctx.beginPath(); ctx.moveTo(s.px, s.py); ctx.lineTo(sx, sy); ctx.stroke()
        } else {
          ctx.fillStyle = col
          ctx.beginPath(); ctx.arc(sx, sy, Math.max(0.35, near * 1.5), 0, Math.PI * 2); ctx.fill()
        }
        s.px = sx; s.py = sy
      }
    }

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      if (running) draw(dt)
      raf = requestAnimationFrame(loop)
    }
    const onVis = () => { running = !document.hidden; prev = performance.now() }
    document.addEventListener("visibilitychange", onVis)
    if (reduce) draw(0)
    else raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
}
