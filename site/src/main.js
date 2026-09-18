import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'
import { nyota, tundu, mlio, kaustiki, sauti } from './marks.js'

gsap.registerPlugin(ScrollTrigger, SplitText)

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (reduced) document.documentElement.classList.add('reduced-motion')

const EASE = 'expo.out'

/* ───────────────── smooth scroll ───────────────── */

const lenis = new Lenis({ lerp: 0.1, smoothWheel: !reduced })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)

// delegated so anchors injected later (service spec links) smooth-scroll too
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]')
  if (!a) return
  const href = a.getAttribute('href')
  if (href === '#') return // action links get real hrefs at click time
  const target = document.querySelector(href)
  if (!target) return
  e.preventDefault()
  closeMenu()
  lenis.scrollTo(target, { offset: href === '#top' ? 0 : -40, duration: 1.4 })
})
document.getElementById('to-top').addEventListener('click', () => lenis.scrollTo(0, { duration: 1.4 }))

/* ───────────────── inject brand marks ───────────────── */

document.getElementById('hero-mark').innerHTML = nyota({ points: 240, stroke: 0.6 })
// move centering from Tailwind classes to GSAP so mouse parallax can offset x/y
gsap.set('#hero-mark', { xPercent: -50, yPercent: -50 })
document.getElementById('preloader-mark').innerHTML = nyota({ points: 140, stroke: 0.7 })
document.getElementById('nav-mark').innerHTML = nyota({ points: 90, stroke: 3.2 })

/* ───────────────── services list ───────────────── */

// DEMO FIGURES in `specs`: confirm every number with the client before launch
const SERVICES = [
  {
    n: '01', key: 'led', title: 'LED Screen Hire', mark: nyota({ points: 120, stroke: 1.6 }),
    markName: 'Nyota · 360 chords', desc: 'Indoor and outdoor LED walls, any pitch, any geometry: flown, ground-stacked or curved.',
    specs: ['P2.6 / P3.9 / P4.8', 'Indoor + outdoor', 'Up to 400m² inventory', '4K/60 processing', 'On-site engineering'],
  },
  {
    n: '02', key: 'production', title: 'Event Production', mark: tundu({ stroke: 1.4 }),
    markName: 'Tundu · 44 hexagons', desc: 'Sound, lighting, truss and staging designed as one system, from club rooms to festival mainstages.',
    specs: ['Line-array PA', 'Certified truss + stages', 'Moving-head rigs', 'Full technical drawings'],
  },
  {
    n: '03', key: 'streaming', title: 'Live Streaming', mark: mlio({ stroke: 1.4 }),
    markName: 'Mlio · 2 × 26 wavefronts', desc: 'Multi-camera broadcast, vision mixing and redundant uplinks. One event, every screen in East Africa.',
    specs: ['Up to 6 cameras', 'Vision mixing + graphics', 'Redundant uplinks', 'Multi-platform delivery'],
  },
  {
    n: '04', key: 'branding', title: 'Branding & Setup', mark: kaustiki({ circles: 90, stroke: 1.2 }),
    markName: 'Kaustiki · cardioid caustic', desc: 'Stage design, backdrops, wayfinding and environmental brand moments, installed to the identity.',
    specs: ['Stage + set design', 'Large-format print', 'Wayfinding systems', 'Screen content design'],
  },
  {
    n: '05', key: 'management', title: 'Full Event Management', mark: sauti({ stroke: 1.6 }),
    markName: 'Sauti · damped harmonograph', desc: 'One contract, one team, one outcome: a producer beside you until the last case is packed.',
    specs: ['Concept to strike', 'Vendor management', 'Run-of-show direction', 'Single point of contact'],
  },
]

