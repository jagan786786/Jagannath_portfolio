# Jagannath Patro — AI Engineer portfolio

Live: https://jagannathintro.netlify.app

A single-page, statically exported Next.js 14 site. The intro "streams" in token by token like an LLM response, with low-confidence tokens highlighted.

## Edit content

Everything you see on the page comes from **`lib/data.ts`** — projects, experience, skills, links. Lines marked `// VERIFY` are AI-engineer positioning copy; check them before publishing. Add AI projects at the top of `projects` (a template is in the comments).

To show a résumé button, put `resume.pdf` in `public/` and set `resume: "/resume.pdf"`.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in out/
```

## Deploy

Netlify reads `netlify.toml`: build `npm run build`, publish `out`. The contact form posts to Formspree.
