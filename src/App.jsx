import { lazy, Suspense, useEffect, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { initSmoothScroll, scrollToTop, scrollToEl, ScrollTrigger } from './lib/motion'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import CartDrawer from './components/CartDrawer'
import SearchOverlay from './components/SearchOverlay'
import Toast from './components/Toast'
import Home from './pages/Home'

const routes = {
  shop: () => import('./pages/Shop'),
  product: () => import('./pages/Product'),
  collections: () => import('./pages/Collections'),
  maison: () => import('./pages/Maison'),
  contact: () => import('./pages/Contact'),
  wishlist: () => import('./pages/Wishlist'),
  checkout: () => import('./pages/Checkout'),
  notFound: () => import('./pages/NotFound'),
}
const Shop = lazy(routes.shop)
const Product = lazy(routes.product)
const Collections = lazy(routes.collections)
const Maison = lazy(routes.maison)
const Contact = lazy(routes.contact)
const Wishlist = lazy(routes.wishlist)
const Checkout = lazy(routes.checkout)
const NotFound = lazy(routes.notFound)

export default function App() {
  const location = useLocation()

  useEffect(() => {
    initSmoothScroll()
    // Fetch every route chunk while idle so page switches are instant
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 600))
    idle(() => Object.values(routes).forEach((load) => load()))
  }, [])

  // Instant route change: jump to top (or to the #hash target) before paint
  useLayoutEffect(() => {
    if (location.hash) {
      setTimeout(() => scrollToEl(document.querySelector(location.hash)), 120)
    } else {
      scrollToTop(true)
    }
    const t = setTimeout(() => ScrollTrigger.refresh(), 150)
    document.getElementById('main')?.focus({ preventScroll: true })
    return () => clearTimeout(t)
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  const isProduct = location.pathname.startsWith('/product/')
  const isCheckout = location.pathname === '/checkout'

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header booted />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home booted />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/maison" element={<Maison />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <BottomNav hidden={isProduct || isCheckout} />
      <CartDrawer />
      <SearchOverlay />
      <Toast />
    </MotionConfig>
  )
}
