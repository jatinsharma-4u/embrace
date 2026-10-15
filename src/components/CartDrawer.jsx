import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../data/products'
import { ease, lockScroll } from '../lib/motion'
import useMedia from '../hooks/useMedia'
import useFocusTrap from '../hooks/useFocusTrap'
import Sparkle from './Sparkle'
import { IconArrowRight, IconClose, IconMinus, IconPlus, IconShield, IconTruck } from './Icons'

const FREE_GIFT = 2500

export default function CartDrawer() {
  const { cartOpen, setCartOpen, lines, subtotal, count, setQty, removeLine } = useStore()
  const navigate = useNavigate()
  const isDesktop = useMedia('(min-width: 768px)')
  const panelRef = useRef(null)
  const drag = useDragControls()
  const close = () => setCartOpen(false)

  useEffect(() => {
    lockScroll(cartOpen)
    if (!cartOpen) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cartOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  useFocusTrap(panelRef, cartOpen)

  const progress = Math.min(1, subtotal / FREE_GIFT)

  const panelMotion = isDesktop
    ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }
    : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="drawer-root" role="presentation">
          <motion.div className="scrim" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} />
          <motion.aside
            ref={panelRef}
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bag-title"
            {...panelMotion}
            transition={{ duration: 0.55, ease }}
            drag={isDesktop ? false : 'y'}
            dragListener={false}
            dragControls={drag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) close()
            }}
            data-lenis-prevent
          >
            <div className="drawer__grab hide-desktop" aria-hidden="true" onPointerDown={(e) => drag.start(e)} />
            <header className="drawer__head" onPointerDown={(e) => !isDesktop && drag.start(e)}>
              <h2 id="bag-title">
                Your bag <span className="tabular">({count})</span>
              </h2>
              <button className="icon-btn" onClick={close} aria-label="Close bag">
                <IconClose />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="drawer__empty">
                <Sparkle size={110} />
                <h3>Your bag is waiting</h3>
                <p>Discover pieces crafted to be treasured for a lifetime.</p>
                <Link to="/shop" className="btn btn--emerald" onClick={close}>
                  Explore the collection <IconArrowRight />
                </Link>
              </div>
            ) : (
              <>
                <div className="gift-meter" aria-live="polite">
                  <p>
                    {progress < 1 ? (
                      <>
                        You are <strong className="tabular">{formatPrice(FREE_GIFT - subtotal)}</strong> away from a complimentary engraving
                      </>
                    ) : (
                      <>Complimentary engraving unlocked</>
                    )}
                  </p>
                  <div className="gift-meter__track">
                    <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: progress }} transition={{ duration: 0.8, ease }} />
                  </div>
                </div>

                <ul className="drawer__lines">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.key}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0, paddingBlock: 0 }}
                        transition={{ duration: 0.4, ease }}
                        className="line"
                      >
                        <Link to={`/product/${l.product.slug}`} onClick={close} className="line__img">
                          <img src={l.product.image} alt="" loading="lazy" />
                        </Link>
                        <div className="line__body">
                          <Link to={`/product/${l.product.slug}`} onClick={close} className="line__name">
                            {l.product.name}
                          </Link>
                          <p className="line__variant">
                            {l.metalObj.name}
                            {l.size ? ` · ${l.size}` : ''}
                          </p>
                          <div className="line__row">
                            <div className="stepper" role="group" aria-label={`Quantity for ${l.product.name}`}>
                              <button onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease quantity">
                                <IconMinus />
                              </button>
                              <span className="tabular" aria-live="polite">{l.qty}</span>
                              <button onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase quantity" disabled={l.qty >= 9}>
                                <IconPlus />
                              </button>
                            </div>
                            <span className="line__price tabular">{formatPrice(l.unit * l.qty)}</span>
                          </div>
                          <button className="line__remove" onClick={() => removeLine(l.key)}>
                            Remove
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="drawer__foot">
                  <div className="drawer__total">
                    <span>Subtotal</span>
                    <strong className="tabular">{formatPrice(subtotal)}</strong>
                  </div>
                  <p className="drawer__note">
                    <IconTruck /> Complimentary insured delivery &amp; returns
                  </p>
                  <button
                    className="btn btn--emerald btn--block"
                    onClick={() => {
                      close()
                      navigate('/checkout')
                    }}
                  >
                    Secure checkout <IconShield />
                  </button>
                  <button className="btn btn--ghost btn--block btn--sm" onClick={close}>
                    Continue shopping
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
