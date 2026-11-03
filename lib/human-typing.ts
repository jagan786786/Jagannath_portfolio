"use client"

import { useEffect, useRef, useState } from "react"

/*
  A small typing simulator that behaves like a person in an editor:
  - uneven key timing (slower on Shift keys, symbols and after spaces)
  - typos that get noticed a couple of keys later and backspaced
  - editor autocomplete: types a few letters, a suggestion pops up, Tab
  - auto-closed brackets the typist then types "over"
  - auto-indent after Enter, short pauses at line ends, long "thinking"
    pauses between blocks of code
  - Ctrl+S to save, then the run command typed into the terminal
  Every key reports which hand pressed it, so the figure can move with it.
*/

export type Snippet = { file: string; code: string; run: string; result: string }

export const SNIPPETS: Snippet[] = [
  {
    file: "agent.py",
    code: `from agents import Agent, tool
from rag import retrieve

@tool
def search_docs(query: str):
    """Find passages that answer it."""
    return retrieve(query, k=6)

agent = Agent(model="gemini-flash",
              tools=[search_docs])

answer = agent.run("Why did the build fail?")
print(answer.cited())`,
    run: "python agent.py",
    result: "✓ grounded answer · 3 sources",
  },
  {
    file: "evals.py",
    code: `import pytest
from agent import agent

CASES = load("evals/questions.jsonl")

@pytest.mark.parametrize("case", CASES)
def test_answer_is_grounded(case):
    out = agent.run(case.question)
    assert out.sources, "no citations"
    assert judge(out, case.expected) > 0.8`,
    run: "pytest evals/ -q",
    result: "✓ 24 passed in 3.1s",
  },
]

// Words the editor would offer to complete even before they appear in the file.
const KNOWN = new Set(["import", "retrieve", "parametrize", "question", "expected", "sources", "passages", "print", "return", "assert", "search_docs", "agents"])

type Hand = "L" | "R"
type Action =
  | { k: "type"; ch: string; d: number }
  | { k: "over"; ch: string; d: number }
  | { k: "back"; d: number }
  | { k: "enter"; indent: string; d: number }
  | { k: "suggest"; word: string; typed: number; d: number }
  | { k: "complete"; text: string; d: number }
  | { k: "pause"; d: number; think?: boolean }
  | { k: "save"; d: number }
  | { k: "term"; ch: string; d: number }
  | { k: "termEnter"; d: number }
  | { k: "run"; d: number }
  | { k: "done"; d: number }

const LEFT = new Set("`12345qwertasdfgzxcvb~!@#$%QWERTASDFGZXCVB\t")
export function handFor(ch: string): Hand {
  if (ch === " ") return Math.random() < 0.5 ? "L" : "R"
  return LEFT.has(ch) ? "L" : "R"
}

const SHIFTED = new Set('~!@#$%^&*()_+{}|:"<>?')
const NEIGHBORS: Record<string, string> = {
  a: "sq", b: "vn", c: "xv", d: "sf", e: "wr", f: "dg", g: "fh", h: "gj", i: "uo", j: "hk", k: "jl", l: "ko", m: "nj",
  n: "bm", o: "ip", p: "ol", q: "wa", r: "et", s: "ad", t: "ry", u: "yi", v: "cb", w: "qe", x: "zc", y: "tu", z: "xa",
}

// Rough log-normal noise around a median, the shape real inter-key timings have.
function lognorm(median: number, spread = 0.35) {
  const u = Math.random() || 1e-6, v = Math.random() || 1e-6
  const n = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  return median * Math.exp(n * spread)
}
const rand = (a: number, b: number) => a + Math.random() * (b - a)

function keyDelay(ch: string, prev: string) {
  let d = lognorm(105)
  if (/[A-Z]/.test(ch) || SHIFTED.has(ch)) d += rand(40, 95)
  if (/\d/.test(ch)) d += rand(20, 60)
  if (prev === " ") d += rand(10, 70)
  if (ch === " ") d += rand(0, 50)
  if (ch === prev && /[a-z]/.test(ch)) d -= 25 // doubled letters roll quickly
  return Math.max(38, Math.min(d, 420))
}

