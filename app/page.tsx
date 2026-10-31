import type { ReactNode } from "react"
import { ArrowRight, ArrowUpRight, Briefcase, Download, Github, GraduationCap, Heart, Linkedin, Mail, MapPin, Quote, Sparkles, Zap, Code2, BarChart3, Award, Send } from "lucide-react"
import Nav from "@/components/nav"
import Clock from "@/components/clock"
import Typed from "@/components/typed"
import Reveal from "@/components/reveal"
import ProjectsGrid from "@/components/projects-grid"
import SkillsGrid from "@/components/skills-grid"
import SkillOrbit from "@/components/skill-orbit"
import ContactForm from "@/components/contact-form"
import NightScene from "@/components/night-scene"
import StatusTicker from "@/components/status-ticker"
import Assistant, { type QA } from "@/components/assistant"
import { site, hero, statusLines, about, projects, experience, skills, orbitIcons, stats, education, certifications } from "@/lib/data"

const ext = { target: "_blank", rel: "noopener noreferrer" } as const

function Heading({ lead, accent, className = "" }: { lead: string; accent: string; className?: string }) {
  return (
    <h2 className={`font-display text-4xl font-extrabold leading-[1.08] tracking-tight [text-wrap:balance] sm:text-5xl ${className}`}>
      {lead} <span className="grad">{accent}</span>
    </h2>
  )
}

