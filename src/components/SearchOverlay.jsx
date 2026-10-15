import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../context/StoreContext'
import { collections, formatPrice, products } from '../data/products'
import { ease, lockScroll } from '../lib/motion'
import useFocusTrap from '../hooks/useFocusTrap'
import { IconArrowRight, IconArrowUpRight, IconClose, IconSearch } from './Icons'

const suggestions = ['Emerald', 'Gold ring', 'Ruby', 'Diamond earrings', 'Pendant', 'Bridal']

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useStore()
  const [q, setQ] = useState('')
  const dq = useDeferredValue(q)
  const ref = useRef(null)
  const navigate = useNavigate()
  const close = () => setSearchOpen(false)

  useEffect(() => {
    lockScroll(searchOpen)
    if (!searchOpen) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  useFocusTrap(ref, searchOpen)

  const results = useMemo(() => {
    const terms = dq.toLowerCase().trim().split(/\s+/).filter(Boolean)
    if (!terms.length) return products.filter((p) => p.badge === 'Bestseller').slice(0, 4)
    return products
      .filter((p) => {
        const hay = `${p.name} ${p.category} ${p.description} ${collections.find((c) => c.slug === p.collection)?.name} ${p.metals.map((m) => m.name).join(' ')}`.toLowerCase()
        return terms.every((t) => hay.includes(t.replace(/s$/, '')))
      })
      .slice(0, 8)
  }, [dq])

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          ref={ref}
          className="search"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.6, ease }}
          data-lenis-prevent
        >
          <div className="container search__inner">
            <div className="search__top">
              <span className="search__brand">Search</span>
              <button className="search__close" onClick={close} aria-label="Close search">
                Close <IconClose />
              </button>
            </div>
            <form
              className="search__field"
              role="search"
              onSubmit={(e) => {
                e.preventDefault()
                if (q.trim()) {
                  close()
                  navigate(`/shop?q=${encodeURIComponent(q.trim())}`)
                }
              }}
            >
              <IconSearch />
              <label htmlFor="q" className="sr-only">Search jewellery</label>
              <input
                id="q"
                data-autofocus
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What are you looking for?"
                autoComplete="off"
                enterKeyHint="search"
              />
            </form>
            <div className="search__suggest">
              <span>Popular</span>
              {suggestions.map((s) => (
                <button key={s} type="button" onClick={() => setQ(s)}>
                  {s}
                </button>
              ))}
            </div>

            <p className="search__label" aria-live="polite">
              {q.trim() ? `${results.length} ${results.length === 1 ? 'piece' : 'pieces'} found` : 'Most loved this week'}
            </p>
            <ul className="search__results">
              {results.map((p, i) => (
                <motion.li key={p.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.04, duration: 0.5, ease }}>
                  <Link to={`/product/${p.slug}`} onClick={close} className="sresult">
                    <span className="sresult__img">
                      <img src={p.image} alt="" loading="lazy" />
                    </span>
                    <span className="sresult__text">
                      <strong>{p.name}</strong>
                      <span className="tabular">{formatPrice(p.price)}</span>
                    </span>
                    <IconArrowUpRight className="sresult__arrow" />
                  </Link>
                </motion.li>
              ))}
            </ul>
            {q.trim() && results.length > 0 && (
              <Link to={`/shop?q=${encodeURIComponent(q.trim())}`} onClick={close} className="search__all">
                View all results in the shop <IconArrowRight />
              </Link>
            )}
            {q.trim() && results.length === 0 && (
              <div className="search__empty">
                <p>No pieces match “{q}”.</p>
                <Link to="/shop" onClick={close} className="link-arrow">
                  Browse the full collection
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
