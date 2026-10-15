import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Page from '../components/Page'
import PageHero from '../components/PageHero'
import Reveal, { SplitHeading } from '../components/Reveal'
import Accordion, { AccordionItem } from '../components/Accordion'
import Sparkle from '../components/Sparkle'
import { ease } from '../lib/motion'
import { IconArrowRight, IconClock, IconMail, IconPhone, IconPin, IconWhatsapp } from '../components/Icons'

const TYPES = ['Private appointment', 'Bespoke commission', 'An existing order', 'Aftercare & repairs', 'Something else']

const validators = {
  name: (v) => (v.trim().length < 2 ? 'Please tell us your name.' : ''),
  email: (v) => (!/^\S+@\S+\.\S+$/.test(v) ? 'Please enter a valid email, e.g. name@example.com' : ''),
  message: (v) => (v.trim().length < 10 ? 'Please add a few more details (at least 10 characters).' : ''),
}

function ContactForm() {
  const [values, setValues] = useState({ name: '', email: '', phone: '', type: TYPES[0], date: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: validators[k]?.(e.target.value) || '' }))
  }
  const blur = (k) => () => validators[k] && setErrors((er) => ({ ...er, [k]: validators[k](values[k]) }))

  const submit = (e) => {
    e.preventDefault()
    const next = Object.fromEntries(Object.keys(validators).map((k) => [k, validators[k](values[k])]))
    setErrors(next)
    const firstBad = Object.keys(next).find((k) => next[k])
    if (firstBad) {
      document.getElementById(`c-${firstBad}`)?.focus()
      return
    }
    setStatus('sending')
    setTimeout(() => setStatus('done'), 1400)
  }

  const field = (k, label, props = {}, required = true) => (
    <div className="field">
      <label htmlFor={`c-${k}`}>
        {label} {required ? <span className="req" aria-hidden="true">*</span> : <span className="muted">(optional)</span>}
      </label>
      {props.as === 'textarea' ? (
        <textarea id={`c-${k}`} className="input" value={values[k]} onChange={set(k)} onBlur={blur(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `c-${k}-err` : undefined} required={required} rows={5} />
      ) : (
        <input id={`c-${k}`} className="input" value={values[k]} onChange={set(k)} onBlur={blur(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `c-${k}-err` : undefined} required={required} {...props} />
      )}
      {errors[k] && (
        <p className="field-error" id={`c-${k}-err`} role="alert">
          {errors[k]}
        </p>
      )}
    </div>
  )

  return (
    <div className="cform">
      <AnimatePresence mode="wait">
        {status === 'done' ? (
          <motion.div key="done" className="cform__done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} role="status">
            <Sparkle size={130} />
            <h2>Thank you, {values.name.split(' ')[0]}.</h2>
            <p>A member of our atelier team will reply to {values.email} within one working day.</p>
            <button
              className="btn btn--ghost"
              onClick={() => {
                setValues({ name: '', email: '', phone: '', type: TYPES[0], date: '', message: '' })
                setStatus('idle')
              }}
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }}>
            <h2 className="cform__title">Send us a message</h2>
            <p className="muted cform__sub">Fields marked * are required.</p>
            <div className="cform__grid">
              {field('name', 'Full name', { autoComplete: 'name' })}
              {field('email', 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email' })}
              {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel', inputMode: 'tel' }, false)}
              <div className="field">
                <label htmlFor="c-type">I’m enquiring about</label>
                <div className="select select--field">
                  <select id="c-type" value={values.type} onChange={set('type')}>
                    {TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <AnimatePresence initial={false}>
                {values.type === TYPES[0] && (
                  <motion.div className="field cform__full" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease }}>
                    <label htmlFor="c-date">
                      Preferred date <span className="muted">(optional)</span>
                    </label>
                    <input id="c-date" type="date" className="input" value={values.date} onChange={set('date')} />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="cform__full">{field('message', 'Message', { as: 'textarea' })}</div>
            </div>
            <button className="btn btn--emerald cform__submit" type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
              {status === 'sending' ? (
                <>
                  <span className="spinner" aria-hidden="true" /> Sending…
                </>
              ) : (
                <>
                  Send message <IconArrowRight />
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Contact() {
  return (
    <Page title="Contact">
      <PageHero
        eyebrow="Client care"
        title="Contact &"
        script="appointments"
        text="Our atelier team is here to help — from choosing the perfect ring size to designing a one-of-a-kind commission."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        decor={[{ src: '/img/p/jewelry_6823.webp' }, { src: '/img/p/ring_23.webp' }]}
      />

      <section className="section container contact">
        <Reveal>
          <ContactForm />
        </Reveal>

        <aside className="contact__side">
          <Reveal className="boutique">
            <div className="boutique__map" aria-hidden="true">
              <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
                    <path d="M22 0H0v22" fill="none" stroke="rgba(231,194,122,.12)" />
                  </pattern>
                </defs>
                <rect width="400" height="220" fill="url(#grid)" />
                <path d="M-10 150 C80 120 140 170 220 120 S330 60 420 90" stroke="rgba(231,194,122,.45)" strokeWidth="10" fill="none" strokeLinecap="round" />
                <path d="M120 -10 L170 240 M280 -10 L250 240 M-10 60 L410 40" stroke="rgba(255,255,255,.12)" strokeWidth="6" fill="none" />
                <circle cx="210" cy="108" r="30" fill="rgba(231,194,122,.18)" />
                <circle cx="210" cy="108" r="9" fill="#e4bd72" />
              </svg>
              <span className="boutique__pin">
                <IconPin /> Mount Street, Mayfair
              </span>
            </div>
            <div className="boutique__body">
              <h2>The Mayfair Salon</h2>
              <address>
                18 Mount Street
                <br />
                Mayfair, London W1K 2RN
              </address>
              <ul className="boutique__lines">
                <li>
                  <a href="tel:+442079460321">
                    <IconPhone /> +44 20 7946 0321
                  </a>
                </li>
                <li>
                  <a href="mailto:atelier@embraceluxury.co.uk">
                    <IconMail /> atelier@embraceluxury.co.uk
                  </a>
                </li>
                <li>
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    <IconWhatsapp /> Chat on WhatsApp
                  </a>
                </li>
              </ul>
              <div className="boutique__hours">
                <p>
                  <IconClock /> Customer service hours for the UK
                </p>
                <dl>
                  <div><dt>Monday – Friday</dt><dd className="tabular">7:00am – 8:00pm</dd></div>
                  <div><dt>Saturday</dt><dd className="tabular">7:00am – 4:00pm</dd></div>
                  <div><dt>Sunday</dt><dd>Closed</dd></div>
                </dl>
              </div>
            </div>
          </Reveal>
        </aside>
      </section>

      <section className="section faq" id="faq" aria-labelledby="faq-t">
        <div className="container faq__inner">
          <header className="section-head">
            <Reveal as="p" className="eyebrow">
              Good to know
            </Reveal>
            <SplitHeading text="Frequently asked" />
            <Reveal as="p">Can’t find what you’re looking for? Our team replies within one working day.</Reveal>
          </header>
          <Accordion>
            <AccordionItem title="How long does delivery take?" defaultOpen>
              <p>UK orders arrive in 2–4 working days by insured, signed-for courier. International delivery takes 5–7 working days. Made-to-order pieces take 4–6 weeks.</p>
            </AccordionItem>
            <AccordionItem title="What is your returns policy?">
              <p>Return or exchange any unworn piece within 30 days of delivery, free of charge. Engraved and bespoke pieces are final sale.</p>
            </AccordionItem>
            <AccordionItem title="How do I find my ring size?">
              <p>Visit us for a complimentary sizing, or request our free ring sizer by post. UK sizes H–R are available online; other sizes can be made to order.</p>
            </AccordionItem>
            <AccordionItem title="Are your stones ethically sourced?">
              <p>Yes. Every stone is traceable to source, our gold is 100% recycled, and diamonds over 0.3ct are independently certified.</p>
            </AccordionItem>
            <AccordionItem title="Do you offer bespoke commissions?">
              <p>Absolutely — book a design consultation at our Mayfair salon or by video call. Commissions typically take 8–12 weeks.</p>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </Page>
  )
}
