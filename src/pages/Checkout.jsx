import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Page from '../components/Page'
import { Breadcrumbs } from '../components/PageHero'
import Sparkle from '../components/Sparkle'
import { useStore } from '../context/StoreContext'
import { formatPrice } from '../data/products'
import { ease } from '../lib/motion'
import { IconArrowLeft, IconArrowRight, IconCheck, IconChevronDown, IconGift, IconShield, IconTruck } from '../components/Icons'

const STEPS = ['Contact', 'Delivery', 'Payment']

const DELIVERY = [
  { id: 'standard', label: 'Complimentary insured delivery', note: '2–4 working days · signed for', price: 0 },
  { id: 'express', label: 'Express next-day', note: 'Order before 2pm', price: 25 },
  { id: 'collect', label: 'Collect from Mount Street, Mayfair', note: 'Ready within 48 hours', price: 0 },
]

const PAY = [
  { id: 'card', label: 'Card' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'applepay', label: 'Apple Pay' },
]

const RULES = {
  email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? '' : 'Enter a valid email, e.g. name@example.com'),
  first: (v) => (v.trim() ? '' : 'Enter your first name'),
  last: (v) => (v.trim() ? '' : 'Enter your last name'),
  address: (v) => (v.trim().length > 4 ? '' : 'Enter your street address'),
  city: (v) => (v.trim() ? '' : 'Enter your town or city'),
  postcode: (v) => (/^[A-Za-z0-9 ]{4,9}$/.test(v.trim()) ? '' : 'Enter a valid postcode'),
  cardName: (v) => (v.trim() ? '' : 'Enter the name on the card'),
  cardNumber: (v) => (v.replace(/\s/g, '').length >= 15 ? '' : 'Enter a 15–16 digit card number'),
  expiry: (v) => (/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(v) ? '' : 'Use MM / YY'),
  cvc: (v) => (/^\d{3,4}$/.test(v) ? '' : '3 or 4 digits'),
}
const STEP_FIELDS = [['email'], ['first', 'last', 'address', 'city', 'postcode'], ['cardName', 'cardNumber', 'expiry', 'cvc']]

const formatCard = (v) =>
  v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d
}

