import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { collections } from '../data/products'
import { ease } from '../lib/motion'
import Logo from './Logo'
import {
  IconArrowRight, IconCheck, IconChevronDown, IconFacebook, IconGift, IconInstagram, IconMail,
  IconPhone, IconPinterest, IconRefresh, IconShield, IconTiktok, IconTruck,
} from './Icons'

const UKFlag = () => (
  <svg viewBox="0 0 30 30" width="22" height="22" aria-hidden="true" className="flag">
    <defs>
      <clipPath id="fl-c"><circle cx="15" cy="15" r="15" /></clipPath>
    </defs>
    <g clipPath="url(#fl-c)">
      <rect x="-15" width="60" height="30" fill="#012169" />
      <path d="M-15 0l60 30m0-30L-15 30" stroke="#fff" strokeWidth="6" />
      <path d="M-15 0l60 30m0-30L-15 30" stroke="#C8102E" strokeWidth="3" />
      <path d="M15 0v30M-15 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M15 0v30M-15 15h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
)

const perks = [
  { Icon: IconTruck, title: 'Complimentary delivery', text: 'Insured & signed-for, worldwide' },
  { Icon: IconRefresh, title: '30-day returns', text: 'Effortless exchanges' },
  { Icon: IconShield, title: 'Lifetime warranty', text: 'Certified & conflict-free' },
  { Icon: IconGift, title: 'Signature packaging', text: 'Every piece gift-wrapped' },
]

const prevent = (e) => e.preventDefault()

function Newsletter() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState('idle') // idle | error | done
  const [msg, setMsg] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setState('error')
      setMsg('Please enter a valid email address, e.g. name@example.com')
      return
    }
    if (!consent) {
      setState('error')
      setMsg('Please tick the box so we can send you our letters.')
      return
    }
    setState('done')
  }

  if (state === 'done')
    return (
      <motion.div className="newsletter newsletter--done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} role="status">
        <span className="newsletter__check"><IconCheck /></span>
        <div>
          <p className="newsletter__title">Welcome to the Maison.</p>
          <p className="newsletter__sub">Your first letter, with 10% off your first piece, is on its way.</p>
        </div>
      </motion.div>
    )

  return (
    <form className="newsletter" onSubmit={submit} noValidate>
      <p className="newsletter__title">Letters from the Atelier</p>
      <p className="newsletter__sub">New collections, private previews and stories from our workshop.</p>
      <div className="newsletter__pill" data-error={state === 'error'}>
        <IconMail className="newsletter__icon" />
        <label htmlFor="nl-email" className="sr-only">Email address</label>
        <input
          id="nl-email"
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (state === 'error') setState('idle')
          }}
          aria-invalid={state === 'error'}
          aria-describedby={state === 'error' ? 'nl-err' : undefined}
        />
        <button type="submit" className="newsletter__btn">
          <span>Subscribe</span> <IconArrowRight />
        </button>
      </div>
      <label className="consent">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span className="consent__box" aria-hidden="true"><IconCheck /></span>
        <span>Yes, I would like to receive personalised information on products, special offers and other useful information.</span>
      </label>
      {state === 'error' && <p id="nl-err" className="newsletter__err" role="alert">{msg}</p>}
    </form>
  )
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="gold-chain site-footer__chain" aria-hidden="true" />
      <div className="site-footer__glow" aria-hidden="true" />

      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Logo size="xl" as="span" />
            <p>Fine jewellery in emerald and gold, designed and handcrafted in our London atelier since 1996.</p>
            <div className="socials">
              {[
                ['Instagram', IconInstagram],
                ['Facebook', IconFacebook],
                ['Pinterest', IconPinterest],
                ['TikTok', IconTiktok],
              ].map(([n, I]) => (
                <a key={n} href="#" className="socials__btn" aria-label={n} onClick={prevent}>
                  <I />
                </a>
              ))}
            </div>
          </div>
          <Newsletter />
        </div>

        <ul className="perks" aria-label="Our promise">
          {perks.map(({ Icon, title, text }) => (
            <li key={title}>
              <span className="perks__icon"><Icon /></span>
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
            </li>
          ))}
        </ul>

        <div className="site-footer__grid">
          <nav aria-label="Shop">
            <h3>Shop</h3>
            <ul>
              <li><Link to="/shop?category=rings">Rings</Link></li>
              <li><Link to="/shop?category=earrings">Earrings</Link></li>
              <li><Link to="/shop?category=necklaces">Necklaces</Link></li>
              <li><Link to="/shop?category=bracelets">Bracelets</Link></li>
              <li><Link to="/shop?sort=new">New arrivals</Link></li>
            </ul>
          </nav>
          <nav aria-label="Collections">
            <h3>Collections</h3>
            <ul>
              {collections.map((c) => (
                <li key={c.slug}><Link to={`/shop?collection=${c.slug}`}>{c.name}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="The Maison">
            <h3>The Maison</h3>
            <ul>
              <li><Link to="/maison">Our story</Link></li>
              <li><Link to="/maison#craft">Craftsmanship</Link></li>
              <li><Link to="/contact">Book an appointment</Link></li>
              <li><Link to="/contact#faq">Delivery &amp; returns</Link></li>
              <li><Link to="/wishlist">Your wishlist</Link></li>
            </ul>
          </nav>
          <div className="service">
            <h3>Customer service · UK</h3>
            <ul className="service__hours">
              <li><span>Monday – Friday</span><span className="tabular">7:00am – 8:00pm</span></li>
              <li><span>Saturday</span><span className="tabular">7:00am – 4:00pm</span></li>
              <li><span>Sunday</span><span>Closed</span></li>
            </ul>
            <a href="tel:+442079460321" className="service__line"><IconPhone /> +44 20 7946 0321</a>
            <a href="mailto:atelier@embraceluxury.co.uk" className="service__line"><IconMail /> atelier@embraceluxury.co.uk</a>
            <button className="region" type="button" aria-label="International customer service. Current region: United Kingdom">
              <UKFlag />
              <span>International customer service</span>
              <IconChevronDown />
            </button>
          </div>
        </div>
      </div>

      <motion.div
        className="site-footer__word"
        aria-hidden="true"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease }}
      >
        Luxury
      </motion.div>

      <div className="container site-footer__bottom">
        <p>© 2026 Embrace Luxury. All rights reserved. Handcrafted with love in London.</p>
        <ul>
          {['Privacy', 'Terms', 'Cookies', 'Accessibility'].map((l) => (
            <li key={l}><a href="#" onClick={prevent}>{l}</a></li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
