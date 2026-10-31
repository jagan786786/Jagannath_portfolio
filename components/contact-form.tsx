"use client"

import { useState, type FormEvent } from "react"

type Status = "idle" | "sending" | "sent" | "error"

const field =
  "mt-1.5 block w-full rounded-md border border-rule bg-transparent px-3 py-2.5 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"

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
      <p role="status" className="rounded-md border border-rule p-5 text-ink">
        Message sent. Jagannath usually replies within a couple of days.{" "}
        <button type="button" onClick={() => setStatus("idle")} className="text-accent underline underline-offset-4">
          Send another
        </button>
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm text-muted">
        Name
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="text-sm text-muted">
        Email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="text-sm text-muted sm:col-span-2">
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
      <label className="text-sm text-muted sm:col-span-2">
        Message
        <textarea name="message" required rows={5} className={`${field} resize-y`} />
      </label>
      {/* Honeypot: bots fill it, people never see it. */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" />
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-accent px-5 py-2.5 font-medium text-on-accent hover:bg-accent/90 disabled:opacity-60"
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