document.getElementById('services-list').innerHTML = SERVICES.map(
  (s, i) => `
  <div class="service-row hairline-t ${i === SERVICES.length - 1 ? 'hairline-b' : ''}" data-service="${s.key}" data-reveal>
    <span class="mono-meta text-mwanga w-10">${s.n}</span>
    <div>
      <h3 class="service-title">${s.title}</h3>
      <p class="service-desc mt-3 hidden sm:block">${s.desc}</p>
      <p class="service-specs mt-3">${s.specs.join('<span class="sep">·</span>')}</p>
      <p class="mt-4"><a class="spec-link" href="#spec-sheet">View technical specification →</a></p>
    </div>
    <div class="service-mark">${s.mark}</div>
  </div>`
).join('')

/* ───────────────── marquee ───────────────── */

const MARQUEE = ['LED Screens', 'Event Production', 'Live Streaming', 'Branding & Setup', 'Event Management', 'Kampala', 'East Africa']
const marqueeHTML = MARQUEE.map((m) => `<span class="marquee-item"><span class="marquee-dot"></span>${m}</span>`).join('')
document.getElementById('marquee-a').innerHTML = marqueeHTML
document.getElementById('marquee-b').innerHTML = marqueeHTML

/* marquee drifts on its own and accelerates with scroll velocity */
if (!reduced) {
  const marqueeTween = gsap.to('.marquee-track', { xPercent: -100, duration: 36, ease: 'none', repeat: -1 })
  let tsTarget = 1
  let tsCur = 1
  lenis.on('scroll', ({ velocity }) => {
    tsTarget = 1 + Math.min(Math.abs(velocity) / 40, 3)
  })
  gsap.ticker.add(() => {
    tsTarget += (1 - tsTarget) * 0.04 // decay back to cruise speed
    tsCur += (tsTarget - tsCur) * 0.1
    marqueeTween.timeScale(tsCur)
  })
}

/* ───────────────── live Kampala clock (EAT, UTC+3) ───────────────── */

const clockEl = document.getElementById('clock')
function tickClock() {
  clockEl.textContent = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Africa/Kampala',
  }).format(new Date())
}
tickClock()
setInterval(tickClock, 1000)

/* ───────────────── preloader + hero intro ───────────────── */

function prepareChordDraw(container) {
  const lines = container.querySelectorAll('line, polygon, polyline, circle')
  lines.forEach((el) => {
    const len = el.getTotalLength?.() || 100
    el.style.strokeDasharray = len
    el.style.strokeDashoffset = len
  })
  return lines
}

const heroTitle = document.getElementById('hero-title')
let heroSplit
try {
  heroSplit = new SplitText(heroTitle, { type: 'chars' })
} catch {
  heroSplit = null
}