function Section({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative scroll-mt-16 py-24 md:py-32 ${className}`}>
      <div className="mx-auto max-w-6xl px-5">{children}</div>
    </section>
  )
}

export default function Home() {
  const statIcons = [Code2, Briefcase, BarChart3, Heart]

  // The AI twin's answers come straight from lib/data.ts.
  const companyWork = projects.filter((p) => p.company).map((p) => p.title)
  const qa: QA[] = [
    { q: "What does he build?", a: hero.bio, jump: "about" },
    {
      q: "Show me his work",
      a: companyWork.length
        ? `At ${experience[0].company} he has worked on ${companyWork.join(", ")}. Scrolling you to the projects now.`
        : `Here are his projects. Scrolling you there now.`,
      jump: "projects",
    },
    { q: "Where has he worked?", a: experience.map((j) => `• ${j.role}, ${j.company} (${j.period})`).join("\n"), jump: "experience" },
    { q: "What's his stack?", a: `Strongest in: ${[...skills].sort((a, b) => b.level - a.level).slice(0, 8).map((s) => s.name).join(", ")}.`, jump: "skills" },
    { q: "How do I reach him?", a: `Email ${site.email}, or use the contact form. He's ${site.openToWork ? "open to new opportunities" : "happy to chat"}.`, jump: "contact" },
  ]

  return (
    <>
      <Reveal />
      <Assistant name={site.short} avatar="/profile.webp" greeting={`Hi! I'm ${site.short}'s AI twin. Ask me about his work, experience or stack.`} qa={qa} />
      <Nav name={site.short} initials={site.initials} linkedin={site.linkedin} />

      <main>
        {/* ------------------------------------------------------------ Hero */}
        <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden pt-16">
          <div className="pointer-events-none absolute inset-0 z-[1] hidden lg:block" style={{ background: "linear-gradient(90deg, #05030d 0%, #05030d 28%, rgba(5,3,13,0.75) 40%, rgba(5,3,13,0) 56%)" }} />

          {hero.image ? (
            <>
              {/* Full-bleed hero picture: him large on the right, dark wall under the text */}
              <img
                src={hero.image}
                srcSet={`/hero-sm.webp 1024w, ${hero.image} 2048w`}
                sizes="70vw"
                alt={`${site.name} coding at his desk at night`}
                fetchPriority="high"
                className="hero-photo pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[72%] object-cover lg:block"
                style={{ objectPosition: "90% 40%" }}
              />
              {/* drifting stars over the dark wall */}
              <div className="hero-stars pointer-events-none absolute inset-0 hidden lg:block" />
              {/* glass quote board on the wall, left of his head */}
              <div className="pointer-events-none absolute left-[42%] top-[7%] z-10 hidden w-52 rotate-[-5deg] xl:block">
                <div className="floaty rounded-2xl border border-violet-soft/40 bg-[#0c0826]/40 px-5 py-4 shadow-[0_0_36px_-8px_rgba(124,92,255,0.7),inset_0_0_20px_rgba(124,92,255,0.15)] backdrop-blur-[2px]">
                  <p className="font-hand text-[24px] leading-[1.1] text-[#e6e0ff]/90">&ldquo;{hero.quote}&rdquo;</p>
                  <p className="mt-2 text-right font-hand text-lg tracking-[0.2em] text-[#e6e0ff]/75">— {site.short.toUpperCase()}</p>
                </div>
              </div>
              {/* "right now" card on his back, like a sticker on the jacket */}
              <div className="absolute bottom-[14%] left-[46%] z-10 hidden w-64 rounded-xl border border-white/10 bg-[#0a0720]/80 p-4 backdrop-blur-md lg:block">
                <p className="eyebrow !text-[10px]">// right now</p>
                <p className="mt-2 min-h-[2.5rem] leading-snug"><StatusTicker lines={statusLines} /></p>
              </div>
            </>
          ) : (
            /* Full-bleed illustrated night scene */
            <NightScene className="pointer-events-none absolute inset-0 hidden lg:block" quote={hero.quote} author={site.short.toUpperCase()} status={statusLines} />
          )}

          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-20">
            <div className="max-w-2xl">
              <p className="eyebrow"><Typed text="// Hello, I'm" /></p>
              <h1 className="mt-4 font-display text-6xl font-extrabold leading-none tracking-[-0.04em] sm:text-8xl lg:text-[6.25rem] xl:text-[6.75rem]">
                <span className="bg-gradient-to-r from-white via-[#d9d2ff] to-violet bg-clip-text text-transparent">{site.short}</span>
                <span className="sr-only"> Patro, {site.role}</span>
              </h1>
              <p className="mt-6 font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                {hero.headline[0]}
                <br />
                <span className="grad">{hero.headline[1]}</span>
              </p>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted lg:max-w-[31rem]">{hero.bio}</p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#projects" className="btn-primary">View My Work <ArrowRight size={16} aria-hidden /></a>
                {site.resume ? (
                  <a href={site.resume} className="btn-ghost" download><Download size={16} aria-hidden /> Download Résumé</a>
                ) : (
                  <a href="#contact" className="btn-ghost"><Mail size={16} aria-hidden /> Get in Touch</a>
                )}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href={site.github} {...ext} aria-label="GitHub" className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white/[0.03] text-muted transition hover:border-violet/50 hover:text-white"><Github size={18} /></a>
                <a href={site.linkedin} {...ext} aria-label="LinkedIn" className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white/[0.03] text-muted transition hover:border-violet/50 hover:text-white"><Linkedin size={18} /></a>
                {site.openToWork && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/10 px-3 py-1.5 text-xs text-mint">
                    <span className="pulse-dot h-2 w-2 rounded-full bg-mint" /> Open to opportunities
                  </span>
                )}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5"><MapPin size={15} aria-hidden /> Currently in {site.location}</span>
                <Clock timezone={site.timezone} />
              </div>

              <div className="mt-12 lg:hidden">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_60px_-20px_rgba(124,92,255,0.8)]">
                  {hero.image ? (
                    <img src="/hero-sm.webp" alt={`${site.name} coding at his desk at night`} className="aspect-[4/3] w-full object-cover" style={{ objectPosition: "62% 50%" }} />
                  ) : (
                    <NightScene crop className="aspect-[4/3] w-full" status={statusLines} />
                  )}
                </div>
                {hero.image && (
                  <div className="mx-auto -mt-6 w-fit max-w-[90%] rounded-xl border border-white/10 bg-[#0a0720]/85 px-4 py-3 backdrop-blur-md">
                    <p className="eyebrow !text-[10px]">// right now</p>
                    <p className="mt-1.5"><StatusTicker lines={statusLines} /></p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <a href="#about" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted hover:text-ink md:flex">
            <span className="flex h-9 w-5 justify-center rounded-full border border-white/20 pt-1.5"><span className="scroll-cue h-2 w-0.5 rounded bg-violet-soft" /></span>
            Scroll to explore
          </a>
        </section>

        {/* ------------------------------------------------------------ About */}
        <Section id="about" className="grid-bg">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-start">
            <div className="reveal">
              <p className="eyebrow">// 01. About me</p>
              <Heading lead={about.headline[0]} accent={about.headline[1]} className="mt-5" />
              <p className="mt-6 max-w-xl leading-relaxed text-muted">{about.body}</p>

              <ul className="mt-8 grid gap-3 sm:grid-cols-3">
                {about.facts.map((f, i) => {
                  const Icon = [GraduationCap, Briefcase, MapPin][i] ?? Sparkles
                  return (
                    <li key={f.title} className="card p-4">
                      <Icon size={17} className="text-violet-soft" aria-hidden />
                      <p className="mt-3 text-sm font-semibold">{f.title}</p>
                      <p className="mt-0.5 text-xs text-muted">{f.detail}</p>
                    </li>
                  )
                })}
              </ul>

              <p className="mt-10 font-hand text-3xl text-ink/90">&ldquo;{about.quote}&rdquo;</p>
            </div>

            <div className="card reveal p-6">
              <div className="mb-6 flex items-center gap-4 border-b border-line pb-6">
                <img src="/profile.webp" alt={`Portrait of ${site.name}`} width={320} height={320} loading="lazy" className="h-20 w-20 rounded-2xl object-cover ring-1 ring-violet/40 shadow-glow" />
                <div>
                  <p className="font-display text-lg font-bold">{site.name}</p>
                  <p className="text-sm text-violet-soft">{site.role}</p>
                  <p className="mt-0.5 text-xs text-muted">{site.location}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold">What I enjoy</h3>
                <Sparkles size={17} className="text-violet-soft" aria-hidden />
              </div>
              <ul className="mt-5 grid gap-2">
                {about.enjoys.map((e) => (
                  <li key={e} className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-soft shadow-glow" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </Section>

        {/* ------------------------------------------------------------ Projects */}
        <Section id="projects">
          <div className="reveal text-center">
            <p className="eyebrow">// 02. Projects</p>
            <Heading lead="Things I've" accent="built and shipped." className="mx-auto mt-5 max-w-3xl" />
            <p className="mt-5 text-muted">From LLM features to full-stack products.</p>
          </div>
          <div className="reveal mt-12">
            <ProjectsGrid projects={projects} />
          </div>
          <p className="reveal mt-10 text-center">
            <a href={site.github} {...ext} className="btn-ghost">More on GitHub <ArrowUpRight size={15} aria-hidden /></a>
          </p>
        </Section>

        {/* ------------------------------------------------------------ Experience */}
        <Section id="experience" className="grid-bg">
          <div className="reveal">
            <p className="eyebrow">// 03. Experience</p>
            <Heading lead="Where I've" accent="been building." className="mt-5" />
          </div>

          <ol className="relative mt-14 space-y-6 border-l border-line pl-8 md:ml-4">
            {experience.map((job, i) => (
              <li key={job.company + job.role} className="reveal relative">
                <span className={`absolute -left-[41px] top-6 h-4 w-4 rounded-full border-2 border-night ${i === 0 ? "bg-violet shadow-glow" : "bg-[#2a2450]"}`} />
                <div className="card p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-xl font-bold">
                      {job.role} <span className="text-violet-soft">@ {job.company}</span>
                    </h3>
                    <span className="font-mono text-xs text-muted">{job.period}</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
                    {job.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-soft" />{pt}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            <li className="reveal relative">
              <span className="absolute -left-[41px] top-6 h-4 w-4 rounded-full border-2 border-night bg-[#2a2450]" />
              <div className="card p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-bold">{education.degree}</h3>
                  <span className="font-mono text-xs text-muted">{education.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{education.school}. {education.detail}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {certifications.map((c) => <li key={c} className="chip">{c}</li>)}
                </ul>
              </div>
            </li>
          </ol>
        </Section>

        {/* ------------------------------------------------------------ Skills */}
        <Section id="skills">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div className="reveal flex flex-col justify-between gap-10 lg:pt-24">
              <SkillOrbit icons={orbitIcons} />
              <figure className="relative rounded-2xl border border-line bg-panel/70 p-6 pt-8">
                <Quote size={30} className="absolute -top-4 left-5 fill-violet-soft text-violet-soft drop-shadow-[0_0_10px_rgba(124,92,255,0.8)]" aria-hidden />
                <blockquote className="leading-relaxed text-ink">Models change every few months.<br />Good engineering habits don&apos;t.</blockquote>
                <span className="mt-4 block h-0.5 w-8 rounded bg-violet" />
              </figure>
            </div>

            <div className="reveal min-w-0">
              <div className="text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-xs font-medium text-violet-soft"><Zap size={13} fill="currentColor" aria-hidden /> My Toolbox</span>
                <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                  Skills that power <span className="grad">intelligent products</span>
                </h2>
                <p className="mt-4 text-muted">The models, languages and tools I use to turn ideas into working AI.</p>
              </div>
              <div className="mt-8">
                <SkillsGrid skills={skills} />
              </div>
            </div>
          </div>

          <div className="reveal mt-12 grid gap-4 lg:grid-cols-[1fr_280px]">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-2xl border border-line bg-panel/60 p-5 md:grid-cols-4">
              {stats.map((s, i) => {
                const Icon = statIcons[i] ?? Zap
                return (
                  <li key={s.label} className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet/10 text-violet-soft"><Icon size={17} aria-hidden /></span>
                    <span>
                      <span className="block font-display text-xl font-bold leading-none">{s.value}</span>
                      <span className="mt-1 block text-xs text-muted">{s.label}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
            <a href="#projects" className="group flex items-center justify-between gap-4 rounded-2xl border border-violet/30 bg-panel/60 p-5 transition hover:border-violet/60 hover:shadow-glow">
              <span className="font-hand text-[28px] leading-[1.05] text-violet-soft drop-shadow-[0_0_10px_rgba(124,92,255,0.6)]">Smarter<br />things ahead…</span>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line text-ink transition group-hover:translate-x-1 group-hover:border-violet/60"><ArrowRight size={18} aria-hidden /></span>
            </a>
          </div>
        </Section>

        {/* ------------------------------------------------------------ Contact */}
        <Section id="contact" className="grid-bg">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="reveal">
              <p className="eyebrow">// 05. Contact</p>
              <Heading lead="Let's build something" accent="intelligent." className="mt-5" />
              <p className="mt-6 max-w-md leading-relaxed text-muted">
                Hiring for an AI engineering role, or have an idea that needs LLMs done properly? Send a message and I&apos;ll get back to you.
              </p>
              <ul className="mt-8 grid gap-3">
                {[
                  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
                  { icon: Github, label: "GitHub", value: "jagan786786", href: site.github },
                  { icon: Linkedin, label: "LinkedIn", value: "Jagannath Patro", href: site.linkedin },
                  { icon: MapPin, label: "Location", value: site.location },
                ].map(({ icon: Icon, label, value, href }) => {
                  const inner = (
                    <>
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet/10 text-violet-soft"><Icon size={18} aria-hidden /></span>
                      <span className="min-w-0">
                        <span className="block text-xs text-muted">{label}</span>
                        <span className="block truncate text-sm font-medium">{value}</span>
                      </span>
                    </>
                  )
                  return (
                    <li key={label}>
                      {href ? (
                        <a href={href} {...(href.startsWith("http") ? ext : {})} className="card flex items-center gap-4 p-4 transition hover:border-violet/40">{inner}</a>
                      ) : (
                        <div className="card flex items-center gap-4 p-4">{inner}</div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="card reveal p-6 sm:p-8">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted"><Send size={13} className="text-violet-soft" aria-hidden /> Send a message</p>
              <h3 className="mt-3 font-display text-3xl font-extrabold">Say <span className="grad">hello.</span></h3>
              <p className="mt-2 text-sm text-muted">I usually reply within a couple of days.</p>
              <div className="mt-7">
                <ContactForm endpoint={site.formspree} />
              </div>
            </div>
          </div>
        </Section>
      </main>

      {/* ------------------------------------------------------------ Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-20 text-center">
          <p className="eyebrow inline-block rounded-full border border-line px-3 py-1 !text-[10px]">// end of the page</p>
          <h2 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Thanks for <span className="grad">stopping by!</span></h2>
          <p className="mx-auto mt-4 max-w-md text-muted">If something here sparked an idea, I&apos;d like to hear it.</p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="flex items-center gap-2.5 font-display text-lg font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet to-violet-deep text-xs font-extrabold text-white">{site.initials}</span>
              {site.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{site.role} building useful things with LLMs.</p>
          </div>
          <nav aria-label="Footer">
            <p className="text-sm font-semibold">Quick links</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {["About", "Projects", "Experience", "Skills", "Contact"].map((l) => (
                <li key={l}><a href={`#${l.toLowerCase()}`} className="hover:text-ink">{l}</a></li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-sm font-semibold">Elsewhere</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><a href={site.github} {...ext} className="inline-flex items-center gap-1 hover:text-ink">GitHub <ArrowUpRight size={13} aria-hidden /></a></li>
              <li><a href={site.linkedin} {...ext} className="inline-flex items-center gap-1 hover:text-ink">LinkedIn <ArrowUpRight size={13} aria-hidden /></a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold">Let&apos;s connect</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">Open to AI engineering roles and interesting collaborations.</p>
            <a href="#contact" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-soft hover:text-white">Send a message <ArrowRight size={14} aria-hidden /></a>
          </div>
        </div>

        <div className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-muted">
            <p>© {new Date().getFullYear()} {site.name}</p>
            <p className="font-mono tracking-[0.3em]">DATA ✕ MODELS ✕ PRODUCT</p>
            <p>Built in India</p>
          </div>
        </div>
      </footer>
    </>
  )
}
