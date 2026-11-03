import { ArrowUpRight, Award, CalendarDays, Flame, Globe2, Send } from "lucide-react"
import type { LeetCodeStats } from "@/lib/leetcode"
import { brandIcons } from "@/lib/brand-icons"
import TimeAgo from "@/components/time-ago"

const DIFF = [
  { key: "easy", label: "Easy", color: "#2dd4bf" },
  { key: "medium", label: "Medium", color: "#fbbf24" },
  { key: "hard", label: "Hard", color: "#f43f5e" },
] as const

const LANG_ICON: Record<string, string> = { Java: "openjdk", Python: "python", MySQL: "mysql", JavaScript: "javascript", TypeScript: "typescript", "C++": "c", C: "c" }

function Ring({ lc }: { lc: LeetCodeStats }) {
  const R = 74, W = 10, CIRC = 2 * Math.PI * R
  const gap = 6 // px between segments
  let offset = 0
  return (
    <div className="relative mx-auto h-[190px] w-[190px]">
      <svg viewBox="0 0 190 190" className="h-full w-full -rotate-90">
        <circle cx="95" cy="95" r={R} fill="none" stroke="rgb(255 255 255 / 0.06)" strokeWidth={W} />
        {DIFF.map((d) => {
          const share = lc.solved.all ? lc.solved[d.key] / lc.solved.all : 0
          const len = Math.max(0, share * CIRC - gap)
          const el = (
            <circle
              key={d.key}
              cx="95" cy="95" r={R} fill="none" stroke={d.color} strokeWidth={W} strokeLinecap="round"
              strokeDasharray={`${len} ${CIRC - len}`} strokeDashoffset={-offset}
              style={{ filter: `drop-shadow(0 0 6px ${d.color}66)` }}
            />
          )
          offset += share * CIRC
          return el
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-5xl font-extrabold leading-none">{lc.solved.all}</p>
          <p className="mt-1 text-xs text-muted">of {lc.total.all.toLocaleString("en-US")} solved</p>
        </div>
      </div>
    </div>
  )
}

function Heatmap({ lc }: { lc: LeetCodeStats }) {
  // 53 weeks ending on the day the stats were fetched (UTC days, like LeetCode)
  const DAY = 86400
  const endDay = Math.floor(lc.fetchedAt / 1000 / DAY)
  const endDow = new Date(endDay * DAY * 1000).getUTCDay()
  const startDay = endDay - endDow - 52 * 7
  const counts = new Map<number, number>()
  for (const [ts, n] of Object.entries(lc.calendar)) counts.set(Math.floor(Number(ts) / DAY), n)
  const weeks: { day: number; n: number }[][] = []
  for (let w = 0; w < 53; w++) {
    const col = []
    for (let d = 0; d < 7; d++) {
      const day = startDay + w * 7 + d
      col.push({ day, n: day > endDay ? -1 : counts.get(day) ?? 0 })
    }
    weeks.push(col)
  }
  const level = (n: number) => (n <= 0 ? 0 : n < 2 ? 1 : n < 4 ? 2 : n < 7 ? 3 : 4)
  const fills = ["rgb(255 255 255 / 0.05)", "#1d6b4f", "#25985f", "#2fc574", "#5ff59a"]
  const months: { w: number; label: string }[] = []
  weeks.forEach((col, w) => {
    const d = new Date(col[0].day * DAY * 1000)
    if (d.getUTCDate() <= 7 && w < 51) months.push({ w, label: d.toLocaleString("en", { month: "short", timeZone: "UTC" }) })
  })
  const CELL = 11, GAP = 3
  const width = 53 * (CELL + GAP)
  return (
    <div className="overflow-x-auto pb-1">
      <svg viewBox={`0 0 ${width} ${7 * (CELL + GAP) + 16}`} className="h-auto min-w-[640px] w-full" role="img" aria-label={`${lc.submissionsYear} submissions in the past year`}>
        {weeks.map((col, w) =>
          col.map((c, d) =>
            c.n < 0 ? null : (
              <rect key={`${w}-${d}`} x={w * (CELL + GAP)} y={d * (CELL + GAP)} width={CELL} height={CELL} rx="2.5" fill={fills[level(c.n)]}>
                <title>{`${c.n} submission${c.n === 1 ? "" : "s"} on ${new Date(c.day * DAY * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`}</title>
              </rect>
            ),
          ),
        )}
        {months.map((m) => (
          <text key={m.w} x={m.w * (CELL + GAP)} y={7 * (CELL + GAP) + 12} fontSize="10" fill="#9a94b2" fontFamily="Inter Variable, sans-serif">{m.label}</text>
        ))}
      </svg>
    </div>
  )
}

export default function LeetCodeSection({ lc, url }: { lc: LeetCodeStats; url: string }) {
  const icon = brandIcons.leetcode
  const maxLang = Math.max(...lc.languages.map((l) => l.solved), 1)
  const maxTopic = Math.max(...lc.topics.map((t) => t.solved), 1)
  const tiles = [
    { icon: Globe2, value: `#${lc.ranking.toLocaleString("en-US")}`, label: "Global rank" },
    { icon: Send, value: String(lc.submissionsYear), label: "Submissions this year" },
    { icon: CalendarDays, value: String(lc.activeDays), label: "Active days" },
    { icon: Flame, value: `${lc.streak} days`, label: "Max streak" },
    ...(lc.contest ? [{ icon: Award, value: String(lc.contest.rating), label: `Contest rating · top ${lc.contest.topPercentage}%` }] : []),
  ]

  return (
    <>
      <div className="reveal flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">// 05. Problem solving</p>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight [text-wrap:balance] sm:text-5xl">
            Sharpening the <span className="grad">fundamentals.</span>
          </h2>
          <p className="mt-5 max-w-xl text-muted">
            Data structures and algorithms practice on LeetCode, mostly in {lc.languages[0]?.name ?? "Java"}. These numbers update from his profile every time the site is rebuilt.
          </p>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path d={icon.path} fill={icon.color} /></svg>
          View LeetCode profile <ArrowUpRight size={15} aria-hidden />
        </a>
      </div>

      <div className="reveal mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* solved by difficulty */}
        <div className="card flex flex-col p-6">
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden style={{ filter: `drop-shadow(0 0 8px ${icon.color}66)` }}><path d={icon.path} fill={icon.color} /></svg>
            <p className="font-display text-lg font-bold">@{lc.username}</p>
          </div>
          <div className="mt-6"><Ring lc={lc} /></div>
          <ul className="mt-6 space-y-3.5">
            {DIFF.map((d) => (
              <li key={d.key}>
                <div className="flex items-baseline justify-between text-sm">
                  <span style={{ color: d.color }} className="font-semibold">{d.label}</span>
                  <span className="tabular-nums text-muted"><span className="font-semibold text-ink">{lc.solved[d.key]}</span> / {lc.total[d.key]}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full" style={{ width: `${Math.max(2, (lc.solved[d.key] / Math.max(1, lc.total[d.key])) * 100)}%`, background: d.color, boxShadow: `0 0 10px ${d.color}88` }} />
                </div>
              </li>
            ))}
          </ul>

          {/* share of harder problems + badge, pinned to the bottom of the card */}
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-line pt-6 lg:mt-auto">
            <div>
              <p className="font-display text-2xl font-bold tabular-nums">{Math.round(((lc.solved.medium + lc.solved.hard) / Math.max(1, lc.solved.all)) * 100)}%</p>
              <p className="mt-1 text-xs text-muted">Medium or Hard</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold tabular-nums">{lc.solved.hard}</p>
              <p className="mt-1 text-xs text-muted">Hard problems</p>
            </div>
          </div>
          {lc.badges[0] && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-3">
              <svg viewBox="0 0 40 44" width="34" height="38" aria-hidden className="shrink-0 drop-shadow-[0_0_10px_rgba(251,191,36,0.45)]">
                <path d="M20 2 37 11.5v21L20 42 3 32.5v-21Z" fill="#2a2238" stroke="#fbbf24" strokeWidth="2" />
                <text x="20" y="27" textAnchor="middle" fontFamily="Sora Variable, sans-serif" fontWeight="800" fontSize="12" fill="#fde68a">{lc.badges[0].match(/\d+/)?.[0] ?? "★"}</text>
              </svg>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-amber-100">{lc.badges[0]}</p>
                <p className="text-xs text-muted">LeetCode badge</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4">
          {/* stat tiles */}
          <ul className={`grid grid-cols-2 gap-3 ${tiles.length > 4 ? "md:grid-cols-5" : "md:grid-cols-4"}`}>
            {tiles.map(({ icon: I, value, label }) => (
              <li key={label} className="card p-4">
                <I size={17} className="text-violet-soft" aria-hidden />
                <p className="mt-3 font-display text-2xl font-bold tabular-nums leading-none">{value}</p>
                <p className="mt-1.5 text-xs text-muted">{label}</p>
              </li>
            ))}
          </ul>

          {/* activity heatmap */}
          <div className="card min-w-0 p-5">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-semibold"><span className="font-display text-lg">{lc.submissionsYear}</span> submissions in the past year</p>
            </div>
            <Heatmap lc={lc} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* topics */}
            <div className="card p-5">
              <p className="text-sm font-semibold">Top topics</p>
              <ul className="mt-4 space-y-2.5">
                {lc.topics.slice(0, 6).map((t) => (
                  <li key={t.name} className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm">
                    <div className="min-w-0">
                      <div className="flex justify-between"><span className="truncate">{t.name}</span></div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-gradient-to-r from-violet-deep to-violet-soft" style={{ width: `${(t.solved / maxTopic) * 100}%` }} />
                      </div>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-muted">{t.solved}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* languages + recent */}
            <div className="card p-5">
              <p className="text-sm font-semibold">Languages</p>
              <ul className="mt-4 space-y-2.5">
                {lc.languages.slice(0, 4).map((l) => {
                  const b = brandIcons[LANG_ICON[l.name] ?? ""]
                  return (
                    <li key={l.name} className="grid grid-cols-[18px_1fr_auto] items-center gap-3 text-sm">
                      {b ? <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path d={b.path} fill={b.color} /></svg> : <span />}
                      <div className="min-w-0">
                        <span>{l.name}</span>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                          <div className="h-full rounded-full" style={{ width: `${(l.solved / maxLang) * 100}%`, background: b?.color ?? "#a996ff" }} />
                        </div>
                      </div>
                      <span className="font-mono text-xs tabular-nums text-muted">{l.solved}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* recently solved */}
          <div className="card p-5">
            <p className="text-sm font-semibold">Recently solved</p>
            <ul className="mt-3 divide-y divide-line">
              {lc.recent.slice(0, 5).map((r) => (
                <li key={r.slug + r.timestamp}>
                  <a href={`https://leetcode.com/problems/${r.slug}/`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 py-2.5 text-sm">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                      <span className="truncate group-hover:text-violet-soft">{r.title}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted"><TimeAgo ts={r.timestamp} /></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
