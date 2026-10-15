import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import { easeInOut, ease, gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion'
import Footer from './Footer'

let first = true

const curtain = {
  initial: { scaleY: 1, transformOrigin: '50% 0%' },
  animate: { scaleY: 0, transformOrigin: '50% 0%', transition: { duration: 0.6, ease: easeInOut, delay: 0.05 } },
  exit: { scaleY: 1, transformOrigin: '50% 100%', transition: { duration: 0.45, ease: easeInOut } },
}

const content = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: 0.25 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3, ease: easeInOut } },
}

export default function Page({ title, children, className = '' }) {
  const skipCurtain = first
  const ref = useRef(null)

  // Editorial images unmask as they enter the viewport (transform/clip only, no layout shift)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.utils.toArray('.reveal-clip', ref.current).forEach((el) => {
        const img = el.querySelector('img')
        gsap.fromTo(el, { clipPath: 'inset(10% 8% 10% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
        if (img) gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      })
    },
    { scope: ref }
  )
  useEffect(() => {
    first = false
    // Recalculate scroll-trigger positions once the enter transition and images have settled
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 900)
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => {
      clearTimeout(t1)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  useEffect(() => {
    document.title = title ? `${title} — Embrace Luxury` : 'Embrace Luxury — Fine Jewellery'
  }, [title])

  return (
    <>
      <motion.div ref={ref} className={`page ${className}`} variants={content} initial={skipCurtain ? false : 'initial'} animate="animate" exit="exit">
        {children}
        <Footer />
      </motion.div>
      <motion.div
        className="curtain"
        aria-hidden="true"
        variants={curtain}
        initial={skipCurtain ? { scaleY: 0 } : 'initial'}
        animate="animate"
        exit="exit"
      >
        <span className="curtain__logo script">Embrace Luxury</span>
      </motion.div>
    </>
  )
}