function heroIntro() {
  const heroLines = prepareChordDraw(document.getElementById('hero-mark'))
  const tl = gsap.timeline({ defaults: { ease: EASE } })
  tl.to(heroLines, { strokeDashoffset: 0, duration: 2.4, stagger: { each: 0.006, from: 'random' } }, 0)
  if (heroSplit) {
    gsap.set(heroTitle, { opacity: 1 })
    tl.from(heroSplit.chars, { yPercent: 108, opacity: 0, duration: 1.4, stagger: 0.045 }, 0.25)
  }
  tl.to('[data-hero-fade]', { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 }, 0.7)
  tl.from('#hero-img', { scale: 1.12, duration: 2.6, ease: 'power2.out' }, 0)
  // opacity only: #nav's CSS transitions its transform, so GSAP must not touch it
  tl.to('#nav', { autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, 0.9)
}

gsap.set('[data-hero-fade]', { opacity: 0, y: 26 })
gsap.set(heroTitle, { opacity: 0 })
gsap.set('#nav', { autoAlpha: 0 })

const preloader = document.getElementById('preloader')
if (reduced) {
  preloader.remove()
  gsap.set(['[data-hero-fade]', heroTitle], { opacity: 1, y: 0 })
  gsap.set('#nav', { autoAlpha: 1 })
} else {
  const preLines = prepareChordDraw(document.getElementById('preloader-mark'))
  const counter = { v: 0 }
  const countEl = document.getElementById('preloader-count')
  const tl = gsap.timeline()
  tl.to(preLines, { strokeDashoffset: 0, duration: 1.7, ease: 'power2.inOut', stagger: { each: 0.008, from: 'start' } }, 0)
  tl.to(counter, {
    v: 100, duration: 1.9, ease: 'power2.inOut',
    onUpdate: () => (countEl.textContent = String(Math.round(counter.v)).padStart(3, '0')),
  }, 0)
  tl.to(preloader, {
    yPercent: -100, duration: 1.1, ease: 'expo.inOut', delay: 0.15,
    onComplete: () => preloader.remove(),
  })
  tl.add(heroIntro, '-=0.55')
}

/* ───────────────── nav behaviour ───────────────── */

const nav = document.getElementById('nav')
let lastY = 0
lenis.on('scroll', ({ scroll }) => {
  const scrolled = scroll > 80
  if (scrolled !== nav.classList.contains('is-scrolled')) nav.classList.toggle('is-scrolled', scrolled)
  // hide on scroll down, show on scroll up (only past the hero).
  // Only act on a decisive move (> 12px since the last state change), so the
  // shrinking per-frame deltas of Lenis's smooth deceleration can't flip the
  // state back and forth and shake the bar. Class writes are guarded because
  // even a no-op classList.remove() rewrites the attribute.
  const hidden = nav.classList.contains('is-hidden')
  const dy = scroll - lastY
  if (scroll <= window.innerHeight * 0.9) {
    if (hidden) nav.classList.remove('is-hidden')
    lastY = scroll
  } else if (Math.abs(dy) > 12) {
    if (dy > 0 && !hidden && !document.body.classList.contains('menu-open')) {
      nav.classList.add('is-hidden')
    } else if (dy < 0 && hidden) {
      nav.classList.remove('is-hidden')
    }
    lastY = scroll
  }
})

/* overlay menu */
const menuBtn = document.querySelector('.menu-btn')
const overlay = document.getElementById('menu-overlay')
const menuTl = gsap.timeline({ paused: true })
menuTl
  .set(overlay, { visibility: 'visible' })
  .to(overlay, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' })
  .from(overlay.querySelectorAll('.menu-item'), { y: 60, opacity: 0, duration: 0.8, ease: EASE, stagger: 0.07 }, '-=0.35')

let menuOpen = false
function closeMenu() {
  if (!menuOpen) return
  menuOpen = false
  document.body.classList.remove('menu-open')
  menuBtn.setAttribute('aria-expanded', 'false')
  menuTl.reverse()
  lenis.start()
}
menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen
  document.body.classList.toggle('menu-open', menuOpen)
  menuBtn.setAttribute('aria-expanded', String(menuOpen))
  if (menuOpen) {
    nav.classList.remove('is-hidden')
    menuTl.play()
    lenis.stop()
  } else {
    menuTl.reverse()
    lenis.start()
  }
})

/* ───────────────── scroll reveals ───────────────── */

document.querySelectorAll('[data-split]').forEach((el) => {
  let split
  try {
    split = new SplitText(el, { type: 'lines', mask: 'lines' })
  } catch {
    return
  }
  gsap.from(split.lines, {
    yPercent: 112, opacity: reduced ? 1 : undefined, duration: 1.3, ease: EASE, stagger: 0.09,
    scrollTrigger: { trigger: el, start: 'top 82%' },
  })
})

document.querySelectorAll('[data-reveal]').forEach((el) => {
  gsap.fromTo(el, { opacity: 0, y: 34 }, {
    opacity: 1, y: 0, duration: 1.25, ease: EASE,
    scrollTrigger: { trigger: el, start: 'top 88%' },
  })
})

/* footer wordmark: no movement, just a slow reveal from black to charcoal
   as the reader arrives at the very bottom */
gsap.fromTo('#footer-word', { opacity: 0.12 }, {
  opacity: 1, ease: 'none',
  scrollTrigger: { trigger: '#footer-word', start: 'top bottom', end: 'bottom bottom', scrub: true },
})

