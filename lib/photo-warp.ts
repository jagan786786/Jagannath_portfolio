/*
  Draws the hero photo with WebGL and bends it smoothly in a few places
  (fingers, hands, shoulders, head) — like a "liquify" brush that moves every
  frame. Bending the picture itself avoids the ghost edges you get from moving
  cut-out patches. Everything is in the photo's own pixel space (IW × IH).
*/

export const IW = 1024
export const IH = 572

/** Motion points: [x, y, radius] in photo pixels. Indexes are used by the animator. */
export const POINTS: [number, number, number][] = [
  [626, 418, 6], [632, 412, 6], [636, 405.5, 6], [638, 398, 6], // 0-3 left pinky, ring, middle, index
  [617, 402, 22], //                                              4 left hand
  [708, 412, 6.5], [717, 416, 6.5], [725, 421, 6.5], [731, 426, 6.5], // 5-8 right index, middle, ring, pinky
  [703, 420, 24], //                                              9 right hand
  [694, 431, 6], //                                               10 right thumb (space bar)
  [545, 330, 150], //                                             11 shoulders / chest (breathing)
]
export const HEAD = { cx: 540, cy: 192, r: 86, px: 533, py: 290 } // head area and neck pivot

export type Fit = { s: number; x: number; y: number; w: number; h: number }

const VS = `attribute vec2 a; varying vec2 v; void main(){ v = a * .5 + .5; gl_Position = vec4(a, 0., 1.); }`
const FS = `precision highp float;
varying vec2 v;
uniform sampler2D tex; uniform vec2 res; uniform vec3 fit;
uniform vec3 pts[${POINTS.length}]; uniform vec2 offs[${POINTS.length}];
uniform vec3 head; uniform vec2 headC; uniform vec2 headOff; uniform float headR;
void main(){
  vec2 css = vec2(v.x * res.x, (1. - v.y) * res.y);
  vec2 p = (css - fit.yz) / fit.x;
  vec2 d = vec2(0.);
  for (int i = 0; i < ${POINTS.length}; i++) { vec2 q = p - pts[i].xy; d += exp(-dot(q, q) / (pts[i].z * pts[i].z)) * offs[i]; }
  vec2 hq = p - headC; float hw = exp(-dot(hq, hq) / (headR * headR));
  vec2 r = p - head.xy; float a = head.z;
  vec2 rot = vec2(cos(a) * r.x - sin(a) * r.y, sin(a) * r.x + cos(a) * r.y);
  d += hw * ((rot - r) + headOff);
  gl_FragColor = texture2D(tex, clamp((p - d) / vec2(${IW}., ${IH}.), 0., 1.));
}`

export class PhotoWarp {
  private gl: WebGLRenderingContext
  private u: Record<string, WebGLUniformLocation | null> = {}
  ready = false

  private constructor(private canvas: HTMLCanvasElement, gl: WebGLRenderingContext, src: string, onReady: () => void) {
    this.gl = gl
    const sh = (type: number, code: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, code); gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader")
      return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link")
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "a")
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    for (const n of ["tex", "res", "fit", "pts", "offs", "head", "headC", "headOff", "headR"]) this.u[n] = gl.getUniformLocation(prog, n)
    gl.uniform3fv(this.u.pts, new Float32Array(POINTS.flat()))
    gl.uniform2f(this.u.headC, HEAD.cx, HEAD.cy)
    gl.uniform1f(this.u.headR, HEAD.r)
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
    for (const [k, val] of [[gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE], [gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR]]) gl.texParameteri(gl.TEXTURE_2D, k, val)
    const img = new Image()
    img.decoding = "async"
    img.onload = () => { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); this.ready = true; onReady() }
    img.src = src
  }

  /** Returns null when WebGL isn't available; the caller keeps showing the plain photo. */
  static create(canvas: HTMLCanvasElement, src: string, onReady: () => void) {
    try {
      const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false, powerPreference: "low-power" })
      return gl ? new PhotoWarp(canvas, gl, src, onReady) : null
    } catch {
      return null
    }
  }

  resize(fit: Fit) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    this.canvas.width = Math.round(fit.w * dpr)
    this.canvas.height = Math.round(fit.h * dpr)
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  /** offs: 2 numbers per POINT (dx, dy in photo px); head: rotation (radians) and offset. */
  draw(fit: Fit, offs: Float32Array, head: { a: number; x: number; y: number }) {
    if (!this.ready) return
    const { gl, u } = this
    gl.uniform2f(u.res, fit.w, fit.h)
    gl.uniform3f(u.fit, fit.s, fit.x, fit.y)
    gl.uniform2fv(u.offs, offs)
    gl.uniform3f(u.head, HEAD.px, HEAD.py, head.a)
    gl.uniform2f(u.headOff, head.x, head.y)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
}
