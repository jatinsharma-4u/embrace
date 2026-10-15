import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion'
import Footer from './Footer'

export default function Page({ title, children, className = '' }) {
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
    // Recalculate scroll-trigger positions once the enter transition and images have settled
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 400)
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
    <div ref={ref} className={`page ${className}`}>
      {children}
      <Footer />
    </div>
  )
}
