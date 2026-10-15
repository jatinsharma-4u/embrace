import { useEffect, useRef } from 'react'
import { sparkleAnimation } from '../lib/sparkleLottie'
import { prefersReducedMotion } from '../lib/motion'

// lottie_light (SVG renderer only) is code-split and fetched the first time a sparkle appears.
let lottiePromise
const loadLottie = () => (lottiePromise ??= import('lottie-web/build/player/lottie_light').then((m) => m.default))

export default function Sparkle({ size = 48, loop = true, className = '' }) {
  const ref = useRef(null)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    let anim
    let cancelled = false
    loadLottie().then((lottie) => {
      if (cancelled || !ref.current) return
      anim = lottie.loadAnimation({
        container: ref.current,
        renderer: 'svg',
        loop,
        autoplay: true,
        animationData: structuredClone(sparkleAnimation),
      })
    })
    return () => {
      cancelled = true
      anim?.destroy()
    }
  }, [loop, reduced])

  if (reduced)
    return (
      <span className={`sparkle-static ${className}`} style={{ width: size, height: size }} aria-hidden="true">
        ✦
      </span>
    )
  return <span ref={ref} className={className} style={{ width: size, height: size, display: 'inline-block' }} aria-hidden="true" />
}
