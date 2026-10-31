import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import "@fontsource-variable/sora/index.css"
import "@fontsource-variable/inter/index.css"
import "@fontsource-variable/jetbrains-mono/index.css"
import "@fontsource/caveat/500.css"
import "./globals.css"
import { site, hero } from "@/lib/data"

const title = `${site.name} — ${site.role}`
const description = hero.bio

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  keywords: [site.name, "AI Engineer", "LLM", "RAG", "AI agents", "Python", "Next.js", "Portfolio"],
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: "/" },
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "profile",
    url: site.url,
    title,
    description,
    siteName: site.name,
    images: [{ url: "/profile.webp", width: 320, height: 320, alt: site.name }],
  },
  twitter: { card: "summary", title, description, images: ["/profile.webp"] },
}

export const viewport: Viewport = {
  themeColor: [
    { color: "#05030d" },
  ],
}

// Structured data so search engines understand this is a person's profile.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  image: `${site.url}/profile.webp`,
  sameAs: [site.github, site.linkedin],
  alumniOf: "GIET University",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  )
}
