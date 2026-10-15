import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import Page from '../components/Page'
import PageHero from '../components/PageHero'
import Reveal, { SplitHeading } from '../components/Reveal'
import { byCollection, collections, formatPrice } from '../data/products'
import { gsap, prefersReducedMotion, scrollToEl } from '../lib/motion'
import { IconArrowRight } from '../components/Icons'

function CollectionBlock({ c, i }) {
  const ref = useRef(null)
  const pieces = byCollection(c.slug)
  const dark = i % 2 === 0

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const st = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true }
      gsap.fromTo('.cblock__photo img', { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1.02, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.cblock__hero', { yPercent: 25, rotate: -6 }, { yPercent: -20, rotate: 4, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.cblock__num', { yPercent: 40 }, { yPercent: -40, ease: 'none', scrollTrigger: st })
    },
    { scope: ref }
  )

  return (
    <section id={c.slug} ref={ref} className={`cblock ${dark ? 'cblock--dark' : ''} ${i % 2 ? 'cblock--flip' : ''}`} aria-labelledby={`${c.slug}-t`}>
      {dark && i > 0 && <div className="gold-chain cblock__chain" aria-hidden="true" />}
      <div className="container cblock__inner">
        <div className="cblock__media">
          <div className="cblock__photo reveal-clip">
            <img src={c.cover} alt={`${c.name} — editorial photograph`} loading="lazy" />
          </div>
          <img className="cblock__hero" src={c.hero} alt="" aria-hidden="true" loading="lazy" />
          <span className="cblock__num" aria-hidden="true">
            0{i + 1}
          </span>
        </div>
        <div className="cblock__body">
          <Reveal as="p" className={`eyebrow ${dark ? 'eyebrow--light' : ''}`}>
            Collection {String(i + 1).padStart(2, '0')} · {pieces.length} pieces
          </Reveal>
          <SplitHeading text={c.name} className="cblock__title" />
          <Reveal as="p" className="cblock__tag script text-gold" delay={0.1}>
            {c.tagline}
          </Reveal>
          <Reveal as="p" className="cblock__desc" delay={0.15}>
            {c.description}
          </Reveal>
          <Reveal as="ul" className="cblock__strip" delay={0.2}>
            {pieces.slice(0, 3).map((p) => (
              <li key={p.slug}>
                <Link to={`/product/${p.slug}`} className="mini">
                  <span className="mini__img">
                    <img src={p.image} alt="" loading="lazy" />
                  </span>
                  <span className="mini__name">{p.name}</span>
                  <span className="mini__price tabular">{formatPrice(p.price)}</span>
                </Link>
              </li>
            ))}
          </Reveal>
          <Reveal delay={0.25}>
            <Link to={`/shop?collection=${c.slug}`} className={`btn ${dark ? 'btn--peach' : 'btn--emerald'}`}>
              Explore {c.name} <IconArrowRight />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default function Collections() {
  return (
    <Page title="Collections">
      <PageHero
        eyebrow="Five worlds of colour & gold"
        title="Collections"
        script="since 1996"
        text="From Colombian emeralds to hand-wrought temple gold — each collection tells its own story, crafted by the same hands."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Collections' }]}
        decor={[{ src: '/img/p/necklace_119.webp' }, { src: '/img/p/jewelry_6705.webp' }]}
        size="lg"
      >
        <nav className="cindex no-scrollbar" aria-label="Jump to collection">
          {collections.map((c) => (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              className="chip chip--dark"
              onClick={(e) => {
                e.preventDefault()
                scrollToEl(document.getElementById(c.slug))
              }}
            >
              {c.name}
            </a>
          ))}
        </nav>
      </PageHero>
      {collections.map((c, i) => (
        <CollectionBlock key={c.slug} c={c} i={i} />
      ))}
    </Page>
  )
}
