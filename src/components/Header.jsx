import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useStore } from '../context/StoreContext'
import { categories } from '../data/products'
import { ease, lockScroll } from '../lib/motion'
import useFocusTrap from '../hooks/useFocusTrap'
import Logo from './Logo'
import { IconArrowRight, IconBag, IconClose, IconHeart, IconMail, IconMenu, IconPhone, IconSearch } from './Icons'

export const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop', label: 'Shop' },
  { to: '/collections', label: 'Collections' },
  { to: '/maison', label: 'Maison' },
  { to: '/contact', label: 'Contact' },
]

function MobileMenu({ open, onClose }) {
  const ref = useRef(null)
  const { wishlist } = useStore()
  useFocusTrap(ref, open)
  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          className="mmenu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.45, ease } }}
          transition={{ duration: 0.6, ease }}
          data-lenis-prevent
        >
          <div className="mmenu__top">
            <Logo />
            <button className="icon-btn" onClick={onClose} aria-label="Close menu" data-autofocus>
              <IconClose />
            </button>
          </div>
          <nav aria-label="Menu" className="mmenu__nav">
            <ul>
              {[...NAV, { to: '/wishlist', label: `Wishlist${wishlist.length ? ` (${wishlist.length})` : ''}` }].map((n, i) => (
                <motion.li
                  key={n.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.05 }}
                >
                  <NavLink to={n.to} end={n.end} onClick={onClose} className="mmenu__link">
                    <span className="mmenu__num tabular">0{i + 1}</span>
                    {n.label}
                    <IconArrowRight className="mmenu__arrow" />
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>
          <motion.div className="mmenu__cats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
            <p className="eyebrow eyebrow--light">Shop by category</p>
            <div className="mmenu__chips">
              {categories.map((c) => (
                <Link key={c.slug} to={`/shop?category=${c.slug}`} onClick={onClose} className="chip chip--dark">
                  {c.name}
                </Link>
              ))}
            </div>
          </motion.div>
          <motion.div className="mmenu__foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}>
            <a href="tel:+442079460321">
              <IconPhone /> +44 20 7946 0321
            </a>
            <a href="mailto:atelier@embraceluxury.co.uk">
              <IconMail /> atelier@embraceluxury.co.uk
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Header({ booted }) {
  const { count, wishlist, setCartOpen, setSearchOpen } = useStore()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    if (y <= 320 || y < prev - 4) setHidden(false)
    else if (y > prev + 4) setHidden(true)
  })

  useEffect(() => {
    document.documentElement.dataset.header = hidden ? 'hidden' : 'shown'
  }, [hidden])

  useEffect(() => setHidden(false), [location.pathname])

  return (
    <>
      <motion.header
        className="site-header"
        data-scrolled={scrolled}
        initial={false}
        animate={booted ? { y: hidden && !menuOpen ? '-105%' : '0%', opacity: 1 } : { y: '-30%', opacity: 0 }}
        transition={{ duration: booted && !scrolled ? 0.9 : 0.45, ease }}
      >
        <div className="site-header__inner">
          <button className="icon-btn site-header__menu hide-desktop" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen}>
            <IconMenu />
          </button>

          <nav className="site-nav hide-mobile" aria-label="Primary">
            <ul>
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.end} className="site-nav__link">
                    {({ isActive }) => (
                      <>
                        {n.label}
                        {isActive && <motion.span layoutId="nav-underline" className="site-nav__underline" transition={{ duration: 0.5, ease }} />}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <Logo className="site-header__logo" />

          <div className="site-header__actions">
            <button className="icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search jewellery">
              <IconSearch />
            </button>
            <NavLink to="/wishlist" className="icon-btn icon-btn--count hide-mobile" aria-label={`Wishlist, ${wishlist.length} saved`}>
              <IconHeart />
              {wishlist.length > 0 && <span className="count-dot">{wishlist.length}</span>}
            </NavLink>
            <button className="bag-btn" onClick={() => setCartOpen(true)} aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}>
              <span className="bag-btn__icon">
                <IconBag />
                <AnimatePresence initial={false}>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      className="count-dot"
                      initial={{ scale: 0.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.3, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 520, damping: 16 }}
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="bag-btn__text">Bag</span>
            </button>
          </div>
        </div>
      </motion.header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
