import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import { categories, featured, formatPrice, lifestyle, products } from '../../data/products'
import { ease, gsap, prefersReducedMotion } from '../../lib/motion'
import Reveal, { SplitHeading } from '../Reveal'
import ProductCard from '../ProductCard'
import { IconArrowRight, IconArrowUpRight, IconStar } from '../Icons'

/* ------------------------------------------------------------ Our Creations */
export function Creations() {
  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length])), [])
  return (
    <section className="section creations" aria-labelledby="creations-title">
      <div className="container">
        <header className="section-head section-head--center">
          <SplitHeading text="Our Creations" className="creations__title" />
          <Reveal as="p" delay={0.15}>
            Discover a variety of our pieces.
          </Reveal>
        </header>
        <ul className="creations__grid">
          {categories.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={i * 0.08}>
              <Link to={`/shop?category=${c.slug}`} className="ctile">
                <span className="ctile__glow" aria-hidden="true" />
                <img src={c.image} alt="" loading="lazy" className="ctile__img" />
                <span className="ctile__name">{c.name}</span>
                <span className="ctile__meta">
                  <span className="tabular">{counts[c.slug]} pieces</span>
                  <IconArrowRight />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ New In (editorial split) */
const NEW_IN = ['emerald-cascade-necklace', 'verdant-drop-necklace', 'emerald-teardrop-earrings']

export function NewIn() {
  const ref = useRef(null)
  const picks = NEW_IN.map((s) => products.find((p) => p.slug === s))
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.newin__piece',
        { yPercent: 6, rotate: -3 },
        { yPercent: -6, rotate: 2, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } }
      )
    },
    { scope: ref }
  )

  return (
    <section className="newin container" ref={ref} aria-labelledby="newin-title">
      <div className="newin__visual reveal-clip">
        <img className="newin__piece" src="/img/p/necklace_119.webp" alt="Emerald Cascade Necklace" loading="lazy" />
        <span className="newin__tag">Emerald Cascade Necklace · from £18,400</span>
      </div>
      <div className="newin__text">
        <Reveal as="p" className="eyebrow">
          New season
        </Reveal>
        <h2 id="newin-title" className="newin__title">
          <Reveal as="span" className="newin__line" delay={0.05}>
            New In
          </Reveal>
          <Reveal as="span" className="newin__line newin__line--strong" delay={0.12}>
            The Emerald Atelier
          </Reveal>
        </h2>
        <Reveal as="p" className="newin__desc" delay={0.18}>
          Drawing on a design from our 1996 archive — Colombian emeralds framed in diamonds and warm gold, cut to hold the light like deep forest
          water.
        </Reveal>
        <Reveal as="ul" className="newin__list" delay={0.24}>
          {picks.map((p) => (
            <li key={p.slug}>
              <Link to={`/product/${p.slug}`} className="newin__item">
                <span className="newin__thumb">
                  <img src={p.image} alt="" loading="lazy" />
                </span>
                <span className="newin__name">{p.name}</span>
                <span className="newin__price tabular">{formatPrice(p.price)}</span>
                <IconArrowRight className="newin__arrow" />
              </Link>
            </li>
          ))}
        </Reveal>
        <Reveal delay={0.3}>
          <Link to="/shop?collection=emerald-atelier" className="btn btn--emerald">
            Shop the collection <IconArrowRight />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ Icon Collections (pinned horizontal on desktop) */
function IconsHead({ className = '' }) {
  return (
    <header className={`icons-sec__head ${className}`}>
      <p className="eyebrow">Since 1996</p>
      <h2>Icon Collections</h2>
      <p>For thirty years, our iconic collections have been worn to mark the moments that matter.</p>
      <Link to="/collections" className="link-arrow">
        View all collections <IconArrowRight />
      </Link>
    </header>
  )
}

export function IconCollections() {
  const root = useRef(null)
  const track = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        const distance = () => track.current.scrollWidth - window.innerWidth + 80
        gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
        gsap.utils.toArray('.icard__img', root.current).forEach((img) => {
          gsap.fromTo(img, { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true } })
        })
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section className="icons-sec" ref={root} aria-label="Icon Collections">
      <div className="container hide-desktop icons-sec__mhead">
        <IconsHead />
      </div>
      <div className="icons-sec__track no-scrollbar" ref={track}>
        <IconsHead className="hide-mobile" />
        {lifestyle.map((l, i) => (
          <Link to={l.to} className={`icard icard--${i % 2 ? 'low' : 'high'}`} key={l.title}>
            <span className="icard__frame">
              <img className="icard__img" src={l.src} alt={l.caption} loading="lazy" />
            </span>
            <span className="icard__cap">
              <span className="icard__num tabular">0{i + 1}</span>
              <span>
                <strong>{l.title}</strong>
                <small>{l.caption}</small>
              </span>
              <IconArrowUpRight />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ Bestsellers */
const TABS = [
  { id: 'all', label: 'All' },
  { id: 'rings', label: 'Rings' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'necklaces', label: 'Necklaces' },
]

export function Bestsellers() {
  const [tab, setTab] = useState('all')
  const list = useMemo(() => {
    if (tab === 'all') return featured
    return products.filter((p) => p.category === tab).slice(0, 8)
  }, [tab])

  return (
    <section className="section bestsellers" aria-labelledby="best-title">
      <div className="container">
        <header className="section-head section-head--split">
          <div>
            <Reveal as="p" className="eyebrow">
              Most loved
            </Reveal>
            <SplitHeading text="Treasured pieces" className="best-title" />
          </div>
          <div className="tabs no-scrollbar" role="tablist" aria-label="Filter bestsellers">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} className="tabs__btn" onClick={() => setTab(t.id)}>
                {tab === t.id && <motion.span layoutId="tab-pill" className="tabs__pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </header>

        <motion.ul layout className="pgrid" role="tabpanel">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.li
                layout
                key={p.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: (i % 4) * 0.07 } }}
                viewport={{ once: true, amount: 0.15 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              >
                <ProductCard product={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        <div className="bestsellers__more">
          <Link to="/shop" className="btn btn--emerald">
            View all {products.length} pieces <IconArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ Craft story (scrubbed word reveal) */
const STATEMENT =
  'Every piece begins as a single stone, chosen by hand — and ends as an heirloom, shaped over hundreds of hours in our London atelier.'

export function CraftStory() {
  const root = useRef(null)
  useGSAP(
    () => {
      const words = gsap.utils.toArray('.craft__w', root.current)
      if (prefersReducedMotion()) {
        gsap.set(words, { opacity: 1 })
        return
      }
      gsap.fromTo(
        words,
        { opacity: 0.16 },
        { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.craft__statement', start: 'top 80%', end: 'bottom 45%', scrub: true } }
      )
      gsap.fromTo('.craft__gem', { rotate: -25, yPercent: 30 }, { rotate: 25, yPercent: -30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.utils.toArray('[data-count]', root.current).forEach((el) => {
        const end = Number(el.dataset.count)
        const o = { v: 0 }
        gsap.to(o, {
          v: end,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString('en-GB')),
        })
      })
    },
    { scope: root }
  )

  return (
    <section className="craft" ref={root} aria-labelledby="craft-title">
      <div className="gold-chain" aria-hidden="true" />
      <div className="container craft__inner">
        <img className="craft__gem" src="/img/p/emerald_22304.webp" alt="" aria-hidden="true" loading="lazy" />
        <p className="eyebrow eyebrow--light" id="craft-title">
          The craft
        </p>
        <p className="craft__statement">
          {STATEMENT.split(' ').map((w, i) => (
            <span key={i} className="craft__w">
              {w}{' '}
            </span>
          ))}
        </p>
        <ul className="craft__stats">
          <li>
            <strong>
              <span data-count="30">30</span>
            </strong>
            <span>years of craftsmanship</span>
          </li>
          <li>
            <strong>
              <span data-count="48">48</span>
            </strong>
            <span>master artisans</span>
          </li>
          <li>
            <strong>
              <span data-count="300">300</span>
              <small>h</small>
            </strong>
            <span>to make a single collar</span>
          </li>
          <li>
            <strong>
              <span data-count="100">100</span>
              <small>%</small>
            </strong>
            <span>ethically sourced stones</span>
          </li>
        </ul>
        <Link to="/maison" className="btn btn--ghost-light">
          Discover the Maison <IconArrowRight />
        </Link>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ Marquee */
export function Marquee() {
  const items = ['Handcrafted in London', 'Ethically sourced emeralds', '18k recycled gold', 'Lifetime warranty', 'Complimentary engraving']
  const row = [...items, ...items]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((k) => (
          <div className="marquee__row" key={k}>
            {row.map((t, i) => (
              <span key={i}>
                {t}
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ Testimonials */
const QUOTES = [
  { q: 'The Verdant Drop is even more beautiful in person — the emerald glows. I was stopped three times on my wedding day.', n: 'Amelia R.', l: 'London', img: '/img/p/necklace_65.webp' },
  { q: 'Packaging, service, the piece itself — everything felt considered. My Serpentine ring hasn’t left my hand since.', n: 'Priya S.', l: 'Manchester', img: '/img/p/ring_21.webp' },
  { q: 'They resized my heirloom solitaire and returned it gleaming within a week. True artisans.', n: 'Charlotte W.', l: 'Edinburgh', img: '/img/p/ring_110.webp' },
]

export function Testimonials() {
  return (
    <section className="section voices" aria-labelledby="voices-title">
      <div className="container">
        <header className="section-head section-head--center">
          <Reveal className="voices__badge">
            <span className="avatars" aria-hidden="true">
              <img src="/img/photo/emerald-rings.webp" alt="" />
              <img src="/img/photo/citrine-pendant.webp" alt="" />
              <img src="/img/photo/flower-studs.webp" alt="" />
            </span>
            <span>
              <strong className="tabular">4.5k</strong> lovers &amp; a supportive community
            </span>
          </Reveal>
          <SplitHeading text="Words from our clients" />
        </header>
        <ul className="voices__grid">
          {QUOTES.map((t, i) => (
            <Reveal as="li" key={t.n} delay={i * 0.1} className="quote">
              <div className="quote__stars" aria-label="Rated 5 out of 5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <IconStar key={s} />
                ))}
              </div>
              <blockquote>“{t.q}”</blockquote>
              <footer>
                <span className="quote__img">
                  <img src={t.img} alt="" loading="lazy" />
                </span>
                <span>
                  <strong>{t.n}</strong>
                  <small>{t.l} · Verified client</small>
                </span>
              </footer>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ Appointment CTA */
export function Appointment() {
  return (
    <section className="container appt-wrap">
      <Reveal className="appt">
        <div className="appt__media reveal-clip">
          <img src="/img/photo/temple-set.webp" alt="Heritage Temple kundan necklace set on deep green silk" loading="lazy" />
        </div>
        <div className="appt__body">
          <p className="eyebrow eyebrow--light">Private appointments</p>
          <h2>
            Visit the atelier,
            <br />
            <span className="script text-gold">by invitation</span>
          </h2>
          <p>Try pieces in person, design a bespoke commission or have your heirlooms restored by our master jewellers in Mayfair.</p>
          <div className="appt__actions">
            <Link to="/contact" className="btn btn--peach">
              Book an appointment <IconArrowRight />
            </Link>
            <Link to="/maison" className="btn btn--ghost-light">
              Our story
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
