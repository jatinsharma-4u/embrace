import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { initSmoothScroll, scrollToTop, scrollToEl, ScrollTrigger } from './lib/motion'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import CartDrawer from './components/CartDrawer'
import SearchOverlay from './components/SearchOverlay'
import Toast from './components/Toast'
import Loader from './components/Loader'
import Home from './pages/Home'

const Shop = lazy(() => import('./pages/Shop'))
const Product = lazy(() => import('./pages/Product'))
const Collections = lazy(() => import('./pages/Collections'))
const Maison = lazy(() => import('./pages/Maison'))
const Contact = lazy(() => import('./pages/Contact'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Checkout = lazy(() => import('./pages/Checkout'))

export default function App() {
  const location = useLocation()
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    initSmoothScroll()
  }, [])

  // Warm up route chunks once the first paint is done
  useEffect(() => {
    if (!booted) return
    const id = setTimeout(() => {
      import('./pages/Shop')
      import('./pages/Product')
      import('./pages/Collections')
    }, 1200)
    return () => clearTimeout(id)
  }, [booted])

  const onExitComplete = () => {
    scrollToTop(true)
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
      if (location.hash) {
        setTimeout(() => scrollToEl(document.querySelector(location.hash)), 450)
      }
    })
    const main = document.getElementById('main')
    main?.focus({ preventScroll: true })
  }

  const isProduct = location.pathname.startsWith('/product/')
  const isCheckout = location.pathname === '/checkout'

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">Skip to content</a>
      <Loader onDone={() => setBooted(true)} />
      <Header booted={booted} />
      <main id="main" tabIndex={-1} className={isProduct ? 'has-sticky-cta' : ''}>
        <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
          <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home booted={booted} />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<Product />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/maison" element={<Maison />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <BottomNav hidden={isProduct || isCheckout} />
      <CartDrawer />
      <SearchOverlay />
      <Toast />
    </MotionConfig>
  )
}
