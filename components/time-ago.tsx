"use client"

import { useEffect, useState } from "react"

// Shows a calendar date on the server render, then "3 hours ago" in the browser.
export default function TimeAgo({ ts }: { ts: number }) {
  const date = new Date(ts * 1000)
  const [text, setText] = useState(date.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }))
  useEffect(() => {
    const s = Math.max(0, (Date.now() - ts * 1000) / 1000)
    const units: [number, string][] = [[31536000, "year"], [2592000, "month"], [604800, "week"], [86400, "day"], [3600, "hour"], [60, "minute"]]
    for (const [sec, name] of units) {
      const n = Math.floor(s / sec)
      if (n >= 1) { setText(`${n} ${name}${n > 1 ? "s" : ""} ago`); return }
    }
    setText("just now")
  }, [ts])
  return <time dateTime={date.toISOString()}>{text}</time>
}