/* parallax on work images */
if (!reduced) {
  document.querySelectorAll('[data-parallax] img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -7 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: img.closest('[data-parallax]'), start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })
}

/* Each mark builds itself by its own construction logic, once, when its row
   enters the viewport. Slow and atmospheric, per the identity study. */
document.querySelectorAll('.service-mark').forEach((markEl) => {
  const kind = markEl.closest('.service-row').dataset.service
  const svg = markEl.querySelector('svg')
  const lines = prepareChordDraw(markEl)
  const tl = gsap.timeline({
    scrollTrigger: { trigger: markEl.closest('.service-row'), start: 'top 85%' },
  })
  if (kind === 'production') {
    // Tundu: hexagons rotate inward as they draw
    tl.to(lines, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', stagger: { each: 0.02, from: 'start' } }, 0)
    tl.from(svg.querySelectorAll('polygon'), {
      rotation: 28, scale: 1.12, transformOrigin: '50% 50%',
      duration: 2.4, ease: 'power2.out', stagger: 0.02,
    }, 0)
  } else if (kind === 'streaming') {
    // Mlio: wavefronts propagate outward from the two sources
    tl.to(lines, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: { each: 0.02, from: 'start' } }, 0)
    tl.from(svg.querySelectorAll('circle'), {
      scale: 0.25, opacity: 0, transformOrigin: '50% 50%',
      duration: 2, ease: 'power2.out', stagger: { each: 0.025, from: 'start' },
    }, 0)
  } else if (kind === 'branding') {
    // Kaustiki: circles resolve progressively toward the focal point
    tl.to(lines, { strokeDashoffset: 0, duration: 2.4, ease: 'power1.inOut', stagger: { each: 0.018, from: 'end' } }, 0)
  } else if (kind === 'management') {
    // Sauti: the harmonograph line resolves and decays, one continuous pass
    tl.to(lines, { strokeDashoffset: 0, duration: 2.6, ease: 'power1.inOut', stagger: { each: 0.06, from: 'start' } }, 0)
  } else {
    // Nyota: chords assemble into the curve, in sequence
    tl.to(lines, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', stagger: { each: 0.012, from: 'start' } }, 0)
  }
})

/* ───────────────── service preview follows cursor ───────────────── */

const preview = document.getElementById('service-preview')
const canHover = window.matchMedia('(hover: hover)').matches
if (canHover && !reduced) {
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' })
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' })
  window.addEventListener('mousemove', (e) => {
    xTo(e.clientX + 28)
    yTo(e.clientY - 100)
  })

  let previewVisible = false
  let previewShownAt = 0
  function hidePreview() {
    if (!previewVisible) return
    previewVisible = false
    gsap.to(preview, { opacity: 0, scale: 0.9, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
  }

  document.querySelectorAll('.service-row').forEach((row) => {
    row.addEventListener('mouseenter', () => {
      preview.querySelectorAll('img').forEach((img) =>
        img.classList.toggle('is-active', img.dataset.preview === row.dataset.service)
      )
      previewVisible = true
      previewShownAt = lenis.scroll
      gsap.to(preview, { opacity: 1, scale: 1, duration: 0.45, ease: EASE, overwrite: 'auto' })
    })
    row.addEventListener('mouseleave', hidePreview)
  })

  // catches scrolling that fires no wheel/touch event (keyboard, scrollbar)
  lenis.on('scroll', ({ scroll }) => {
    if (previewVisible && Math.abs(scroll - previewShownAt) > 10) hidePreview()
  })

  // Scrolling moves the rows out from under a stationary cursor without ever
  // firing mouseleave, which would leave the preview glued to the cursor.
  // Any scroll intent, or the pointer leaving the list or window, hides it.
  window.addEventListener('wheel', hidePreview, { passive: true })
  window.addEventListener('touchmove', hidePreview, { passive: true })
  document.getElementById('services-list').addEventListener('mouseleave', hidePreview)
  document.documentElement.addEventListener('mouseleave', hidePreview)
}

/* ───────────────── magnetic buttons ───────────────── */

if (canHover && !reduced) {
  document.querySelectorAll('[data-magnetic]').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power3' })
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * 0.28)
      yTo((e.clientY - (r.top + r.height / 2)) * 0.28)
    })
    btn.addEventListener('mouseleave', () => {
      xTo(0)
      yTo(0)
    })
  })
}

