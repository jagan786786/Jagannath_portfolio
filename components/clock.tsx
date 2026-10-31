"use client"

import { useEffect, useState } from "react"

export default function Clock({ timezone }: { timezone: string }) {
  const [now, setNow] = useState<string>("")
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", { timeZone: timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [timezone])
  return (
    <span className="rounded-md border border-line bg-white/[0.03] px-2 py-1 font-mono text-xs tabular-nums text-muted">
      IST {now || "--:--:--"}
    </span>
  )
}
