import type { ReactNode } from "react"
import { Github, Linkedin, Mail, FileText, ArrowUpRight } from "lucide-react"
import TokenStream from "@/components/token-stream"
import ContactForm from "@/components/contact-form"
import { site, hero, projects, experience, skills, education, certifications } from "@/lib/data"

const nav = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
]

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-rule py-14 md:grid md:grid-cols-[11rem_1fr] md:gap-10 md:py-20">
      <h2 id={`${id}-h`} className="mb-8 font-display text-2xl font-semibold tracking-tight md:sticky md:top-24 md:mb-0 md:self-start md:text-xl">
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http")
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center gap-1 text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
    >
      {children}
      {external && <ArrowUpRight size={14} aria-hidden />}
    </a>
  )
}

export default function Home() {
  const links = [
    { href: `mailto:${site.email}`, label: "Email", icon: Mail },
    { href: site.github, label: "GitHub", icon: Github },
    { href: site.linkedin, label: "LinkedIn", icon: Linkedin },
    ...(site.resume ? [{ href: site.resume, label: "Résumé", icon: FileText }] : []),
  ]

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-white">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-rule/70 bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="font-display text-lg font-semibold tracking-tight">
            {site.name}
          </a>
          <nav aria-label="Sections">
            <ul className="flex gap-4 text-sm text-muted sm:gap-7">
              {nav.map((n, i) => (
                <li key={n.href} className={i === 1 || i === 2 ? "hidden sm:block" : ""}>
                  <a href={n.href} className="hover:text-ink">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Hero: the intro is "generated" like an LLM response. */}
        <section id="top" className="grid gap-10 pb-16 pt-14 md:grid-cols-[1fr_auto] md:gap-16 md:pb-24 md:pt-24">
          <div>
            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.035em] sm:text-7xl lg:text-8xl">
              {site.role}
            </h1>
            <div className="mt-10 md:mt-14">
              <TokenStream prompt={hero.prompt} answer={hero.answer} />
            </div>
            <ul className="mt-10 flex flex-wrap gap-3">
              {links.map(({ href, label, icon: Icon }, i) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={
                      i === 0
                        ? "inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-medium text-on-accent hover:bg-accent/90"
                        : "inline-flex items-center gap-2 rounded-md border border-rule px-4 py-2.5 hover:border-ink"
                    }
                  >
                    <Icon size={17} aria-hidden />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <figure className="order-first md:order-none">
            <img
              src="/profile.webp"
              alt={`Portrait of ${site.name}`}
              width={320}
              height={320}
              fetchPriority="high"
              className="h-24 w-24 rounded-full object-cover ring-1 ring-rule md:h-52 md:w-52"
            />
            <figcaption className="mt-3 hidden text-sm text-muted md:block">
              {site.name}
              <br />
              {site.location}
            </figcaption>
          </figure>
        </section>

        <Section id="work" title="Selected work">
          <ul className="divide-y divide-rule">
            {projects.map((p) => (
              <li key={p.title} className="py-7 first:pt-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{p.title}</h3>
                  <span className={`text-sm ${p.kind === "AI" ? "text-accent" : "text-muted"}`}>{p.kind}</span>
                </div>
                <p className="mt-2 max-w-prose leading-relaxed">{p.summary}</p>
                <p className="mt-3 text-sm text-muted">{p.stack.join(", ")}</p>
                {(p.code || p.demo) && (
                  <p className="mt-3 flex gap-5 text-sm">
                    {p.demo && <TextLink href={p.demo}>Live demo</TextLink>}
                    {p.code && <TextLink href={p.code}>Source code</TextLink>}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="experience" title="Experience">
          <ol className="space-y-10">
            {experience.map((job) => (
              <li key={job.company + job.role} className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <p className="pt-1 text-sm tabular-nums text-muted">{job.period}</p>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {job.role}, <span className="font-normal">{job.company}</span>
                  </h3>
                  <ul className="mt-2 max-w-prose list-disc space-y-1.5 pl-5 leading-relaxed marker:text-muted">
                    {job.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            <li className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <p className="pt-1 text-sm tabular-nums text-muted">{education.period}</p>
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {education.degree}, <span className="font-normal">{education.school}</span>
                </h3>
                <p className="mt-2 text-muted">{education.detail}</p>
              </div>
            </li>
          </ol>
        </Section>

        <Section id="stack" title="Stack">
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {skills.map((s, i) => (
              <div key={s.group} className={i === 0 ? "sm:col-span-2" : ""}>
                <dt className={`text-sm ${i === 0 ? "text-accent" : "text-muted"}`}>{s.group}</dt>
                <dd className={`mt-1.5 leading-relaxed ${i === 0 ? "font-display text-xl tracking-tight" : ""}`}>
                  {s.items.join(", ")}
                </dd>
              </div>
            ))}
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted">Certifications</dt>
              <dd className="mt-1.5 leading-relaxed">{certifications.join("; ")}</dd>
            </div>
          </dl>
        </Section>

        <Section id="contact" title="Contact">
          <p className="max-w-prose text-lg leading-relaxed">
            Hiring for an AI engineering role, or building something with LLMs? Write to{" "}
            <TextLink href={`mailto:${site.email}`}>{site.email}</TextLink> or use the form.
          </p>
          <div className="mt-8 max-w-2xl">
            <ContactForm endpoint={site.formspree} />
          </div>
        </Section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 border-t border-rule px-5 py-8 text-sm text-muted sm:px-8">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="flex gap-5">
          <a href={site.github} className="hover:text-ink">GitHub</a>
          <a href={site.linkedin} className="hover:text-ink">LinkedIn</a>
        </p>
      </footer>
    </>
  )
}
