import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import Page from '../components/Page'
import { Breadcrumbs } from '../components/PageHero'
import Accordion, { AccordionItem } from '../components/Accordion'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import NotFound from './NotFound'
import { useStore } from '../context/StoreContext'
import { categories, formatPrice, getCollection, getProduct, products } from '../data/products'
import { ease } from '../lib/motion'
import {
  IconArrowRight, IconBag, IconCheck, IconChevronLeft, IconChevronRight, IconGift, IconHeart, IconMinus, IconPlus,
  IconRefresh, IconRuler, IconShield, IconStar, IconTruck, IconZoom,
} from '../components/Icons'

const STONES = {
  'emerald-atelier': 'Colombian emerald, round brilliant diamonds',
  'golden-hour': 'Brilliant-cut diamonds (where set)',
  'radiant-bloom': 'Rubies, sapphires & diamonds',
  'heritage-temple': 'Kundan-set stones, seed pearls',
  'bridal-diamonds': 'GIA-certified diamonds, F–G VS1',
}

function Gallery({ product, collection }) {
  const views = useMemo(
    () => [
      { id: 'studio', label: 'Studio', type: 'cutout', bg: 'ivory' },
      { id: 'velvet', label: 'Emerald velvet', type: 'cutout', bg: 'emerald' },
      { id: 'detail', label: 'Detail', type: 'detail', bg: 'champagne' },
      { id: 'life', label: 'Lifestyle', type: 'photo', src: collection?.cover },
    ],
    [collection]
  )
  const [[index, dir], setIndex] = useState([0, 0])
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 })
  const go = (i) => setIndex(([cur]) => [(i + views.length) % views.length, i > cur ? 1 : -1])
  const v = views[index]

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || v.type === 'photo' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const r = e.currentTarget.getBoundingClientRect()
    setZoom({ on: true, x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  return (
    <div className="gallery">
      <div
        className={`gallery__stage gallery__stage--${v.bg ?? 'photo'}`}
        onPointerMove={onMove}
        onPointerLeave={() => setZoom((z) => ({ ...z, on: false }))}
        aria-roledescription="carousel"
        aria-label={`${product.name} images`}
      >
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={v.id}
            className="gallery__slide"
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.6, ease }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -400) go(index + 1)
              else if (info.offset.x > 60 || info.velocity.x > 400) go(index - 1)
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${views.length}: ${v.label}`}
          >
            {v.type === 'photo' ? (
              <img src={v.src} alt={`${collection?.name} collection lifestyle photograph`} className="gallery__photo" draggable="false" />
            ) : (
              <img
                src={product.image}
                alt={v.type === 'detail' ? `${product.name}, close-up detail` : product.name}
                className={`gallery__cut ${v.type === 'detail' ? 'gallery__cut--detail' : ''}`}
                draggable="false"
                style={zoom.on ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: `scale(${v.type === 'detail' ? 2.2 : 1.6})` } : undefined}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <span className="gallery__hint hide-mobile" aria-hidden="true">
          <IconZoom /> Hover to zoom
        </span>
        <div className="gallery__arrows">
          <button className="icon-btn" onClick={() => go(index - 1)} aria-label="Previous image">
            <IconChevronLeft />
          </button>
          <button className="icon-btn" onClick={() => go(index + 1)} aria-label="Next image">
            <IconChevronRight />
          </button>
        </div>
        <div className="gallery__dots hide-desktop" aria-hidden="true">
          {views.map((x, i) => (
            <span key={x.id} data-active={i === index} />
          ))}
        </div>
      </div>

      <div className="gallery__thumbs" role="tablist" aria-label="Choose image">
        {views.map((x, i) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={i === index}
            aria-label={x.label}
            className={`gallery__thumb gallery__thumb--${x.bg ?? 'photo'}`}
            onClick={() => go(i)}
          >
            <img src={x.type === 'photo' ? x.src : product.image} alt="" className={x.type === 'detail' ? 'is-detail' : ''} />
            {i === index && <motion.span layoutId="thumb-ring" className="gallery__ring" transition={{ duration: 0.4, ease }} />}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  const { addToCart, toggleWish, isWished } = useStore()
  const [metal, setMetal] = useState(product?.metals[0].id)
  const [size, setSize] = useState(product?.sizes ? null : undefined)
  const [qty, setQty] = useState(1)
  const [sizeError, setSizeError] = useState(false)
  const [added, setAdded] = useState(false)
  const addedTimer = useRef()
  useEffect(() => () => clearTimeout(addedTimer.current), [])
  const ctaRef = useRef(null)
  const ctaInView = useInView(ctaRef, { margin: '0px 0px -40px 0px' })

  useEffect(() => {
    if (!product) return
    setMetal(product.metals[0].id)
    setSize(product.sizes ? null : undefined)
    setQty(1)
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) return <NotFound />

  const collection = getCollection(product.collection)
  const metalObj = product.metals.find((m) => m.id === metal) ?? product.metals[0]
  const price = product.price + metalObj.delta
  const wished = isWished(product.slug)
  const category = categories.find((c) => c.slug === product.category)

  const related = products.filter((p) => p.collection === product.collection && p.slug !== product.slug).slice(0, 4)
  const more = related.length < 4 ? products.filter((p) => p.category === product.category && p.slug !== product.slug && !related.includes(p)).slice(0, 4 - related.length) : []
  const recs = [...related, ...more]

  const add = () => {
    if (product.sizes && !size) {
      setSizeError(true)
      document.getElementById('size-group')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    addToCart(product, { metal, size, qty })
    setAdded(true)
    clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Page title={product.name} className="page--product">
      <div className="ptop" aria-hidden="true" />
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
            { label: category?.name ?? 'Jewellery', to: `/shop?category=${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      <section className="container pdp">
        <Gallery product={product} collection={collection} key={product.slug} />

        <div className="pdp__info">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.3 }}>
            <Link to={`/shop?collection=${collection.slug}`} className="pdp__collection">
              {collection.name}
            </Link>
            <h1 className="pdp__name">{product.name}</h1>
            <div className="pdp__rating">
              <span className="stars" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <IconStar key={i} />
                ))}
              </span>
              <span>
                {product.rating.toFixed(1)} · <span className="tabular">{product.reviews}</span> reviews
              </span>
            </div>
            <div className="pdp__price">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span key={price} className="tabular" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.35, ease }}>
                  {formatPrice(price)}
                </motion.span>
              </AnimatePresence>
              <small>Including VAT · Complimentary delivery</small>
            </div>
            <p className="pdp__desc">{product.description}</p>
          </motion.div>

          <motion.div className="pdp__options" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.42 }}>
            <fieldset className="opt">
              <legend>
                Metal <span>{metalObj.name}</span>
              </legend>
              <div className="opt__metals">
                {product.metals.map((m) => (
                  <label key={m.id} className="metal" data-active={metal === m.id}>
                    <input type="radio" name="metal" value={m.id} checked={metal === m.id} onChange={() => setMetal(m.id)} />
                    <span className="metal__swatch" style={{ background: m.swatch }} aria-hidden="true" />
                    <span className="metal__name">{m.name.replace('18k ', '')}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {product.sizes && (
              <fieldset className="opt" id="size-group" aria-describedby={sizeError ? 'size-err' : undefined}>
                <legend>
                  {product.category === 'rings' ? 'Ring size' : product.category === 'necklaces' ? 'Chain length' : 'Size'}
                  <Link to="/contact#faq" className="opt__guide">
                    <IconRuler /> Size guide
                  </Link>
                </legend>
                <div className="opt__sizes" data-error={sizeError}>
                  {product.sizes.map((s) => (
                    <label key={s} className="size" data-active={size === s}>
                      <input
                        type="radio"
                        name="size"
                        value={s}
                        checked={size === s}
                        onChange={() => {
                          setSize(s)
                          setSizeError(false)
                        }}
                      />
                      {s}
                    </label>
                  ))}
                </div>
                {sizeError && (
                  <p id="size-err" className="field-error" role="alert">
                    Please choose a size to continue.
                  </p>
                )}
              </fieldset>
            )}

            <div className="pdp__buy" ref={ctaRef}>
              <div className="stepper stepper--lg" role="group" aria-label="Quantity">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={qty <= 1}>
                  <IconMinus />
                </button>
                <span className="tabular" aria-live="polite">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="Increase quantity" disabled={qty >= 9}>
                  <IconPlus />
                </button>
              </div>
              <motion.button className="btn btn--emerald pdp__add" data-added={added} onClick={add} whileTap={{ scale: 0.97 }}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={added ? 'ok' : 'add'}
                    className="pdp__add-inner"
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    {added ? (
                      <>
                        <IconCheck /> Added to bag
                      </>
                    ) : (
                      <>
                        <IconBag /> Add to bag · <span className="tabular">{formatPrice(price * qty)}</span>
                      </>
                    )}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
              <motion.button
                className="pdp__wish"
                data-active={wished}
                aria-pressed={wished}
                aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
                onClick={() => toggleWish(product)}
                whileTap={{ scale: 0.88 }}
              >
                <IconHeart />
              </motion.button>
            </div>
            <Link to="/contact" className="pdp__appt link-arrow">
              Prefer to see it in person? Book a private appointment <IconArrowRight />
            </Link>
          </motion.div>

          <ul className="assure">
            <li><IconTruck /> Complimentary insured delivery in 2–4 days</li>
            <li><IconRefresh /> 30-day returns &amp; exchanges</li>
            <li><IconShield /> Lifetime warranty &amp; certificate</li>
            <li><IconGift /> Signature gift packaging</li>
          </ul>

          <Accordion>
            <AccordionItem title="Details & specifications" defaultOpen>
              <dl className="specs">
                <div><dt>Metal</dt><dd>{metalObj.name}</dd></div>
                <div><dt>Stones</dt><dd>{STONES[product.collection]}</dd></div>
                <div><dt>Collection</dt><dd>{collection.name}</dd></div>
                <div><dt>Reference</dt><dd className="tabular">EL-{String(product.id).padStart(4, '0')}</dd></div>
                <div><dt>Made in</dt><dd>London, United Kingdom</dd></div>
              </dl>
            </AccordionItem>
            <AccordionItem title="Materials & care">
              <p>
                Store each piece separately in its pouch. Clean gently with a soft cloth; avoid perfume, chlorine and ultrasonic cleaners for
                emeralds. We offer complimentary cleaning and inspection for life.
              </p>
            </AccordionItem>
            <AccordionItem title="Delivery & returns">
              <p>
                Complimentary insured delivery to the UK within 2–4 working days, and worldwide within 5–7. Return or exchange unworn pieces within
                30 days.
              </p>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="section related" aria-labelledby="rel-title">
        <div className="container">
          <header className="section-head section-head--split">
            <div>
              <Reveal as="p" className="eyebrow">
                From {collection.name}
              </Reveal>
              <Reveal as="h2" id="rel-title">
                You may also love
              </Reveal>
            </div>
            <Link to={`/shop?collection=${collection.slug}`} className="link-arrow">
              View the collection <IconArrowRight />
            </Link>
          </header>
          <ul className="related__row no-scrollbar">
            {recs.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.07}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Mobile sticky purchase bar */}
      <AnimatePresence>
        {!ctaInView && (
          <motion.div className="buybar" initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }} transition={{ duration: 0.4, ease }}>
            <span className="buybar__img">
              <img src={product.image} alt="" />
            </span>
            <span className="buybar__text">
              <strong>{product.name}</strong>
              <span className="tabular">{formatPrice(price)}</span>
            </span>
            <button className="btn btn--peach btn--sm" onClick={add}>
              Add to bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  )
}
