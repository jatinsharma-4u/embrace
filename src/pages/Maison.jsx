import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import Page from '../components/Page'
import PageHero from '../components/PageHero'
import Reveal, { SplitHeading } from '../components/Reveal'
import { ease, gsap, prefersReducedMotion } from '../lib/motion'
import { IconArrowRight, IconGem, IconRefresh, IconShield, IconSparkle } from '../components/Icons'

const TIMELINE = [
  { y: '1996', t: 'A bench in Hatton Garden', d: 'Founder Eleanor Vance opens a two-person workshop above a stone dealer in London’s jewellery quarter.' },
  { y: '2004', t: 'The first emerald', d: 'A single 4-carat Colombian emerald inspires the Emerald Atelier — still our signature collection.' },
  { y: '2012', t: 'Mount Street salon', d: 'Our Mayfair salon opens, offering private appointments and bespoke commissions.' },
  { y: '2019', t: '100% recycled gold', d: 'Every piece is now cast in recycled 18k and 22k gold, with fully traceable stones.' },
  { y: '2026', t: 'Thirty years', d: 'Forty-eight artisans, five collections and thousands of heirlooms in the making.' },
]

const STEPS = [
  { n: '01', t: 'The stone', d: 'Every emerald, ruby and diamond is selected by hand from trusted, traceable mines — fewer than one in forty make the cut.', img: '/img/p/emerald_22304.webp' },
  { n: '02', t: 'The drawing', d: 'Each design begins in pencil at our bench, refined until its proportions feel inevitable.', img: '/img/p/ring_110.webp' },
  { n: '03', t: 'The setting', d: 'Master setters raise every claw and bead by hand under the loupe, securing the stone so it can catch the most light.', img: '/img/p/jewelry_6797.webp' },
  { n: '04', t: 'The finish', d: 'Polished, inspected and hallmarked in London — then presented in our signature emerald box.', img: '/img/p/necklace_65.webp' },
]

const VALUES = [
  { Icon: IconGem, t: 'Traceable stones', d: 'Every gemstone is tracked from mine to bench, with certification for diamonds over 0.3ct.' },
  { Icon: IconRefresh, t: 'Recycled gold', d: 'All of our gold is 100% recycled, refined in the UK and hallmarked at the London Assay Office.' },
  { Icon: IconShield, t: 'Lifetime care', d: 'Complimentary cleaning, inspection and claw re-tipping for the life of your piece.' },
  { Icon: IconSparkle, t: 'Bespoke', d: 'Work one-to-one with our designers to create something that has never existed before.' },
]

function Step({ s, i, onActive }) {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onActive(i)
  }, [inView]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={ref} className="step" data-active={inView}>
      <img className="step__img hide-desktop" src={s.img} alt="" loading="lazy" />
      <span className="step__n">{s.n}</span>
      <h3>{s.t}</h3>
      <p>{s.d}</p>
    </div>
  )
}

