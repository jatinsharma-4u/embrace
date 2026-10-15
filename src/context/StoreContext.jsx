import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { getProduct } from '../data/products'

const StoreContext = createContext(null)
const KEY = 'el-store-v1'

const load = () => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s && Array.isArray(s.cart) && Array.isArray(s.wishlist)) return s
  } catch {
    /* storage unavailable */
  }
  return { cart: [], wishlist: [] }
}

const lineKey = (l) => `${l.slug}|${l.metal}|${l.size ?? ''}`

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const key = lineKey(action.line)
      const exists = state.cart.find((l) => lineKey(l) === key)
      const cart = exists
        ? state.cart.map((l) => (lineKey(l) === key ? { ...l, qty: Math.min(9, l.qty + action.line.qty) } : l))
        : [...state.cart, action.line]
      return { ...state, cart }
    }
    case 'qty':
      return {
        ...state,
        cart: state.cart
          .map((l) => (lineKey(l) === action.key ? { ...l, qty: Math.max(0, Math.min(9, action.qty)) } : l))
          .filter((l) => l.qty > 0),
      }
    case 'remove':
      return { ...state, cart: state.cart.filter((l) => lineKey(l) !== action.key) }
    case 'restore':
      return { ...state, cart: action.cart }
    case 'clear':
      return { ...state, cart: [] }
    case 'wish': {
      const has = state.wishlist.includes(action.slug)
      return { ...state, wishlist: has ? state.wishlist.filter((s) => s !== action.slug) : [...state.wishlist, action.slug] }
    }
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const notify = useCallback((t) => {
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), ...t })
    toastTimer.current = setTimeout(() => setToast(null), t.duration ?? 4200)
  }, [])

  const addToCart = useCallback(
    (product, { metal, size, qty = 1 } = {}) => {
      const line = { slug: product.slug, metal: metal ?? product.metals[0].id, size: size ?? product.sizes?.[0] ?? null, qty }
      dispatch({ type: 'add', line })
      const metalName = product.metals.find((m) => m.id === line.metal)?.name ?? ''
      const detail = [metalName, line.size, qty > 1 ? `Qty ${qty}` : null].filter(Boolean).join(' · ')
      notify({ kind: 'cart', product, title: 'Added to bag', text: product.name, sub: detail, duration: 3200 })
    },
    [notify]
  )

  const removeLine = useCallback(
    (key) => {
      const before = state.cart
      dispatch({ type: 'remove', key })
      notify({ kind: 'undo', title: 'Removed from bag', action: { label: 'Undo', run: () => dispatch({ type: 'restore', cart: before }) } })
    },
    [state.cart, notify]
  )

  const toggleWish = useCallback(
    (product) => {
      const had = state.wishlist.includes(product.slug)
      dispatch({ type: 'wish', slug: product.slug })
      notify({ kind: 'wish', product, title: had ? 'Removed from saved' : 'Saved to your wishlist', text: product.name, duration: 2600 })
    },
    [state.wishlist, notify]
  )

  const lines = useMemo(
    () =>
      state.cart
        .map((l) => {
          const product = getProduct(l.slug)
          if (!product) return null
          const metal = product.metals.find((m) => m.id === l.metal) ?? product.metals[0]
          return { ...l, key: lineKey(l), product, metalObj: metal, unit: product.price + metal.delta }
        })
        .filter(Boolean),
    [state.cart]
  )

  const value = {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((n, l) => n + l.qty * l.unit, 0),
    wishlist: state.wishlist,
    isWished: (slug) => state.wishlist.includes(slug),
    addToCart,
    setQty: (key, qty) => dispatch({ type: 'qty', key, qty }),
    removeLine,
    clearCart: () => dispatch({ type: 'clear' }),
    toggleWish,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    toast,
    dismissToast: () => setToast(null),
    notify,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
