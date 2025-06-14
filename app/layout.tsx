import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jagannath Patro - Full Stack Developer",
  description: "Portfolio of Jagannath Patro - Computer Science Engineer and Full Stack Developer",
  keywords: ["Jagannath Patro", "Full Stack Developer", "Computer Science", "Portfolio", "React", "Next.js"],
  authors: [{ name: "Jagannath Patro" }],
  openGraph: {
    title: "Jagannath Patro - Full Stack Developer",
    description: "Portfolio of Jagannath Patro - Computer Science Engineer and Full Stack Developer",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
