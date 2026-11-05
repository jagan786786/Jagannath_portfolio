/*
  Where each key sits on the keyboard in the hero photo, and which finger of
  which hand presses it (touch typing). Used to move the right finger and light
  up the right key for every character typed.
*/

type P = [number, number]
// Keyboard corners in photo pixels: top-left, top-right, bottom-right, bottom-left.
const KB = { tl: [630, 386] as P, tr: [748, 411] as P, br: [746, 433] as P, bl: [612, 409] as P }

const ROWS = ["`1234567890-=", "qwertyuiop[]", "asdfghjkl;'", "zxcvbnm,./"]
const ROW_SHIFT = [0, 0.5, 0.8, 1.2]
const SHIFTED: Record<string, string> = { "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0", _: "-", "+": "=", "{": "[", "}": "]", ":": ";", '"': "'", "<": ",", ">": ".", "?": "/", "~": "`" }

export type Key = { row: number; col: number; hand: "L" | "R"; finger: number; shift: boolean }

// finger indexes match POINTS in photo-warp: 0-3 left pinky→index, 5-8 right index→pinky, 10 right thumb
export function keyFor(ch: string): Key {
  if (ch === " ") return { row: 4, col: 5.5, hand: "R", finger: 10, shift: false }
  if (ch === "\n") return { row: 2, col: 12.4, hand: "R", finger: 8, shift: false }
  if (ch === "\b") return { row: 0, col: 13, hand: "R", finger: 8, shift: false }
  if (ch === "\t") return { row: 1, col: -0.4, hand: "L", finger: 0, shift: false }
  let base = ch
  let shift = false
  if (SHIFTED[ch]) { base = SHIFTED[ch]; shift = true } else if (/[A-Z]/.test(ch)) { base = ch.toLowerCase(); shift = true }
  for (let r = 0; r < ROWS.length; r++) {
    const c = ROWS[r].indexOf(base)
    if (c < 0) continue
    const k = r === 0 ? c - 1 : c // finger zones line up with the home row
    if (k <= 4) return { row: r, col: c + ROW_SHIFT[r], hand: "L", finger: [0, 0, 1, 2, 3][Math.max(0, k)], shift }
    return { row: r, col: c + ROW_SHIFT[r], hand: "R", finger: k <= 6 ? 5 : k === 7 ? 6 : k === 8 ? 7 : 8, shift }
  }
  return { row: 2, col: 6, hand: "R", finger: 5, shift: false }
}

const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]

/** Centre of a key on the photo, in photo pixels. */
export function keyPos(row: number, col: number): P {
  const u = Math.min(1, Math.max(0, (col + 0.5) / 13.5))
  const v = (row + 0.5) / 5
  return lerp(lerp(KB.tl, KB.tr, u), lerp(KB.bl, KB.br, u), v)
}
