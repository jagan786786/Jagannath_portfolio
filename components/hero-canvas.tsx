"use client"

import { useEffect, useRef } from "react"

// Ambient hero art: drifting particles over a glowing planet whose surface is
// linked by arcs, like requests hopping between nodes in a network.
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext("2d")!
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true

    type P = { x: number; y: number; r: number; vx: number; vy: number; a: number }
    let stars: P[] = []
    type Arc = { a: number; b: number; t: number; speed: number }
    let arcs: Arc[] = []

    const rand = (min: number, max: number) => min + Math.random() * (max - min)

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round((w * h) / 9000)
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: rand(0.3, 1.4),
        vx: rand(-0.05, 0.05), vy: rand(-0.04, 0.02), a: rand(0.15, 0.7),
      }))
      arcs = Array.from({ length: 9 }, () => newArc())
    }

    function newArc(): Arc {
      return { a: rand(0.05, 0.95), b: rand(0.05, 0.95), t: Math.random(), speed: rand(0.002, 0.005) }
    }

    function planet() {
      const R = Math.max(w * 0.55, 520)
      return { cx: w * 0.82, cy: h + R * 0.62, R }
    }

    // Point on the visible rim of the planet, parameterised 0..1 across the top.
    function rim(u: number) {
      const { cx, cy, R } = planet()
      const ang = Math.PI * (1.12 + u * 0.76)
      return { x: cx + Math.cos(ang) * R * 0.96, y: cy + Math.sin(ang) * R * 0.96 }
    }

    function draw(time: number) {
      ctx.clearRect(0, 0, w, h)

      // Violet haze
      const g = ctx.createRadialGradient(w * 0.78, h * 0.35, 0, w * 0.78, h * 0.35, Math.max(w, h) * 0.7)
      g.addColorStop(0, "rgba(90,60,220,0.20)")
      g.addColorStop(1, "rgba(5,3,13,0)")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      for (const s of stars) {
        if (!reduce) {
          s.x += s.vx; s.y += s.vy
          if (s.x < 0) s.x = w; if (s.x > w) s.x = 0
          if (s.y < 0) s.y = h; if (s.y > h) s.y = 0
        }
        const tw = 0.6 + 0.4 * Math.sin(time / 900 + s.x)
        ctx.fillStyle = `rgba(200,190,255,${s.a * tw})`
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill()
      }

      // Planet body
      const { cx, cy, R } = planet()
      const body = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.9, R * 0.1, cx, cy, R)
      body.addColorStop(0, "rgba(40,30,110,0.9)")
      body.addColorStop(0.6, "rgba(12,9,40,0.95)")
      body.addColorStop(1, "rgba(5,3,13,1)")
      ctx.fillStyle = body
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill()

      // Atmosphere rim
      ctx.save()
      ctx.shadowColor = "rgba(140,110,255,0.9)"
      ctx.shadowBlur = 40
      ctx.strokeStyle = "rgba(150,125,255,0.65)"
      ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke()
      ctx.restore()

      // Latitude lines
      ctx.strokeStyle = "rgba(140,120,255,0.08)"
      ctx.lineWidth = 1
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath()
        ctx.ellipse(cx, cy - R + R * 0.22 * i, R * Math.sqrt(1 - Math.pow(1 - 0.22 * i, 2)) * 1.0, R * 0.06 * i, 0, Math.PI, Math.PI * 2)
        ctx.stroke()
      }

      // Network arcs with a travelling pulse
      for (const arc of arcs) {
        const p1 = rim(arc.a), p2 = rim(arc.b)
        const mx = (p1.x + p2.x) / 2, my = Math.min(p1.y, p2.y) - Math.abs(p1.x - p2.x) * 0.45 - 30
        ctx.strokeStyle = "rgba(120,200,255,0.18)"
        ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.quadraticCurveTo(mx, my, p2.x, p2.y); ctx.stroke()

        const t = arc.t
        const x = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * mx + t * t * p2.x
        const y = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * my + t * t * p2.y
        ctx.save()
        ctx.shadowColor = "rgba(150,220,255,1)"
        ctx.shadowBlur = 12
        ctx.fillStyle = "rgba(200,240,255,0.95)"
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill()
        ctx.restore()

        for (const p of [p1, p2]) {
          ctx.fillStyle = "rgba(190,170,255,0.8)"
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill()
        }
        if (!reduce) {
          arc.t += arc.speed
          if (arc.t > 1) Object.assign(arc, newArc(), { t: 0 })
        }
      }

      if (!reduce && visible) raf = requestAnimationFrame(draw)
    }

    resize()
    raf = requestAnimationFrame(draw)
    const ro = new ResizeObserver(() => { resize(); if (reduce) draw(0) })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(raf)
      if (visible && !reduce) raf = requestAnimationFrame(draw)
    })
    io.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect() }
  }, [])

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />
}
