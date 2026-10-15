import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Page from '../components/Page'
import PageHero from '../components/PageHero'
import ProductCard from '../components/ProductCard'
import Sheet from '../components/Sheet'
import Dropdown from '../components/Dropdown'
import Sparkle from '../components/Sparkle'
import { categories, collections, formatPrice, products } from '../data/products'
import { ease } from '../lib/motion'
import { IconArrowRight, IconCheck, IconClose, IconFilter, IconSearch } from '../components/Icons'

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'new', label: 'New arrivals' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name', label: 'Alphabetical' },
]
const METALS = [
  { id: 'yellow', label: 'Yellow gold', swatch: 'linear-gradient(135deg,#f6dd9a,#c9962f)' },
  { id: 'white', label: 'White gold', swatch: 'linear-gradient(135deg,#f4f4f2,#b9bcbf)' },
  { id: 'rose', label: 'Rose gold', swatch: 'linear-gradient(135deg,#f6cdb7,#c27f63)' },
  { id: 'plat', label: 'Platinum', swatch: 'linear-gradient(135deg,#eceef0,#9aa1a8)' },
]
const PRICES = [
  { id: '', label: 'Any price' },
  { id: '2000', label: 'Under £2,000' },
  { id: '5000', label: 'Under £5,000' },
  { id: '10000', label: 'Under £10,000' },
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const category = params.get('category') || 'all'
  const collection = params.get('collection') || ''
  const metal = params.get('metal') || ''
  const max = params.get('max') || ''
  const sort = params.get('sort') || 'featured'
  const q = params.get('q') || ''
  const [qInput, setQInput] = useState(q)
  useEffect(() => setQInput(q), [q])
  useEffect(() => {
    const t = setTimeout(() => qInput !== q && update({ q: qInput.trim() }), 220)
    return () => clearTimeout(t)
  }, [qInput]) // eslint-disable-line react-hooks/exhaustive-deps

  const update = useCallback(
    (patch) => {
      const next = new URLSearchParams(params)
      Object.entries(patch).forEach(([k, v]) => (v && v !== 'all' && !(k === 'sort' && v === 'featured') ? next.set(k, v) : next.delete(k)))
      setParams(next, { replace: true, preventScrollReset: true })
    },
    [params, setParams]
  )

  const list = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    const hay = (p) => `${p.name} ${p.category} ${p.description} ${collections.find((c) => c.slug === p.collection)?.name} ${p.metals.map((m) => m.name).join(' ')}`.toLowerCase()
    let l = products.filter(
      (p) =>
        terms.every((t) => hay(p).includes(t.replace(/s$/, ''))) &&
        (category === 'all' || p.category === category) &&
        (!collection || p.collection === collection) &&
        (!metal || p.metals.some((m) => m.id === metal)) &&
        (!max || p.price <= Number(max))
    )
    const s = [...l]
    if (sort === 'price-asc') s.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') s.sort((a, b) => b.price - a.price)
    else if (sort === 'name') s.sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'new') s.sort((a, b) => (b.badge === 'New') - (a.badge === 'New') || b.order - a.order)
    else s.sort((a, b) => (b.badge === 'Bestseller') - (a.badge === 'Bestseller') || a.order - b.order)
    return s
  }, [category, collection, metal, max, sort, q])

  const counts = useMemo(() => {
    const base = products.filter((p) => (!collection || p.collection === collection) && (!metal || p.metals.some((m) => m.id === metal)) && (!max || p.price <= Number(max)))
    return Object.fromEntries([['all', base.length], ...categories.map((c) => [c.slug, base.filter((p) => p.category === c.slug).length])])
  }, [collection, metal, max])

  const activeFilters = [
    collection && { k: 'collection', label: collections.find((c) => c.slug === collection)?.name },
    metal && { k: 'metal', label: METALS.find((m) => m.id === metal)?.label },
    max && { k: 'max', label: `Under ${formatPrice(Number(max))}` },
    q && { k: 'q', label: `“${q}”` },
  ].filter(Boolean)

  const coll = collections.find((c) => c.slug === collection)
  const showPromo = !collection && !metal && !max && !q && category === 'all' && list.length > 6
  const extraCount = activeFilters.length
  const entries = showPromo ? [...list.slice(0, 5), 'promo', ...list.slice(5)] : list

  return (
    <Page title="Shop">
      <PageHero
        eyebrow={coll ? 'Collection' : 'Fine jewellery'}
        title={coll ? coll.name : 'The Collection'}
        text={coll ? coll.tagline : 'Emeralds, rubies and diamonds set in eighteen-carat gold — every piece handcrafted in our London atelier.'}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Shop' }]}
        decor={[{ src: '/img/p/ring_21.webp' }, { src: '/img/p/jewelry_6707.webp' }]}
      />

      <section className="section shop" aria-label="Products">
        <div className="container">
          <div className="shopbar">
            <div className="shopbar__cats no-scrollbar" role="group" aria-label="Category">
              {[{ slug: 'all', name: 'All' }, ...categories].map((c) => (
                <button key={c.slug} className="stab" aria-pressed={category === c.slug} onClick={() => update({ category: c.slug })}>
                  {c.name}
                  <sup className="tabular">{counts[c.slug]}</sup>
                  {category === c.slug && <motion.span layoutId="stab-line" className="stab__line" transition={{ duration: 0.45, ease }} />}
                </button>
              ))}
            </div>
            <div className="shopbar__tools">
              <div className="shopbar__dds">
                <Dropdown
                  label="Collection"
                  value={collection}
                  onChange={(v) => update({ collection: v })}
                  options={[{ value: '', label: 'All collections' }, ...collections.map((c) => ({ value: c.slug, label: c.name }))]}
                />
                <Dropdown
                  label="Metal"
                  value={metal}
                  onChange={(v) => update({ metal: v })}
                  options={[{ value: '', label: 'All metals' }, ...METALS.map((m) => ({ value: m.id, label: m.label, swatch: m.swatch }))]}
                />
                <Dropdown label="Price" value={max} onChange={(v) => update({ max: v })} options={PRICES.map((p) => ({ value: p.id, label: p.label }))} />
              </div>
              <button className="shopbar__filter" onClick={() => setFiltersOpen(true)} aria-haspopup="dialog">
                <IconFilter /> Filter
                {extraCount > 0 && <span className="shopbar__n">{extraCount}</span>}
              </button>
              <Dropdown
                label="Sort"
                align="right"
                value={sort}
                onChange={(v) => update({ sort: v })}
                options={SORTS.map((s) => ({ value: s.id, label: s.label, short: s.label.replace('Price: ', '') }))}
              />
            </div>
          </div>

          <div className="shop__status">
            <label className="ssearch">
              <IconSearch aria-hidden="true" />
              <span className="sr-only">Search the collection</span>
              <input
                type="search"
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="Search pieces"
                enterKeyHint="search"
                autoComplete="off"
              />
              {qInput && (
                <button type="button" className="ssearch__clear" onClick={() => setQInput('')} aria-label="Clear search">
                  <IconClose />
                </button>
              )}
            </label>
            <p aria-live="polite" className="tabular">
              {list.length} {list.length === 1 ? 'piece' : 'pieces'}
            </p>
            <AnimatePresence>
              {activeFilters.map((f) => (
                <motion.button
                  layout
                  key={f.k}
                  className="fchip"
                  onClick={() => update({ [f.k]: '' })}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  aria-label={`Remove filter ${f.label}`}
                >
                  {f.label} <IconClose />
                </motion.button>
              ))}
            </AnimatePresence>
            {activeFilters.length > 0 && (
              <button className="shop__clear" onClick={() => update({ collection: '', metal: '', max: '', q: '' })}>
                Clear all
              </button>
            )}
          </div>

          {list.length === 0 ? (
            <div className="empty">
              <Sparkle size={110} />
              <h2>No pieces match these filters</h2>
              <p>Try removing a filter, or explore the full collection.</p>
              <button className="btn btn--emerald" onClick={() => setParams({}, { replace: true })}>
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.ul layout className="pgrid">
              <AnimatePresence mode="popLayout" initial={false}>
                {entries.map((p, i) =>
                  p === 'promo' ? (
                    <motion.li layout key="promo" className="pgrid__promo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Link to="/shop?collection=emerald-atelier" className="promo">
                        <img src="/img/photo/emerald-rings.webp" alt="" loading="lazy" className="promo__bg" />
                        <span className="promo__body">
                          <span className="eyebrow eyebrow--light">New season</span>
                          <strong>The Emerald Atelier</strong>
                          <span className="promo__cta">
                            Shop the collection <IconArrowRight />
                          </span>
                        </span>
                      </Link>
                    </motion.li>
                  ) : (
                    <motion.li
                      layout
                      key={p.slug}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, ease, delay: (i % 4) * 0.06 } }}
                      viewport={{ once: true, amount: 0.12 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    >
                      <ProductCard product={p} priority={i < 4} />
                    </motion.li>
                  )
                )}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </section>

      <Sheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filter & sort"
        footer={
          <>
            <button className="btn btn--emerald btn--block" onClick={() => setFiltersOpen(false)}>
              Show {list.length} {list.length === 1 ? 'piece' : 'pieces'}
            </button>
            <button className="btn btn--ghost btn--block btn--sm" onClick={() => update({ collection: '', metal: '', max: '', sort: '' })}>
              Reset all
            </button>
          </>
        }
      >
        <fieldset className="fgroup">
          <legend>Sort by</legend>
          <div className="fgroup__chips">
            {SORTS.map((s) => (
              <button key={s.id} className="chip" aria-pressed={sort === s.id} onClick={() => update({ sort: s.id })}>
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="fgroup">
          <legend>Collection</legend>
          <div className="fgroup__list">
            {[{ slug: '', name: 'All collections' }, ...collections].map((c) => (
              <button key={c.slug || 'all'} className="fopt" aria-pressed={collection === c.slug} onClick={() => update({ collection: c.slug })}>
                <span>{c.name}</span>
                <span className="fopt__check">
                  <IconCheck />
                </span>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="fgroup">
          <legend>Metal</legend>
          <div className="fgroup__chips">
            {METALS.map((m) => (
              <button key={m.id} className="chip" aria-pressed={metal === m.id} onClick={() => update({ metal: metal === m.id ? '' : m.id })}>
                <span className="swatch" style={{ background: m.swatch }} aria-hidden="true" />
                {m.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="fgroup">
          <legend>Price</legend>
          <div className="fgroup__chips">
            {PRICES.map((p) => (
              <button key={p.id || 'any'} className="chip" aria-pressed={max === p.id} onClick={() => update({ max: p.id })}>
                {p.label}
              </button>
            ))}
          </div>
        </fieldset>
      </Sheet>
    </Page>
  )
}
