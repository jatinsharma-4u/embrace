import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ease } from '../lib/motion'
import { IconChevronRight } from './Icons'

export function Breadcrumbs({ items, light = false }) {
  return (
    <nav aria-label="Breadcrumb" className={`crumbs ${light ? 'crumbs--light' : ''}`}>
      <ol>
        {items.map((it, i) => (
          <li key={it.label}>
            {it.to && i < items.length - 1 ? <Link to={it.to}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}
            {i < items.length - 1 && <IconChevronRight aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default function PageHero({ eyebrow, title, script, text, crumbs, decor = [], children, size = 'md' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 120])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className={`phero phero--${size}`}>
      <div className="phero__glow" aria-hidden="true" />
      {decor.map((d, i) => (
        <motion.img
          key={d.src}
          src={d.src}
          alt=""
          aria-hidden="true"
          className={`phero__decor phero__decor--${i}`}
          style={{ y: i % 2 ? y2 : y1 }}
          initial={{ opacity: 0, scale: 0.85, rotate: i % 2 ? 8 : -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.4, ease, delay: 0.4 + i * 0.15 }}
        />
      ))}
      <motion.div className="container phero__inner" style={{ opacity: fade }}>
        {crumbs && <Breadcrumbs items={crumbs} light />}
        {eyebrow && (
          <motion.p className="eyebrow eyebrow--light" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.3 }}>
            {eyebrow}
          </motion.p>
        )}
        <h1 className="phero__title">
          <span className="split__mask">
            <motion.span className="split__word" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease, delay: 0.35 }}>
              {title}
            </motion.span>
          </span>
          {script && (
            <motion.span className="phero__script script text-gold" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease, delay: 0.6 }}>
              {script}
            </motion.span>
          )}
        </h1>
        {text && (
          <motion.p className="phero__text" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.55 }}>
            {text}
          </motion.p>
        )}
        {children}
      </motion.div>
      <div className="gold-chain phero__chain" aria-hidden="true" />
    </section>
  )
}