/* ───────────────── scroll progress line ───────────────── */

gsap.to('#progress', {
  scaleX: 1, ease: 'none',
  scrollTrigger: { start: 'top top', end: 'max', scrub: 0.3 },
})

/* ───────────────── hero: light sweep + mouse parallax ───────────────── */

if (heroSplit && !reduced) {
  // a wash of gold light moving through the letters, like a followspot sweep
  gsap.timeline({ repeat: -1, repeatDelay: 6.5, delay: 5 })
    .to(heroSplit.chars, {
      color: '#D9A227', textShadow: '0 0 34px rgba(217,162,39,0.55)',
      duration: 0.38, stagger: 0.055, ease: 'power1.in',
    })
    .to(heroSplit.chars, {
      color: '#F4F1EA', textShadow: '0 2px 40px rgba(11,9,7,0.75)',
      duration: 0.7, stagger: 0.055, ease: 'power2.out',
    }, 0.32)
}

if (window.matchMedia('(hover: hover)').matches && !reduced) {
  const heroSec = document.querySelector('main section')
  const heroContent = document.getElementById('hero-content')
  const mmx = gsap.quickTo('#hero-mark', 'x', { duration: 1.1, ease: 'power3' })
  const mmy = gsap.quickTo('#hero-mark', 'y', { duration: 1.1, ease: 'power3' })
  const hcx = gsap.quickTo(heroContent, 'x', { duration: 1.3, ease: 'power3' })
  const hcy = gsap.quickTo(heroContent, 'y', { duration: 1.3, ease: 'power3' })
  heroSec.addEventListener('mousemove', (e) => {
    const nx = e.clientX / window.innerWidth - 0.5
    const ny = e.clientY / window.innerHeight - 0.5
    mmx(nx * 34)
    mmy(ny * 24)
    hcx(nx * -10)
    hcy(ny * -7)
  })
  heroSec.addEventListener('mouseleave', () => {
    mmx(0); mmy(0); hcx(0); hcy(0)
  })
}

/* service marks rotate gently with scroll (on the svg, so the CSS hover
   rotation on the wrapper stays independent) */
if (!reduced) {
  document.querySelectorAll('.service-mark svg').forEach((svg) => {
    gsap.to(svg, {
      rotate: 50, ease: 'none',
      scrollTrigger: { trigger: svg.closest('.service-row'), start: 'top bottom', end: 'bottom top', scrub: true },
    })
  })
}

/* ───────────────── FAQ accordion ───────────────── */

document.querySelectorAll('.faq-item').forEach((item) => {
  const btn = item.querySelector('.faq-q')
  const body = item.querySelector('.faq-a')
  btn.addEventListener('click', () => {
    const open = item.classList.toggle('open')
    btn.setAttribute('aria-expanded', String(open))
    gsap.to(body, { height: open ? 'auto' : 0, duration: 0.6, ease: 'expo.out' })
  })
})

/* ───────────────── inquiry modal ───────────────── */