/** Turn a target file into a human-ish sequence of editor actions. */
export function plan(snip: Snippet): Action[] {
  const T = snip.code
  const A: Action[] = []
  const closers: string[] = []
  const seen = new Set<string>()
  let i = 0
  let noFxUntil = -1
  let prev = ""

  while (i < T.length) {
    const c = T[i]

    // ---- new line: Enter, editor auto-indents, then a pause to read / think
    if (c === "\n") {
      let j = i + 1
      while (T[j] === " ") j++
      const indent = T.slice(i + 1, j)
      const lineEnd = T.slice(T.lastIndexOf("\n", i - 1) + 1, i).trimEnd()
      A.push({ k: "enter", indent, d: keyDelay("\n", prev) + rand(20, 120) })
      i = j
      prev = "\n"
      if (T[i] === "\n") {
        // blank line ahead: finish this block, then a real thinking break
        A.push({ k: "enter", indent: "", d: rand(140, 260) })
        A.push({ k: "pause", d: rand(2300, 3400), think: true })
        let k2 = i + 1
        while (T[k2] === " ") k2++
        i = k2
        continue
      }
      A.push({ k: "pause", d: lineEnd.endsWith(":") ? rand(550, 1150) : Math.random() < 0.15 ? rand(900, 1600) : rand(200, 600) })
      continue
    }

    // ---- typing "over" a bracket the editor already closed
    if (")]}".includes(c) && closers[closers.length - 1] === c) {
      closers.pop()
      A.push({ k: "over", ch: c, d: keyDelay(c, prev) })
      prev = c
      i++
      continue
    }

    // ---- opening bracket: the editor inserts the closer
    if ("([{".includes(c)) {
      closers.push({ "(": ")", "[": "]", "{": "}" }[c]!)
      A.push({ k: "type", ch: c, d: keyDelay(c, prev) })
      prev = c
      i++
      if (Math.random() < 0.18) A.push({ k: "pause", d: rand(250, 650) })
      continue
    }

    // ---- start of an identifier: maybe autocomplete, maybe a typo
    if (/[A-Za-z_]/.test(c) && i >= noFxUntil && (i === 0 || !/\w/.test(T[i - 1]))) {
      const w = T.slice(i).match(/^\w+/)![0]
      if (w.length >= 6 && (seen.has(w) || KNOWN.has(w)) && Math.random() < 0.8) {
        const typed = 2 + Math.floor(Math.random() * 2)
        for (let n = 0; n < typed; n++) {
          A.push({ k: "type", ch: w[n], d: keyDelay(w[n], prev) })
          prev = w[n]
        }
        A.push({ k: "suggest", word: w, typed, d: rand(110, 240) })
        A.push({ k: "complete", text: w.slice(typed), d: rand(220, 420) })
        seen.add(w)
        prev = w[w.length - 1]
        i += w.length
        continue
      }
      seen.add(w)
      if (w.length >= 4 && Math.random() < 0.09) {
        const p = 1 + Math.floor(Math.random() * (w.length - 2))
        const wrongPool = NEIGHBORS[w[p].toLowerCase()]
        if (wrongPool) {
          for (let n = 0; n < p; n++) { A.push({ k: "type", ch: w[n], d: keyDelay(w[n], prev) }); prev = w[n] }
          const wrong = wrongPool[Math.floor(Math.random() * wrongPool.length)]
          A.push({ k: "type", ch: wrong, d: keyDelay(wrong, prev) })
          const extra = Math.min(w.length - p - 1, Math.floor(Math.random() * 3))
          for (let n = 0; n < extra; n++) { A.push({ k: "type", ch: w[p + n], d: keyDelay(w[p + n], prev) }); prev = w[p + n] }
          A.push({ k: "pause", d: rand(220, 480) }) // notices the mistake
          for (let n = 0; n < extra + 1; n++) A.push({ k: "back", d: n === 0 ? rand(90, 140) : rand(45, 75) })
          A.push({ k: "pause", d: rand(80, 200) })
          i += p
          noFxUntil = i + (w.length - p)
          prev = w[p - 1]
          continue
        }
      }
    }

    A.push({ k: "type", ch: c, d: keyDelay(c, prev) })
    prev = c
    i++
  }

  // ---- save, run it in the terminal, read the result
  A.push({ k: "pause", d: rand(500, 900) })
  A.push({ k: "save", d: rand(120, 200) })
  A.push({ k: "pause", d: rand(500, 800) })
  let p2 = ""
  for (const ch of snip.run) { A.push({ k: "term", ch, d: keyDelay(ch, p2) * 0.85 }); p2 = ch }
  A.push({ k: "termEnter", d: rand(150, 300) })
  A.push({ k: "run", d: rand(1100, 1600) })
  A.push({ k: "done", d: rand(3000, 3800) })
  return A
}

