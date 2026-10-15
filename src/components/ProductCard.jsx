import { memo, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useStore } from '../context/StoreContext'
import { formatPrice, getCollection } from '../data/products'
import { IconBag, IconCheck, IconHeart } from './Icons'

function AddButton({ product }) {
  const { addToCart } = useStore()
  const [added, setAdded] = useState(false)
  const t = useRef()
  useEffect(() => () => clearTimeout(t.current), [])

  const onClick = () => {
    addToCart(product)
    setAdded(true)
    clearTimeout(t.current)
    t.current = setTimeout(() => setAdded(false), 1800)
  }

  return (
    <motion.button
      type="button"
      className="pcard__add"
      data-added={added}
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      aria-label={added ? `${product.name} added to bag` : `Add ${product.name} to bag`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={added ? 'ok' : 'add'}
          className="pcard__add-inner"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {added ? <IconCheck /> : <IconBag />}
          <span className="pcard__add-label">{added ? 'Added' : 'Add'}</span>
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

function ProductCard({ product, priority = false }) {
  const { toggleWish, isWished } = useStore()
  const ref = useRef(null)
  const wished = isWished(product.slug)
  const collection = getCollection(product.collection)

  // Very subtle pointer tilt on fine pointers only
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [3, -3]), { stiffness: 160, damping: 22 })
  const ry = useSpring(useTransform(mx, [0, 1], [-3, 3]), { stiffness: 160, damping: 22 })

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <article className="pcard" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="pcard__media">
        <motion.div ref={ref} className="pcard__stage" style={{ rotateX: rx, rotateY: ry }}>
          <span className="pcard__velvet" aria-hidden="true" />
          <span className="pcard__frame" aria-hidden="true" />
          <img
            className="pcard__img"
            src={product.image}
            alt=""
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width="600"
            height="600"
            ref={(el) => el?.complete && el.naturalWidth && el.classList.add('is-loaded')}
            onLoad={(e) => e.currentTarget.classList.add('is-loaded')}
          />
          {product.badge && <span className={`pcard__badge ${product.badge === 'Limited' ? 'pcard__badge--gold' : ''}`}>{product.badge}</span>}
        </motion.div>
        <motion.button
          type="button"
          className="pcard__wish"
          data-active={wished}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          onClick={() => toggleWish(product)}
          whileTap={{ scale: 0.85 }}
        >
          <motion.span key={String(wished)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 520, damping: 14 }}>
            <IconHeart />
          </motion.span>
        </motion.button>
      </div>

      <div className="pcard__info">
        <p className="pcard__collection">{collection?.name}</p>
        <h3 className="pcard__name">
          <Link to={`/product/${product.slug}`} className="pcard__link">
            {product.name}
          </Link>
        </h3>
        <div className="pcard__meta">
          <div className="pcard__pricing">
            <span className="pcard__price tabular">{formatPrice(product.price)}</span>
            <span className="pcard__metals" aria-label={`Available in ${product.metals.map((m) => m.name).join(', ')}`}>
              {product.metals.map((m) => (
                <span key={m.id} style={{ background: m.swatch }} />
              ))}
            </span>
          </div>
          <AddButton product={product} />
        </div>
      </div>
    </article>
  )
}

export default memo(ProductCard)