export default function Maison() {
  const [active, setActive] = useState(0)
  const tl = useRef(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo('.tl__line span', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: tl.current, start: 'top 70%', end: 'bottom 60%', scrub: true } })
      gsap.utils.toArray('.tl__item', tl.current).forEach((el) =>
        gsap.fromTo(el, { autoAlpha: 0.25 }, { autoAlpha: 1, scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 55%', scrub: true } })
      )
    },
    { scope: tl }
  )

  return (
    <Page title="The Maison">
      <PageHero
        eyebrow="The Maison"
        title="Thirty years of"
        script="quiet brilliance"
        text="Embrace Luxury began with a single bench and a simple belief: that fine jewellery should be made slowly, honestly and to last for generations."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Maison' }]}
        decor={[{ src: '/img/p/emerald_12.webp' }, { src: '/img/p/ring_21.webp' }]}
        size="lg"
      />

      <section className="section story container" aria-labelledby="story-t">
        <div className="story__media">
          <Reveal className="story__photo story__photo--a reveal-clip">
            <img src="/img/photo/swirl-earrings.webp" alt="Gold swirl earrings on dark green leaf" loading="lazy" />
          </Reveal>
          <Reveal className="story__photo story__photo--b reveal-clip" delay={0.15}>
            <img src="/img/photo/citrine-pendant.webp" alt="Citrine pendant and earrings displayed on a branch" loading="lazy" />
          </Reveal>
        </div>
        <div className="story__body">
          <Reveal as="p" className="eyebrow">
            Our story
          </Reveal>
          <SplitHeading text="Made by hand, worn for a lifetime" className="story__title" />
          <Reveal as="p" delay={0.1}>
            We are a family of forty-eight designers, setters, polishers and gemologists working under one roof in London. Nothing is mass-produced;
            every piece passes through at least six pairs of hands before it reaches yours.
          </Reveal>
          <Reveal as="p" delay={0.15}>
            Our signature is colour — the deep, velvety green of a fine emerald set against the warmth of gold. It is the palette of this house and the
            thread that runs through every collection.
          </Reveal>
          <Reveal delay={0.2}>
            <p className="story__sign script text-gold">Eleanor Vance</p>
            <p className="muted">Founder &amp; Creative Director</p>
          </Reveal>
        </div>
      </section>

      <section className="craftsteps" id="craft" aria-labelledby="craft-t">
        <div className="gold-chain" aria-hidden="true" />
        <div className="container craftsteps__inner">
          <div className="craftsteps__sticky hide-mobile">
            <div className="craftsteps__stage">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active}
                  src={STEPS[active].img}
                  alt=""
                  initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.05, rotate: 4 }}
                  transition={{ duration: 0.6, ease }}
                />
              </AnimatePresence>
              <span className="craftsteps__count tabular">
                {STEPS[active].n} / 04
              </span>
            </div>
          </div>
          <div className="craftsteps__list">
            <p className="eyebrow eyebrow--light" id="craft-t">
              Craftsmanship
            </p>
            <h2 className="craftsteps__title">From stone to heirloom</h2>
            {STEPS.map((s, i) => (
              <Step key={s.n} s={s} i={i} onActive={setActive} />
            ))}
          </div>
        </div>
      </section>

      <section className="section container" aria-labelledby="tl-t">
        <header className="section-head section-head--center">
          <Reveal as="p" className="eyebrow">
            1996 — 2026
          </Reveal>
          <SplitHeading text="A history in gold" />
        </header>
        <div className="tl" ref={tl}>
          <div className="tl__line" aria-hidden="true">
            <span />
          </div>
          <ol className="tl__list">
          {TIMELINE.map((e, i) => (
            <li key={e.y} className={`tl__item ${i % 2 ? 'tl__item--r' : ''}`}>
              <span className="tl__dot" aria-hidden="true" />
              <span className="tl__year">{e.y}</span>
              <h3>{e.t}</h3>
              <p>{e.d}</p>
            </li>
          ))}
          </ol>
        </div>
      </section>

      <section className="section values" aria-labelledby="values-t">
        <div className="container">
          <header className="section-head section-head--center">
            <Reveal as="p" className="eyebrow">
              Our promise
            </Reveal>
            <SplitHeading text="Beauty with a conscience" />
          </header>
          <ul className="values__grid">
            {VALUES.map(({ Icon, t, d }, i) => (
              <Reveal as="li" key={t} delay={i * 0.08} className="value">
                <span className="value__icon">
                  <Icon />
                </span>
                <h3>{t}</h3>
                <p>{d}</p>
              </Reveal>
            ))}
          </ul>
          <div className="values__cta">
            <Link to="/contact" className="btn btn--emerald">
              Visit the atelier <IconArrowRight />
            </Link>
            <Link to="/collections" className="btn btn--ghost">
              Explore collections
            </Link>
          </div>
        </div>
      </section>
    </Page>
  )
}
