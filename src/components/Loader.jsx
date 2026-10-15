import { useEffect, useState } from 'react'
import { AnimatePresence, motion, animate, useMotionValue, useTransform } from 'framer-motion'
import { ease, easeInOut, lockScroll } from '../lib/motion'

const CRITICAL = ['/img/p/necklace_65.webp', '/img/photo/citrine-pendant.webp', '/img/photo/emerald-rings.webp']

const preload = (src) =>
  new Promise((res) => {
    const i = new Image()
    i.onload = i.onerror = res
    i.src = src
  })

export default function Loader({ onDone }) {
  const [show, setShow] = useState(true)
  const progress = useMotionValue(0)
  const pct = useTransform(progress, (v) => `${Math.round(v)}`.padStart(3, '0'))
  const width = useTransform(progress, (v) => `${v}%`)

  useEffect(() => {
    lockScroll(true)
    let loaded = 0
    const total = CRITICAL.length + 1
    const bump = () => {
      loaded++
      animate(progress, (loaded / total) * 100, { duration: 0.6, ease })
    }
    const minTime = new Promise((r) => setTimeout(r, sessionStorage.getItem('el-seen') ? 700 : 1500))
    const maxTime = new Promise((r) => setTimeout(r, 4000))
    const assets = Promise.all([...CRITICAL.map((s) => preload(s).then(bump)), (document.fonts?.ready ?? Promise.resolve()).then(bump)])

    Promise.race([Promise.all([assets, minTime]), maxTime]).then(() => {
      animate(progress, 100, { duration: 0.35 })
      // Timer rather than the animation promise: rAF pauses in background tabs and must not block entry.
      setTimeout(() => {
        try {
          sessionStorage.setItem('el-seen', '1')
        } catch {
          /* ignore */
        }
        setShow(false)
        onDone() // start the hero intro as the loader begins to lift, so it plays underneath the wipe
      }, 400)
    })
  }, [progress]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence
      onExitComplete={() => lockScroll(false)}
    >
      {show && (
        <motion.div
          className="loader"
          role="status"
          aria-label="Loading Embrace Luxury"
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.9, ease: easeInOut } }}
          style={{ clipPath: 'inset(0 0 0% 0)' }}
        >
          <div className="loader__center">
            <svg className="loader__gem" viewBox="0 0 64 64" aria-hidden="true">
              <motion.path
                d="M18 10h28l12 14-26 32L6 24z M6 24h52 M24 10l-6 14 14 32 14-32-6-14"
                fill="none"
                stroke="url(#lg)"
                strokeWidth="1.4"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.6, ease: easeInOut }}
              />
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f7e2b0" />
                  <stop offset=".5" stopColor="#cf9e48" />
                  <stop offset="1" stopColor="#f3d590" />
                </linearGradient>
              </defs>
            </svg>
            <div className="loader__word">
              <motion.span className="loader__top" initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, ease, delay: 0.2 }}>
                Embrace
              </motion.span>
              <motion.span
                className="loader__script script"
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: 1.4, ease: easeInOut, delay: 0.35 }}
              >
                Luxury
              </motion.span>
            </div>
          </div>
          <div className="loader__foot">
            <span>Fine jewellery · London</span>
            <motion.span className="tabular">{pct}</motion.span>
          </div>
          <div className="loader__bar">
            <motion.span style={{ width }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
