import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ease } from '../lib/motion'
import { IconCheck, IconChevronDown } from './Icons'

// Lightweight popover select: a text trigger plus a small floating list.
export default function Dropdown({ label, value, options, onChange, align = 'left' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const id = useId()
  const current = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const active = value && value !== options[0]?.value

  return (
    <div className="dd" ref={ref}>
      <button
        type="button"
        className="dd__trigger"
        data-active={!!active}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="dd__label">{label}</span>
        {active && <span className="dd__value">{current?.short ?? current?.label}</span>}
        <IconChevronDown className="dd__chev" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={id}
            role="listbox"
            aria-label={label}
            className={`dd__menu dd__menu--${align}`}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease }}
          >
            {options.map((o) => (
              <li key={o.value || 'all'}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  className="dd__opt"
                  onClick={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                >
                  {o.swatch && <span className="swatch" style={{ background: o.swatch }} aria-hidden="true" />}
                  <span>{o.label}</span>
                  {o.value === value && <IconCheck className="dd__check" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
