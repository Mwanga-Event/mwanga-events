# Mwanga Events — Web Design System v1.0

Derived from the Mwanga Events Identity Study (Sept 2026) and benchmarked against the
digital presence of the world's premium event-production brands — **TAIT** (Taylor Swift,
Beyoncé, Sphere Las Vegas), **Moment Factory** (multimedia environments), **PRG** and
**Solotech** (global AV production). The goal: a site that reads as couture, not as a
printing shop — the best event-brand UI/UX on the continent.

---

## 1. Principles (from the reference study)

| Pattern | Source | How Mwanga uses it |
|---|---|---|
| Mono-numbered sections (`01 — THE COMPANY`) | TAIT's `001/0012` indexing | IBM Plex Mono section indices, uppercase, tracked |
| Client/capability marquee | TAIT | Infinite service marquee between hero and manifesto |
| Full-bleed dark imagery, editorial grid | Moment Factory | Graded photography, staggered two-column work grid |
| Serif display + technical mono detail | Identity study | Cormorant Garamond display, Plex Mono spec lines |
| Generative, mathematical brand marks | Identity study | The five marks are **drawn live in SVG by code** — never exported bitmaps |
| "One night, in order" palette narrative | Identity study p.2 | The process section IS the palette: 4 phases = 4 colours |

**Colour law (hard rule from the brand book):** any surface uses at most **two brand
colours plus the ink**. Never all four at once — except the process section, whose whole
point is the sequence.

## 2. Colour tokens

| Token | Name | Hex | Role |
|---|---|---|---|
| `--color-usiku` | Usiku (Night) | `#0B0907` | Primary ground. "Before the doors." |
| `--color-jua` | Jua (Ember) | `#B2471E` | Warm accent, hover states, phase 2. |
| `--color-mwanga` | Mwanga (Light) | `#D9A227` | THE accent. CTAs, highlights, the moment. |
| `--color-nuru` | Nuru (Clarity) | `#F4F1EA` | Light ground + primary text on dark. |
| derived | ink on light | `#191512` | Body text on Nuru surfaces. |
| derived | hairline | `nuru @ 14%` / `usiku @ 14%` | 1px rules everywhere. |

Photography treatment: darkened multiply gradient (`usiku 92% → 30%`) + slight
desaturation so the gold type always sits on calm ground.

## 3. Typography

| Role | Face | Weight / style | Case & tracking |
|---|---|---|---|
| Display / wordmark | Cormorant Garamond | 300 | Uppercase, tracking 0.18–0.26em |
| Editorial headlines | Cormorant Garamond | 300 + 400 italic accents | Sentence case, tight leading (0.95–1.05) |
| UI / body | Archivo | 400–600 | Sentence case, 15–17px, 1.6 leading |
| Spec / meta / nav | IBM Plex Mono | 400–500 | Uppercase, 11–12px, tracking 0.18em |

Scale (fluid): display `clamp(4rem, 11vw, 10rem)`, h2 `clamp(2.4rem, 5.4vw, 4.6rem)`,
h3 `clamp(1.6rem, 2.6vw, 2.2rem)`. Mono meta fixed at 11px.

## 4. Layout

- Container: `max-width 1520px`, gutters `clamp(20px, 5vw, 72px)`.
- Section rhythm: `clamp(6rem, 12vh, 10rem)` vertical padding; every section opens with
  the mono index + hairline header row.
- 12-col mental grid; work gallery uses asymmetric 7/5 split with vertical stagger.
- Hairlines (1px, 14% opacity) do the structural work — no boxes, no shadows, no rounded
  cards. Radius is reserved for pill buttons only.

## 5. Motion

Engine: **GSAP 3 + ScrollTrigger + SplitText** with **Lenis** smooth scroll (lerp 0.1).

| Token | Value | Used for |
|---|---|---|
| `ease-out-expo` | `expo.out` | Everything that enters |
| `duration-reveal` | 1.2s | Line/word reveals |
| `duration-micro` | 0.4s | Hovers, buttons |
| stagger | 0.06–0.09s | Split lines, chord draws |

Signature moves:
1. **Preloader** — mono counter 000→100 while the Nyota mark draws its chords; panel
   lifts away with `expo.inOut`.
