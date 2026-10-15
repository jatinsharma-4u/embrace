import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ease } from '../lib/motion'
import { IconPlus } from './Icons'

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  return (
    <div className="acc" data-open={open}>
      <h3>
        <button className="acc__btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          <span>{title}</span>
          <IconPlus className="acc__icon" />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            className="acc__panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
          >
            <div className="acc__inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Accordion({ children, className = '' }) {
  return <div className={`accordion ${className}`}>{children}</div>
}