export type TypingState = {
  file: string
  doc: string
  closers: string
  suggest: { word: string; typed: number } | null
  thinking: boolean
  idle: boolean
  dirty: boolean
  phase: "edit" | "term" | "running" | "done"
  term: string
  result: string
  key: { id: number; hand: Hand; kind: "type" | "back" | "enter" | "tab" | "save" } | null
}

function initial(snip: Snippet): TypingState {
  return { file: snip.file, doc: "", closers: "", suggest: null, thinking: false, idle: true, dirty: false, phase: "edit", term: "", result: snip.result, key: null }
}

export function useHumanTyping(visible: React.MutableRefObject<boolean>, snippets: Snippet[] = SNIPPETS) {
  const [si, setSi] = useState(0)
  const [st, setSt] = useState<TypingState>(() => initial(snippets[0]))
  const keyId = useRef(0)

  useEffect(() => {
    const snip = snippets[si]
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSt({ ...initial(snip), doc: snip.code, phase: "done" })
      return
    }
    const acts = plan(snip)
    let n = 0
    let timer: ReturnType<typeof setTimeout>
    setSt(initial(snip))

    const press = (hand: Hand, kind: NonNullable<TypingState["key"]>["kind"]) => ({ id: ++keyId.current, hand, kind })

    const step = () => {
      if (!visible.current) { timer = setTimeout(step, 400); return }
      const a = acts[n++]
      if (!a) { setSi((x) => (x + 1) % snippets.length); return }
      setSt((s) => {
        const base = { ...s, suggest: a.k === "complete" ? null : s.suggest, thinking: false, idle: false }
        switch (a.k) {
          case "type": {
            // opening bracket: the editor drops the closer right after the cursor
            const cl = ({ "(": ")", "[": "]", "{": "}" } as Record<string, string>)[a.ch] ?? ""
            return { ...base, doc: s.doc + a.ch, closers: cl + s.closers, dirty: true, key: press(handFor(a.ch), "type") }
          }
          case "over":
            return { ...base, doc: s.doc + a.ch, closers: s.closers.slice(1), key: press("R", "type") }
          case "back":
            return { ...base, doc: s.doc.slice(0, -1), dirty: true, key: press("R", "back") }
          case "enter":
            // open brackets travel down with the cursor, like in VS Code
            return { ...base, doc: s.doc + "\n" + a.indent, dirty: true, key: press("R", "enter") }
          case "suggest":
            return { ...base, suggest: { word: a.word, typed: a.typed } }
          case "complete":
            return { ...base, doc: s.doc + a.text, suggest: null, dirty: true, key: press("L", "tab") }
          case "pause":
            return { ...base, thinking: !!a.think, idle: true }
          case "save":
            return { ...base, dirty: false, key: press("L", "save") }
          case "term":
            return { ...base, phase: "term", term: s.term + a.ch, key: press(handFor(a.ch), "type") }
          case "termEnter":
            return { ...base, phase: "running", key: press("R", "enter") }
          case "run":
            return { ...base, phase: "done", idle: true }
          case "done":
            return { ...base, idle: true }
        }
      })
      // the delay belongs *before* the next action
      const next = acts[n]
      timer = setTimeout(step, next ? next.d : a.d)
    }
    timer = setTimeout(step, 700)
    return () => clearTimeout(timer)
  }, [si, snippets, visible])

  return st
}