function Summary({ lines, subtotal, shipping, wrap, total }) {
  return (
    <div className="osum">
      <ul className="osum__lines">
        {lines.map((l) => (
          <li key={l.key} className="osum__line">
            <span className="osum__img">
              <img src={l.product.image} alt="" />
              <span className="osum__qty tabular">{l.qty}</span>
            </span>
            <span className="osum__text">
              <strong>{l.product.name}</strong>
              <small>
                {l.metalObj.name}
                {l.size ? ` · ${l.size}` : ''}
              </small>
            </span>
            <span className="tabular">{formatPrice(l.unit * l.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="osum__totals">
        <div>
          <dt>Subtotal</dt>
          <dd className="tabular">{formatPrice(subtotal)}</dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd className="tabular">{shipping ? formatPrice(shipping) : 'Complimentary'}</dd>
        </div>
        {wrap && (
          <div>
            <dt>Signature gift wrap</dt>
            <dd>Complimentary</dd>
          </div>
        )}
        <div className="osum__total">
          <dt>Total</dt>
          <dd className="tabular">
            <small>GBP</small> {formatPrice(total)}
          </dd>
        </div>
      </dl>
      <ul className="osum__assure">
        <li>
          <IconShield /> Secure, encrypted checkout
        </li>
        <li>
          <IconTruck /> Insured delivery &amp; 30-day returns
        </li>
      </ul>
    </div>
  )
}

export default function Checkout() {
  const { lines, subtotal, clearCart } = useStore()
  const [step, setStep] = useState(0)
  const [v, setV] = useState({
    email: '', phone: '', news: false, first: '', last: '', address: '', apt: '', city: '', postcode: '', country: 'United Kingdom',
    delivery: 'standard', pay: 'card', cardName: '', cardNumber: '', expiry: '', cvc: '', wrap: true, message: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('form') // form | placing | done
  const [order, setOrder] = useState(null)
  const [sumOpen, setSumOpen] = useState(false)

  const shipping = DELIVERY.find((d) => d.id === v.delivery).price
  const total = subtotal + shipping
  const orderNo = useMemo(() => `EL-${Math.floor(100000 + Math.random() * 899999)}`, [])

  const set = (k, fmt) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : fmt ? fmt(e.target.value) : e.target.value
    setV((s) => ({ ...s, [k]: val }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: RULES[k]?.(val) || '' }))
  }
  const blur = (k) => () => RULES[k] && setErrors((er) => ({ ...er, [k]: RULES[k](v[k]) }))

  const validate = (i) => {
    const fields = i === 2 && v.pay !== 'card' ? [] : STEP_FIELDS[i]
    const next = Object.fromEntries(fields.map((k) => [k, RULES[k](v[k])]))
    setErrors((er) => ({ ...er, ...next }))
    const bad = fields.find((k) => next[k])
    if (bad) document.getElementById(`co-${bad}`)?.focus()
    return !bad
  }

  const nextStep = () => {
    if (!validate(step)) return
    if (step < 2) {
      setStep(step + 1)
      return
    }
    setStatus('placing')
    setTimeout(() => {
      setOrder({ no: orderNo, lines, subtotal, shipping, total, email: v.email, delivery: DELIVERY.find((d) => d.id === v.delivery), wrap: v.wrap })
      clearCart()
      setStatus('done')
      window.scrollTo({ top: 0 })
    }, 1500)
  }

  const field = (k, label, props = {}, opt = false) => (
    <div className={`field ${props.wide ? 'field--wide' : ''}`}>
      <label htmlFor={`co-${k}`}>
        {label} {opt && <span className="muted">(optional)</span>}
      </label>
      <input
        id={`co-${k}`}
        className="input"
        value={v[k]}
        onChange={set(k, props.fmt)}
        onBlur={blur(k)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `co-${k}-e` : undefined}
        type={props.type || 'text'}
        autoComplete={props.ac}
        inputMode={props.im}
        placeholder={props.ph}
      />
      {errors[k] && (
        <p id={`co-${k}-e`} className="field-error" role="alert">
          {errors[k]}
        </p>
      )}
    </div>
  )

  if (status === 'done' && order)
    return (
      <Page title="Order confirmed" className="page--checkout">
        <div className="ptop" aria-hidden="true" />
        <section className="container confirm">
          <motion.div className="confirm__head" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <Sparkle size={96} />
            <p className="eyebrow">Order {order.no}</p>
            <h1>Thank you — your order is confirmed.</h1>
            <p className="muted">
              A confirmation has been sent to {order.email}. {order.delivery.label} · {order.delivery.note}.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 0.15 }} className="confirm__sum">
            <Summary lines={order.lines} subtotal={order.subtotal} shipping={order.shipping} wrap={order.wrap} total={order.total} />
          </motion.div>
          <div className="confirm__actions">
            <Link to="/shop" className="btn btn--emerald">
              Continue shopping <IconArrowRight />
            </Link>
            <Link to="/" className="btn btn--ghost">
              Back to home
            </Link>
          </div>
          <p className="confirm__note">This is a showcase site: no payment was taken and no order will be shipped.</p>
        </section>
      </Page>
    )

  if (!lines.length)
    return (
      <Page title="Checkout" className="page--checkout">
        <div className="ptop" aria-hidden="true" />
        <section className="container empty">
          <Sparkle size={96} />
          <h2>Your bag is empty</h2>
          <p>Add a piece to your bag to begin checkout.</p>
          <Link to="/shop" className="btn btn--emerald">
            Explore the collection <IconArrowRight />
          </Link>
        </section>
      </Page>
    )

  return (
    <Page title="Checkout" className="page--checkout">
      <div className="ptop" aria-hidden="true" />
      <div className="container">
        <Breadcrumbs items={[{ label: 'Bag', to: '/shop' }, { label: 'Checkout' }]} />
      </div>

      <section className="container co">
        <div className="co__main">
          <header className="co__head">
            <h1>Checkout</h1>
            <ol className="co__steps" aria-label="Checkout progress">
              {STEPS.map((s, i) => (
                <li key={s} data-state={i < step ? 'done' : i === step ? 'current' : 'todo'} aria-current={i === step ? 'step' : undefined}>
                  <button type="button" disabled={i > step} onClick={() => i < step && setStep(i)}>
                    <span className="co__dot">{i < step ? <IconCheck /> : i + 1}</span>
                    {s}
                  </button>
                </li>
              ))}
              <motion.span className="co__bar" aria-hidden="true" animate={{ scaleX: step / 2 }} transition={{ duration: 0.6, ease }} />
            </ol>
          </header>

          {/* Mobile order summary toggle */}
          <div className="co__mobsum">
            <button type="button" onClick={() => setSumOpen((o) => !o)} aria-expanded={sumOpen}>
              <span>{sumOpen ? 'Hide' : 'Show'} order summary</span>
              <IconChevronDown style={{ transform: sumOpen ? 'rotate(180deg)' : 'none', transition: 'transform .3s' }} />
              <strong className="tabular">{formatPrice(total)}</strong>
            </button>
            <AnimatePresence initial={false}>
              {sumOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease }} style={{ overflow: 'hidden' }}>
                  <Summary lines={lines} subtotal={subtotal} shipping={shipping} wrap={v.wrap} total={total} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form
            className="co__form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              nextStep()
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                className="co__panel"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease }}
              >
                {step === 0 && (
                  <fieldset className="co__group">
                    <legend>Contact details</legend>
                    <div className="co__grid">
                      {field('email', 'Email', { type: 'email', ac: 'email', im: 'email', wide: true })}
                      {field('phone', 'Phone', { type: 'tel', ac: 'tel', im: 'tel', wide: true }, true)}
                    </div>
                    <label className="check">
                      <input type="checkbox" checked={v.news} onChange={set('news')} />
                      <span className="check__box" aria-hidden="true">
                        <IconCheck />
                      </span>
                      Send me private previews and new collections
                    </label>
                  </fieldset>
                )}

                {step === 1 && (
                  <>
                    <fieldset className="co__group">
                      <legend>Delivery address</legend>
                      <div className="co__grid">
                        {field('first', 'First name', { ac: 'given-name' })}
                        {field('last', 'Last name', { ac: 'family-name' })}
                        {field('address', 'Address', { ac: 'address-line1', wide: true })}
                        {field('apt', 'Apartment, suite', { ac: 'address-line2', wide: true }, true)}
                        {field('city', 'Town / city', { ac: 'address-level2' })}
                        {field('postcode', 'Postcode', { ac: 'postal-code' })}
                        <div className="field field--wide">
                          <label htmlFor="co-country">Country</label>
                          <div className="select select--field">
                            <select id="co-country" value={v.country} onChange={set('country')} autoComplete="country-name">
                              {['United Kingdom', 'Ireland', 'France', 'United States', 'United Arab Emirates', 'India'].map((c) => (
                                <option key={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset className="co__group">
                      <legend>Delivery method</legend>
                      <div className="radios">
                        {DELIVERY.map((d) => (
                          <label key={d.id} className="radio" data-active={v.delivery === d.id}>
                            <input type="radio" name="delivery" value={d.id} checked={v.delivery === d.id} onChange={set('delivery')} />
                            <span className="radio__dot" aria-hidden="true" />
                            <span className="radio__text">
                              <strong>{d.label}</strong>
                              <small>{d.note}</small>
                            </span>
                            <span className="tabular radio__price">{d.price ? formatPrice(d.price) : 'Free'}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </>
                )}

                {step === 2 && (
                  <>
                    <fieldset className="co__group">
                      <legend>Payment</legend>
                      <div className="paytabs" role="radiogroup" aria-label="Payment method">
                        {PAY.map((p) => (
                          <label key={p.id} className="paytab" data-active={v.pay === p.id}>
                            <input type="radio" name="pay" value={p.id} checked={v.pay === p.id} onChange={set('pay')} />
                            {p.label}
                          </label>
                        ))}
                      </div>
                      <AnimatePresence mode="wait" initial={false}>
                        {v.pay === 'card' ? (
                          <motion.div key="card" className="co__grid" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                            {field('cardName', 'Name on card', { ac: 'cc-name', wide: true })}
                            {field('cardNumber', 'Card number', { ac: 'cc-number', im: 'numeric', fmt: formatCard, ph: '1234 5678 9012 3456', wide: true })}
                            {field('expiry', 'Expiry', { ac: 'cc-exp', im: 'numeric', fmt: formatExpiry, ph: 'MM / YY' })}
                            {field('cvc', 'Security code', { ac: 'cc-csc', im: 'numeric', fmt: (x) => x.replace(/\D/g, '').slice(0, 4), ph: '123' })}
                          </motion.div>
                        ) : (
                          <motion.p key="alt" className="co__alt" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                            You’ll be redirected to {PAY.find((p) => p.id === v.pay).label} to complete your purchase securely.
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <p className="co__demo">Demo checkout: no payment is taken. Please don’t enter real card details.</p>
                    </fieldset>
                    <fieldset className="co__group">
                      <legend>Gifting</legend>
                      <label className="check">
                        <input type="checkbox" checked={v.wrap} onChange={set('wrap')} />
                        <span className="check__box" aria-hidden="true">
                          <IconCheck />
                        </span>
                        <IconGift className="check__icon" /> Signature gift wrap (complimentary)
                      </label>
                      {v.wrap && (
                        <div className="field">
                          <label htmlFor="co-message">
                            Gift message <span className="muted">(optional)</span>
                          </label>
                          <textarea id="co-message" className="input" rows={3} maxLength={180} value={v.message} onChange={set('message')} />
                        </div>
                      )}
                    </fieldset>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="co__nav">
              {step > 0 ? (
                <button type="button" className="co__back" onClick={() => setStep(step - 1)}>
                  <IconArrowLeft /> Back
                </button>
              ) : (
                <Link to="/shop" className="co__back">
                  <IconArrowLeft /> Continue shopping
                </Link>
              )}
              <button type="submit" className="btn btn--emerald co__next" disabled={status === 'placing'} aria-busy={status === 'placing'}>
                {status === 'placing' ? (
                  <>
                    <span className="spinner" aria-hidden="true" /> Placing order…
                  </>
                ) : step < 2 ? (
                  <>
                    Continue to {STEPS[step + 1].toLowerCase()} <IconArrowRight />
                  </>
                ) : (
                  <>
                    Place order · <span className="tabular">{formatPrice(total)}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <aside className="co__side" aria-label="Order summary">
          <h2>Order summary</h2>
          <Summary lines={lines} subtotal={subtotal} shipping={shipping} wrap={v.wrap} total={total} />
        </aside>
      </section>
    </Page>
  )
}
