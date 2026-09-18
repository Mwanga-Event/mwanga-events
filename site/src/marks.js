/*
 * The five Mwanga marks, generated live from the math in the identity study.
 * Every function returns an <svg> string whose strokes interpolate
 * Jua (#B2471E) → Mwanga (#D9A227) → Nuru (#F4F1EA), as plated in the study.
 */

const JUA = [0xb2, 0x47, 0x1e]
const MWANGA = [0xd9, 0xa2, 0x27]
const NURU = [0xf4, 0xf1, 0xea]

function lerp(a, b, t) {
  return a + (b - a) * t
}

/** t in [0,1] → hex colour along Jua → Mwanga → Nuru */
export function nightRamp(t) {
  const [c0, c1, u] = t < 0.5 ? [JUA, MWANGA, t * 2] : [MWANGA, NURU, (t - 0.5) * 2]
  const c = c0.map((v, i) => Math.round(lerp(v, c1[i], u)))
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

function svgOpen(size, cls) {
  return `<svg viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg" class="${cls}" aria-hidden="true">`
}

/* MARK 4D: Nyota. 360 chords, point n joined to point 3n modulo 360. */
export function nyota({ size = 600, points = 360, mult = 3, stroke = 0.55, cls = '' } = {}) {
  const r = size / 2 - stroke
  const cx = size / 2
  const lines = []
  for (let n = 0; n < points; n++) {
    const a1 = (n / points) * Math.PI * 2 - Math.PI / 2
    const a2 = ((n * mult) % points) / points * Math.PI * 2 - Math.PI / 2
    // edge chords stay ember, chords crossing the middle go white: like the plate
    const midY = Math.abs((Math.sin(a1) + Math.sin(a2)) / 2)
    const t = 1 - Math.min(1, midY * 1.15)
    lines.push(
      `<line x1="${(cx + r * Math.cos(a1)).toFixed(2)}" y1="${(cx + r * Math.sin(a1)).toFixed(2)}" x2="${(cx + r * Math.cos(a2)).toFixed(2)}" y2="${(cx + r * Math.sin(a2)).toFixed(2)}" stroke="${nightRamp(t)}" stroke-width="${stroke}" stroke-opacity="0.85"/>`
    )
  }
  return `${svgOpen(size, cls)}${lines.join('')}</svg>`
}

/* MARK 4C: Tundu. 44 hexagons, each turned 4.5° and shrunk by 0.968, gold pupil. */
export function tundu({ size = 600, count = 44, turn = 4.5, ratio = 0.968, stroke = 0.9, cls = '' } = {}) {
  const cx = size / 2
  let r = size / 2 - stroke
  let rot = 0
  const shapes = []
  for (let i = 0; i < count; i++) {
    const pts = []
    for (let k = 0; k < 6; k++) {
      const a = ((k / 6) * 360 + rot) * (Math.PI / 180) - Math.PI / 2
      pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cx + r * Math.sin(a)).toFixed(2)}`)
    }
    shapes.push(
      `<polygon points="${pts.join(' ')}" stroke="${nightRamp(i / (count - 1))}" stroke-width="${stroke}" stroke-opacity="0.9" fill="none"/>`
    )
    r *= ratio ** 3.2
    rot += turn * 2.2
  }
  shapes.push(`<circle cx="${cx}" cy="${cx}" r="${size * 0.045}" fill="#D9A227"/>`)
  return `${svgOpen(size, cls)}${shapes.join('')}</svg>`
}

/* MARK 4E: Mlio. Two sources, 26 wavefronts each. */
export function mlio({ size = 600, rings = 26, cls = '', stroke = 0.8 } = {}) {
  const cy = size / 2
  const sep = size * 0.052
  const s1 = size / 2 - sep
  const s2 = size / 2 + sep
  const maxR = size / 2 - stroke
  const parts = []
  for (let i = 1; i <= rings; i++) {
    const r = (i / rings) * maxR
    const t = 1 - i / rings
    const c = nightRamp(t * 0.8)
    parts.push(
      `<circle cx="${s1}" cy="${cy}" r="${r.toFixed(2)}" stroke="${c}" stroke-width="${stroke}" stroke-opacity="0.75" fill="none"/>`,
      `<circle cx="${s2}" cy="${cy}" r="${r.toFixed(2)}" stroke="${c}" stroke-width="${stroke}" stroke-opacity="0.75" fill="none"/>`
    )
  }
  parts.push(
    `<circle cx="${s1}" cy="${cy}" r="${size * 0.018}" fill="#D9A227"/>`,
    `<circle cx="${s2}" cy="${cy}" r="${size * 0.018}" fill="#D9A227"/>`
  )
  return `${svgOpen(size, cls)}<g clip-path="circle(${maxR}px at ${size / 2}px ${cy}px)">${parts.join('')}</g></svg>`
}

/* MARK 4A: Kaustiki. Circles centred on a rim, all passing through one point. */
export function kaustiki({ size = 600, circles = 120, cls = '', stroke = 0.6 } = {}) {
  const cx = size / 2
  const R = size * 0.33
  const py = cx - R // the fixed point, top of the rim
  const parts = []
  for (let i = 0; i < circles; i++) {
    const a = (i / circles) * Math.PI * 2 - Math.PI / 2
    const ox = cx + R * Math.cos(a)
    const oy = cx + R * Math.sin(a)
    const r = Math.hypot(ox - cx, oy - py)
    if (r < 1) continue
    parts.push(
      `<circle cx="${ox.toFixed(2)}" cy="${oy.toFixed(2)}" r="${r.toFixed(2)}" stroke="${nightRamp(1 - i / circles)}" stroke-width="${stroke}" stroke-opacity="0.7" fill="none"/>`
    )
  }
  parts.push(`<circle cx="${cx}" cy="${py}" r="${size * 0.014}" fill="#F4F1EA"/>`)
  return `${svgOpen(size, cls)}${parts.join('')}</svg>`
}

/* MARK 4B: Sauti. Damped harmonograph, one continuous line. */
export function sauti({ size = 600, points = 4000, cls = '', stroke = 0.9 } = {}) {
  const cx = size / 2
  const A = size * 0.4
  const pts = []
  for (let i = 0; i < points; i++) {
    const t = i * 0.012
    const d = Math.exp(-t * 0.028)
    const x = cx + A * d * (Math.sin(t * 2.01 + 1.2) + 0.4 * Math.sin(t * 5.02))
    const y = cx + A * d * (Math.sin(t * 3.005 + 0.4) + 0.4 * Math.sin(t * 4.01 + 2))
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  // three passes of colour: split the single line into gradient segments
  const segs = 24
  const per = Math.floor(points / segs)
  const parts = []
  for (let s = 0; s < segs; s++) {
    const slice = pts.slice(s * per, (s + 1) * per + 1)
    parts.push(
      `<polyline points="${slice.join(' ')}" stroke="${nightRamp(s / (segs - 1))}" stroke-width="${stroke}" stroke-opacity="0.85" fill="none" stroke-linecap="round"/>`
    )
  }
  return `${svgOpen(size, cls)}${parts.join('')}</svg>`
}

export const MARKS = { nyota, tundu, mlio, kaustiki, sauti }
