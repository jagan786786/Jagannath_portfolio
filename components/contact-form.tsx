"use client"

import { useState, type FormEvent } from "react"

type Status = "idle" | "sending" | "sent" | "error"

const field =
  "mt-2 block w-full rounded-xl border border-line bg-night/60 px-4 py-3 text-ink placeholder:text-muted/50 focus:border-violet/60 focus:outline-none focus:ring-2 focus:ring-violet/30"

export default function ContactForm({ endpoint }: { endpoint: string }) {
  const [status, setStatus] = useState<Status>("idle")

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus("sending")
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="rounded-xl border border-violet/30 bg-violet/10 p-5 text-ink">
        Message sent. Jagannath usually replies within a couple of days.{" "}
        <button type="button" onClick={() => setStatus("idle")} className="text-violet-soft underline underline-offset-4">
          Send another
        </button>
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium text-ink">
        Name
        <input name="name" required autoComplete="name" placeholder="Your name" className={field} />
      </label>
      <label className="text-sm font-medium text-ink">
        Email
        <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={field} />
      </label>
      <label className="text-sm font-medium text-ink sm:col-span-2">
        What it&apos;s about
        <select name="subject" required defaultValue="" className={field}>
          <option value="" disabled>
            Choose one
          </option>
          <option>AI engineering role</option>
          <option>Freelance or contract work</option>
          <option>Collaboration</option>
          <option>Something else</option>
        </select>
      </label>
      <label className="text-sm font-medium text-ink sm:col-span-2">
        Message
        <textarea name="message" required rows={5} placeholder="Tell me about the role or project" className={`${field} resize-y`} />
      </label>
      {/* Honeypot: bots fill it, people never see it. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        {status === "error" && (
          <p role="alert" className="text-sm text-ink">
            The message didn&apos;t go through. Try again, or email directly.
          </p>
        )}
      </div>
    </form>
  )
}
