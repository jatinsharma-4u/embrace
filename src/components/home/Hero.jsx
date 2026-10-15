import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '../../lib/motion'
import { IconArrowRight, IconArrowUpRight, IconPlus } from '../Icons'

const LETTERS = 'Luxury'.split('')

/*
  Layout: a 3×3 grid (desktop) / single column (mobile).
  - The jewel occupies the centre column of rows 1–2 and is bottom-aligned, so the pendant
    always lands on the lower half of the wordmark, never on the side content.
  - The wordmark spans row 2 at full width and is sized from BOTH viewport width and height,
    so it can never overflow or clip.
  - Side content lives in rows 1 and 3 only, so nothing overlaps the title or the jewel.
*/
export default function Hero({ booted }) {
  const root = useRef(null)

  useGSAP(
    () => {
      if (!booted) return
      const q = gsap.utils.selector(root)
      const reduced = prefersReducedMotion()

      if (reduced) {
        gsap.set(q('[data-hero-in], .hero__letter, .hero__embrace, .hero__halo'), { clearProps: 'all', autoAlpha: 1 })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.fromTo(q('.hero__halo'), { scale: 0.7, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.2 }, 0)
        .fromTo(q('.hero__jewel'), { yPercent: -14 }, { yPercent: 0, duration: 2.6, ease: 'power3.out' }, 0)
        .fromTo(q('.hero__letter'), { yPercent: 105 }, { yPercent: 0, duration: 1.5, stagger: 0.06 }, 0.35)
        .fromTo(q('.hero__embrace'), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 1.2 }, 0.75)
        .fromTo(q('[data-hero-in]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out' }, 0.95)

      // Scroll depth — transform/opacity only, scrubbed so it can never cause layout shift
      // fromTo + immediateRender:false so these never capture the intro's hidden start state
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 0.6 }
      const scrollTween = (sel, from, to, extra = {}) =>
        gsap.fromTo(q(sel), from, { ...to, ease: 'none', immediateRender: false, scrollTrigger: { ...st, ...extra } })
      scrollTween('.hero__title', { yPercent: 0, opacity: 1 }, { yPercent: 18, opacity: 0.25 })
      scrollTween('.hero__jewel-wrap', { yPercent: 0 }, { yPercent: 5 })
    },
    { scope: root, dependencies: [booted] }
  )

  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion()) return
    const r = root.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(root.current.querySelector('.hero__tilt'), { x: x * 18, y: y * 10, rotate: x * 1.6, duration: 1.4, ease: 'power3.out' })
  }

  return (
    <section className="hero" ref={root} onPointerMove={onMove} aria-labelledby="hero-title">
      <div className="hero__frame">
        <div className="hero__bg" aria-hidden="true" />

        <div className="hero__grid">
          <Link to="/collections#emerald-atelier" className="hero__kicker" data-hero-in>
            <span className="hero__kicker-dot" aria-hidden="true" />
            <span>
              <strong>The Emerald Atelier</strong>
              <small>New season collection</small>
            </span>
          </Link>

          <div className="hero__jewel-wrap" aria-hidden="true">
            <span className="hero__halo" />
            <div className="hero__tilt">
              <div className="hero__jewel">
                <div className="hero__sway">
                  <img src="/img/p/necklace_65.webp" alt="" fetchPriority="high" width="929" height="1075" />
                  <span className="glint glint--1" />
                  <span className="glint glint--2" />
                  <span className="glint glint--3" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="hero__title" id="hero-title" aria-label="Embrace Luxury">
            <span className="hero__embrace" aria-hidden="true">
              Embrace
            </span>
            <span className="hero__word" aria-hidden="true">
              {LETTERS.map((l, i) => (
                <span className="hero__letter-mask" key={i}>
                  <span className={`hero__letter hero__letter--${i}`}>{l}</span>
                </span>
              ))}
            </span>
          </h1>

          <Link to="/collections#radiant-bloom" className="hero-card hero-card--bloom" data-hero-in>
            <img src="/img/photo/citrine-pendant.webp" alt="" width="60" height="60" />
            <span className="hero-card__title">
              Radiant <br />
              Bloom
            </span>
            <span className="hero-card__plus" aria-hidden="true">
              <IconPlus />
            </span>
            <span className="sr-only">Explore the Radiant Bloom collection</span>
          </Link>

          <div className="hero__lead">
            <p className="hero__desc" data-hero-in>
              Discover the allure of exquisite jewellery, meticulously crafted to elevate your every look.
            </p>
            <div className="hero__ctas" data-hero-in>
              <Link to="/collections" className="hero__cta">
                <span>View Collection</span>
                <IconArrowRight />
              </Link>
            </div>
          </div>

          <Link to="/maison" className="hero-card hero-card--community" data-hero-in>
            <span className="hero-card__row">
              <span className="hero-card__title">
                Lovers &amp; Supportive <br />
                Community
              </span>
              <span className="hero-card__arrow" aria-hidden="true">
                <IconArrowUpRight />
              </span>
            </span>
            <span className="hero-card__row hero-card__row--end">
              <span className="hero-card__num tabular">4.5k</span>
              <span className="avatars" aria-hidden="true">
                <img src="/img/photo/emerald-rings.webp" alt="" />
                <img src="/img/photo/flower-studs.webp" alt="" />
                <img src="/img/photo/swirl-earrings.webp" alt="" />
              </span>
            </span>
            <span className="sr-only">Read about our community of 4,500 clients</span>
          </Link>
        </div>

        <div className="hero__scroll" aria-hidden="true">
          <span />
        </div>
      </div>
      <div className="gold-chain hero__chain" aria-hidden="true" />
    </section>
  )
}
