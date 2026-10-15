import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { ease } from '../lib/motion'

export default function Reveal({ as = 'div', children, delay = 0, y = 32, className = '', amount = 0.25, ...rest }) {
  const M = motion[as]
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </M>
  )
}

/* Line-by-line masked heading reveal */
export function SplitHeading({ text, as = 'h2', className = '', delay = 0 }) {
  const H = motion[as]
  const words = text.split(' ')
  return (
    <H
      className={`split ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split__mask" aria-hidden="true">
            <motion.span className="split__word" variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.9, ease } } }}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </H>
  )
}
