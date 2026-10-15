import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { ease, lockScroll } from '../lib/motion'
import useMedia from '../hooks/useMedia'
import useFocusTrap from '../hooks/useFocusTrap'
import { IconClose } from './Icons'

// Bottom sheet on mobile, side panel on desktop.
export default function Sheet({ open, onClose, title, children, footer, side = 'left' }) {
  const isDesktop = useMedia('(min-width: 768px)')
  const ref = useRef(null)
  const drag = useDragControls()

  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useFocusTrap(ref, open)

  const from = isDesktop ? { x: side === 'left' ? '-100%' : '100%' } : { y: '100%' }

  return (
    <AnimatePresence>
      {open && (
        <div className="drawer-root">
          <motion.div className="scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`drawer sheet sheet--${side}`}
            initial={from}
            animate={{ x: 0, y: 0 }}
            exit={from}
            transition={{ duration: 0.5, ease }}
            drag={isDesktop ? false : 'y'}
            dragListener={false}
            dragControls={drag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, i) => (i.offset.y > 120 || i.velocity.y > 600) && onClose()}
            data-lenis-prevent
          >
            <div className="drawer__grab hide-desktop" aria-hidden="true" onPointerDown={(e) => drag.start(e)} />
            <header className="drawer__head" onPointerDown={(e) => !isDesktop && drag.start(e)}>
              <h2>{title}</h2>
              <button className="icon-btn" onClick={onClose} aria-label="Close">
                <IconClose />
              </button>
            </header>
            <div className="sheet__body">{children}</div>
            {footer && <footer className="drawer__foot">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
