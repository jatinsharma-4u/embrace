import { useEffect } from 'react'

const SELECTOR = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

// Keeps keyboard focus inside an open dialog and restores it on close.
export default function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active) return
    const prev = document.activeElement
    const node = ref.current
    const t = setTimeout(() => {
      const first = node?.querySelector('[data-autofocus]') || node?.querySelector(SELECTOR)
      first?.focus({ preventScroll: true })
    }, 60)

    const onKey = (e) => {
      if (e.key !== 'Tab' || !node) return
      const els = [...node.querySelectorAll(SELECTOR)].filter((el) => el.offsetParent !== null)
      if (!els.length) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      prev?.focus?.({ preventScroll: true })
    }
  }, [active, ref])
}