2. **Chord-draw** — every brand mark animates `stroke-dashoffset` per line, staggered.
   The hero Nyota then rotates continuously (120s/turn).
3. **Masked line reveals** — headlines split to lines, translate-Y from 110% inside
   `overflow:hidden` wrappers.
4. **Parallax** — gallery images move −8%/+8% against scroll; inner image scales 1.12→1.
5. **Service rows** — hairline rows; hover draws that service's mark and floats a
   preview image that follows the cursor (quickTo).
6. **Magnetic CTA** — button translates toward cursor within 24px radius.
7. Respect `prefers-reduced-motion`: all of the above collapse to opacity fades.

## 6. Components

- **Nav**: fixed; left = live mark + wordmark; center = Archivo links with gold hover
  underline sweep; right = live Kampala clock (mono, `EAT`) + pill CTA. Transparent over
  hero → glass (`backdrop-blur`, usiku 72%, bottom hairline) after 80px. Mobile/menu
  button opens a full-screen Usiku overlay: giant serif links staggered in, mono indices,
  contact block.
- **Pill button**: 1px outline, mono uppercase label; hover fills `mwanga`, ink text;
  arrow glyph slides.
- **Marquee**: hairline-bounded strip, 32s linear loop, serif+mono alternating items with
  gold separator dots.
- **Stat counters**: mono numbers tween from 0 on enter, serif unit labels.
- **Work card**: image (graded), mono caption row `VENUE — YEAR — SCOPE`, serif title;
  hover: inner zoom + caption underline.
- **Process panels**: 4 vertical panels in the exact palette order; desktop hover
  expands the active panel (flex-grow); each carries its phase name in serif + mono
  definition.
- **Footer**: contact CTA block, 4-column mono/Archivo link grid, giant clipped
  wordmark at the very bottom (Moment-Factory-style sign-off), legal line with
  coordinates `0.3476° N, 32.5825° E — KAMPALA`.

## 7. The five marks as system icons

Each service owns one mark from the identity study, generated from its true math:

| Service | Mark | Math |
|---|---|---|
| LED Screen Hire | **Nyota** | 360 chords, n → 3n mod 360 |
| Event Production | **Tundu** | 44 hexagons, 4.5° / 0.968 ratio iris |
| Live Streaming | **Mlio** | 2 × 26 interference wavefronts |
| Branding & Setup | **Kaustiki** | 200-circle cardioid caustic |
| Full Event Management | **Sauti** | 4,000-point damped harmonograph |

Stroke colour interpolates Jua → Mwanga → Nuru across each mark's elements, exactly as
plated in the identity study.

## 8. Photography direction — "one night, in order"

The palette IS the shot list. Photography must show the machinery behind the promise,
not just beautiful event photos. Brief every shoot in the four phases:

| Phase | Shoot | Subjects |
|---|---|---|
| **Usiku** (before the doors) | Empty venue, low light | Bare rooms, site surveys, cases rolling in, cable runs, engineers in headlamps |
| **Jua** (the room warms) | Build & rehearsal | LED walls going up panel by panel, truss climbing, line arrays flown, lighting checks, FOH consoles, colour-matching on the panels |
| **Mwanga** (the moment) | Show at full intensity | Stage depth with haze, operators mid-cue, camera crews, the crowd lit by the rig |
| **Nuru** (what they keep) | Aftermath & artefacts | Guest close-ups, quiet emptied room, teardown, the stream archive on a screen |

Always include: cables, cases, truss, screens, engineers. Credibility lives in the
hands-on detail. Until the first real shoot, the AI concept visuals stand in and are
labelled "Production scenarios" — never presented as a real portfolio.

## 9. Tech stack (and why)

- **Vite + vanilla ES modules** — a marketing site is content + choreography; no
  framework runtime to fight, instant loads, trivially deployable (Vercel/Netlify).
- **Tailwind CSS v4** — tokens live in CSS `@theme`, utilities for rhythm, custom CSS
  for the couture details.
- **GSAP 3 (ScrollTrigger, SplitText)** — the industry standard behind virtually every
  Awwwards-level production site; all plugins now free.
- **Lenis** — the smooth-scroll used by the top studios; syncs to GSAP's ticker.
- Self-hosted imagery, system-fallback-safe Google Fonts, single-page — fast on
  Kampala mobile networks.
