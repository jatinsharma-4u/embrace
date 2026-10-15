import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false, // native momentum on touch devices feels best
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export const getLenis = () => lenis

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true })
  else window.scrollTo({ top: 0, behavior: immediate ? 'instant' : 'smooth' })
}

export function scrollToEl(el, offset = -90) {
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
}

export function lockScroll(lock) {
  if (lenis) lock ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

// Shared motion tokens (Framer Motion)
export const ease = [0.22, 1, 0.36, 1]
export const easeInOut = [0.65, 0, 0.35, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: i * 0.06 } }),
}

export const stagger = (s = 0.06, d = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: s, delayChildren: d } },
})

export { gsap, ScrollTrigger }
