import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext'
import { ease } from '../lib/motion'
import { IconCheck, IconClose, IconHeart } from './Icons'

// Compact, light notification. Progress line shows how long it stays.
export default function Toast() {
  const { toast, dismissToast, setCartOpen } = useStore()
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.18 } }}
            transition={{ duration: 0.35, ease }}
            role="status"
          >
            {toast.product ? (
              <span className="toast__thumb">
                <img src={toast.product.image} alt="" />
              </span>
            ) : (
              <span className="toast__icon" aria-hidden="true">
                <IconCheck />
              </span>
            )}
            <div className="toast__body">
              <p className="toast__title">
                {toast.kind === 'cart' && <IconCheck className="toast__mark" />}
                {toast.kind === 'wish' && <IconHeart className="toast__mark toast__mark--heart" />}
                {toast.title}
              </p>
              {toast.text && <p className="toast__text">{toast.text}</p>}
              {toast.sub && <p className="toast__sub">{toast.sub}</p>}
            </div>
            {toast.kind === 'cart' && (
              <button
                className="toast__action"
                onClick={() => {
                  dismissToast()
                  setCartOpen(true)
                }}
              >
                View bag
              </button>
            )}
            {toast.action && (
              <button
                className="toast__action"
                onClick={() => {
                  toast.action.run()
                  dismissToast()
                }}
              >
                {toast.action.label}
              </button>
            )}
            <button className="toast__close" onClick={dismissToast} aria-label="Dismiss notification">
              <IconClose />
            </button>
            <motion.span
              className="toast__timer"
              aria-hidden="true"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: (toast.duration ?? 4200) / 1000, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