{
  const inquiry = document.getElementById('inquiry')
  const panel = inquiry.querySelector('.inq-panel')
  const backdrop = inquiry.querySelector('.inq-backdrop')
  const steps = [...inquiry.querySelectorAll('.inq-step')]
  const stepnum = document.getElementById('inq-stepnum')
  const bar = document.getElementById('inq-bar')
  const inq = { type: '', svcs: new Set() }
  let inqOpen = false

  const inqTl = gsap.timeline({ paused: true })
    .set(inquiry, { visibility: 'visible' })
    .to(backdrop, { opacity: 1, duration: 0.45, ease: 'power2.out' })
    .to(panel, { opacity: 1, y: 0, duration: 0.65, ease: EASE }, '-=0.2')

  function openInq() {
    if (inqOpen) return
    inqOpen = true
    closeMenu()
    inqTl.timeScale(1).play()
    lenis.stop()
  }
  function closeInq() {
    if (!inqOpen) return
    inqOpen = false
    inqTl.timeScale(1.4).reverse()
    lenis.start()
  }
  document.querySelectorAll('[data-inquiry]').forEach((b) => b.addEventListener('click', openInq))
  inquiry.querySelector('.inq-close').addEventListener('click', closeInq)
  backdrop.addEventListener('click', closeInq)
  window.addEventListener('keydown', (e) => e.key === 'Escape' && closeInq())

  function showStep(n, dir = 1) {
    const from = inquiry.querySelector('.inq-step.active')
    const to = steps.find((s) => Number(s.dataset.step) === n)
    if (!to || from === to) return
    stepnum.textContent = `Step 0${n} / 03`
    bar.style.width = `${(n / 3) * 100}%`
    from.classList.remove('active')
    to.classList.add('active')
    gsap.fromTo(to, { opacity: 0, x: 28 * dir }, { opacity: 1, x: 0, duration: 0.5, ease: EASE })
    if (n === 3) buildSummary()
  }
  inquiry.querySelectorAll('[data-next]').forEach((b) =>
    b.addEventListener('click', () => showStep(Number(b.closest('.inq-step').dataset.step) + 1, 1))
  )
  inquiry.querySelectorAll('[data-back]').forEach((b) =>
    b.addEventListener('click', () => showStep(Number(b.closest('.inq-step').dataset.step) - 1, -1))
  )

  inquiry.querySelectorAll('[data-type]').forEach((b) =>
    b.addEventListener('click', () => {
      inq.type = b.dataset.type
      inquiry.querySelectorAll('[data-type]').forEach((o) => o.classList.toggle('sel', o === b))
    })
  )
  inquiry.querySelectorAll('[data-svc]').forEach((b) =>
    b.addEventListener('click', () => {
      const on = b.classList.toggle('sel')
      on ? inq.svcs.add(b.dataset.svc) : inq.svcs.delete(b.dataset.svc)
    })
  )

  const val = (id) => document.getElementById(id).value.trim()
  function buildSummary() {
    const svcs = [...inq.svcs].join(', ') || 'To be discussed'
    document.getElementById('inq-summary').innerHTML = [
      `EVENT&nbsp;&nbsp;&nbsp;&nbsp; ${inq.type || 'To be discussed'}`,
      `SERVICES&nbsp; ${svcs}`,
      `DATE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${val('inq-date') || 'TBC'}`,
      `LOCATION&nbsp; ${val('inq-city') || 'TBC'}`,
    ].join('<br>')
  }
  function composeMessage() {
    const svcs = [...inq.svcs].join(', ') || 'to be discussed'
    return [
      'Hello Mwanga Events!',
      `I am planning: ${inq.type || 'an event'}.`,
      `Services needed: ${svcs}.`,
      `Date: ${val('inq-date') || 'TBC'}. Location: ${val('inq-city') || 'TBC'}.`,
      `Name: ${val('inq-name') || '-'}. Phone: ${val('inq-phone') || '-'}.`,
    ].join('\n')
  }
  // set the real hrefs at click time so the latest inputs are included
  document.getElementById('inq-wa').addEventListener('click', function () {
    this.href = `https://wa.me/256700000000?text=${encodeURIComponent(composeMessage())}`
  })
  document.getElementById('inq-mail').addEventListener('click', function () {
    this.href = `mailto:hello@mwangaevents.ug?subject=${encodeURIComponent(`Event inquiry: ${inq.type || 'new event'}`)}&body=${encodeURIComponent(composeMessage())}`
  })
}
