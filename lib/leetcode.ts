import snapshot from "./leetcode-snapshot.json"

/*
  LeetCode stats for the "Problem solving" section.
  Fetched from LeetCode's public GraphQL API when the site is built (Netlify
  rebuilds on every push), so the numbers stay current. If LeetCode can't be
  reached, the saved snapshot below is used instead — the build never fails.
*/

export const LEETCODE_USER = "jagannathpatro234"
const BUILD_ID = Date.now()

export type LeetCodeStats = {
  username: string
  ranking: number
  solved: { all: number; easy: number; medium: number; hard: number }
  total: { all: number; easy: number; medium: number; hard: number }
  languages: { name: string; solved: number }[]
  topics: { name: string; solved: number }[]
  badges: string[]
  streak: number
  activeDays: number
  submissionsYear: number
  calendar: Record<string, number>
  recent: { title: string; slug: string; timestamp: number }[]
  contest: { rating: number; attended: number; topPercentage: number } | null
  fetchedAt: number
  live: boolean
}

const QUERY = `query profile($u: String!) {
  matchedUser(username: $u) {
    profile { ranking }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    languageProblemCount { languageName problemsSolved }
    tagProblemCounts { advanced { tagName problemsSolved } intermediate { tagName problemsSolved } fundamental { tagName problemsSolved } }
    badges { displayName }
    userCalendar { streak totalActiveDays submissionCalendar }
  }
  allQuestionsCount { difficulty count }
  userContestRanking(username: $u) { attendedContestsCount rating topPercentage }
  recentAcSubmissionList(username: $u, limit: 6) { title titleSlug timestamp }
}`

type Raw = any // eslint-disable-line @typescript-eslint/no-explicit-any

function by(list: { difficulty: string; count: number }[], d: string) {
  return list.find((x) => x.difficulty === d)?.count ?? 0
}

export async function getLeetCode(): Promise<LeetCodeStats> {
  try {
    // a per-build query string keeps Next's fetch cache from reusing an old answer
    const res = await fetch(`https://leetcode.com/graphql/?build=${BUILD_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: `https://leetcode.com/u/${LEETCODE_USER}/`, "User-Agent": "Mozilla/5.0 (portfolio build)" },
      body: JSON.stringify({ query: QUERY, variables: { u: LEETCODE_USER } }),
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) throw new Error(`LeetCode ${res.status}`)
    const { data } = (await res.json()) as { data: Raw }
    const u = data?.matchedUser
    if (!u) throw new Error("no user")
    const ac = u.submitStatsGlobal.acSubmissionNum
    const all = data.allQuestionsCount
    const calendar: Record<string, number> = JSON.parse(u.userCalendar.submissionCalendar || "{}")
    const langs = new Map<string, number>()
    for (const l of u.languageProblemCount as { languageName: string; problemsSolved: number }[]) {
      const name = l.languageName.startsWith("Python") ? "Python" : l.languageName
      langs.set(name, (langs.get(name) ?? 0) + l.problemsSolved)
    }
    const t = u.tagProblemCounts
    const topics = [...t.advanced, ...t.intermediate, ...t.fundamental]
      .map((x: Raw) => ({ name: x.tagName as string, solved: x.problemsSolved as number }))
      .sort((a: { solved: number }, b: { solved: number }) => b.solved - a.solved)
      .slice(0, 10)
    const c = data.userContestRanking
    return {
      username: LEETCODE_USER,
      ranking: u.profile.ranking,
      solved: { all: by(ac, "All"), easy: by(ac, "Easy"), medium: by(ac, "Medium"), hard: by(ac, "Hard") },
      total: { all: by(all, "All"), easy: by(all, "Easy"), medium: by(all, "Medium"), hard: by(all, "Hard") },
      languages: [...langs].map(([name, solved]) => ({ name, solved })).sort((a, b) => b.solved - a.solved),
      topics,
      badges: (u.badges as { displayName: string }[]).map((b) => b.displayName),
      streak: u.userCalendar.streak,
      activeDays: u.userCalendar.totalActiveDays,
      submissionsYear: Object.values(calendar).reduce((a, b) => a + b, 0),
      calendar,
      recent: (data.recentAcSubmissionList as Raw[]).map((r) => ({ title: r.title, slug: r.titleSlug, timestamp: Number(r.timestamp) })),
      contest: c && c.attendedContestsCount ? { rating: Math.round(c.rating), attended: c.attendedContestsCount, topPercentage: c.topPercentage } : null,
      fetchedAt: Date.now(),
      live: true,
    }
  } catch (e) {
    console.warn(`[leetcode] using saved snapshot (${(e as Error).message})`)
    return snapshot as LeetCodeStats
  }
}
