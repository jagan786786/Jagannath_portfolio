import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#05030d",
        panel: "#0b0919",
        line: "rgb(255 255 255 / 0.07)",
        ink: "#ece9f6",
        muted: "#9a94b2",
        violet: { DEFAULT: "#7c5cff", soft: "#a996ff", deep: "#4b2fd6" },
        mint: "#34d399",
      },
      fontFamily: {
        display: ['"Sora Variable"', "system-ui", "sans-serif"],
        sans: ['"Inter Variable"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono Variable"', "ui-monospace", "monospace"],
        hand: ['"Caveat"', "cursive"],
      },
      boxShadow: {
        glow: "0 0 24px -4px rgb(124 92 255 / 0.55)",
      },
    },
  },
  plugins: [],
}
export default config
