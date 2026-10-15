import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../context/StoreContext'
import { IconGem, IconGrid, IconHeart, IconHome, IconUser } from './Icons'

const items = [
  { to: '/', label: 'Home', Icon: IconHome, end: true },
  { to: '/shop', label: 'Shop', Icon: IconGrid },
  { to: '/collections', label: 'Collections', Icon: IconGem },
  { to: '/wishlist', label: 'Saved', Icon: IconHeart, badge: 'wish' },
  { to: '/maison', label: 'Maison', Icon: IconUser },
]

export default function BottomNav({ hidden }) {
  const { wishlist } = useStore()
  return (
    <motion.nav
      className="bottom-nav"
      aria-label="Mobile"
      initial={false}
      animate={{ y: hidden ? '120%' : 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <ul>
        {items.map(({ to, label, Icon, end, badge }) => (
          <li key={to}>
            <NavLink to={to} end={end} className="bottom-nav__item">
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="bn-pill" className="bottom-nav__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                  <span className="bottom-nav__icon">
                    <Icon />
                    {badge === 'wish' && wishlist.length > 0 && <span className="count-dot">{wishlist.length}</span>}
                  </span>
                  <span className="bottom-nav__label">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </motion.nav>
  )
}
