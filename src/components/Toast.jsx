import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext'
import { ease } from '../lib/motion'
import Sparkle from './Sparkle'
import { IconClose, IconHeart } from './Icons'

export default function Toast() {
  const { toast, dismissToast, setCartOpen } = useStore()
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="toast"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease }}
            role="status"
          >
            {toast.product ? (
              <span className="toast__thumb">
                <img src={toast.product.image} alt="" />
                {toast.kind === 'cart' && <Sparkle size={56} loop={false} className="toast__sparkle" />}
                {toast.kind === 'wish' && (
                  <span className="toast__heart">
                    <IconHeart />
                  </span>
                )}
              </span>
            ) : (
              <span className="toast__thumb toast__thumb--plain">
                <Sparkle size={40} />
              </span>
            )}
            <div className="toast__body">
              <p className="toast__title">{toast.title}</p>
              {toast.text && <p className="toast__text">{toast.text}</p>}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
