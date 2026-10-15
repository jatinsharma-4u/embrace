import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Page from '../components/Page'
import PageHero from '../components/PageHero'
import ProductCard from '../components/ProductCard'
import Sparkle from '../components/Sparkle'
import { useStore } from '../context/StoreContext'
import { featured, getProduct } from '../data/products'
import { ease } from '../lib/motion'
import { IconArrowRight } from '../components/Icons'

export default function Wishlist() {
  const { wishlist } = useStore()
  const items = wishlist.map(getProduct).filter(Boolean)

  return (
    <Page title="Wishlist">
      <PageHero
        eyebrow="Saved for later"
        title="Your wishlist"
        text={items.length ? `${items.length} ${items.length === 1 ? 'piece' : 'pieces'} you love, kept safe on this device.` : 'Tap the heart on any piece to keep it here.'}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]}
        size="sm"
      />
      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <>
              <div className="empty">
                <Sparkle size={110} />
                <h2>Nothing saved yet</h2>
                <p>Discover pieces worth treasuring and save your favourites for later.</p>
                <Link to="/shop" className="btn btn--emerald">
                  Start exploring <IconArrowRight />
                </Link>
              </div>
              <h2 className="wish__suggest">You might begin with</h2>
              <ul className="pgrid">
                {featured.slice(0, 4).map((p) => (
                  <li key={p.slug}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <motion.ul layout className="pgrid">
              <AnimatePresence mode="popLayout">
                {items.map((p, i) => (
                  <motion.li
                    layout
                    key={p.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0, transition: { delay: (i % 4) * 0.06, duration: 0.6, ease } }}
                    viewport={{ once: true, amount: 0.12 }}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
                  >
                    <ProductCard product={p} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </section>
    </Page>
  )
}
