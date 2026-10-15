import { Link } from 'react-router-dom'

export default function Logo({ className = '', size = 'md', as = 'link' }) {
  const inner = (
    <>
      <span className="logo__top">Embrace</span>
      <span className="logo__script script">Luxury</span>
    </>
  )
  if (as === 'span') return <span className={`logo logo--${size} ${className}`}>{inner}</span>
  return (
    <Link to="/" className={`logo logo--${size} ${className}`} aria-label="Embrace Luxury — home">
      {inner}
    </Link>
  )
}
