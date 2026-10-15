// Single-stroke icon set (1.5px, rounded) — consistent visual language.
const base = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

const make = (paths) => {
  const Icon = (props) => (
    <svg {...base} {...props}>
      {paths}
    </svg>
  )
  return Icon
}

export const IconBag = make(
  <>
    <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
    <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
  </>
)
export const IconHeart = make(
  <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
)
export const IconSearch = make(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </>
)
export const IconMenu = make(<path d="M4 7h16M4 12h16M4 17h10" />)
export const IconClose = make(<path d="M6 6l12 12M18 6 6 18" />)
export const IconArrowRight = make(<path d="M4 12h16m-6-6 6 6-6 6" />)
export const IconArrowLeft = make(<path d="M20 12H4m6-6-6 6 6 6" />)
export const IconArrowUpRight = make(<path d="M7 17 17 7M8 7h9v9" />)
export const IconPlus = make(<path d="M12 5v14M5 12h14" />)
export const IconMinus = make(<path d="M5 12h14" />)
export const IconChevronDown = make(<path d="m6 9 6 6 6-6" />)
export const IconChevronRight = make(<path d="m9 6 6 6-6 6" />)
export const IconChevronLeft = make(<path d="m15 6-6 6 6 6" />)
export const IconCheck = make(<path d="m5 12.5 4.5 4.5L19 7.5" />)
export const IconHome = make(
  <>
    <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-8.5Z" />
  </>
)
export const IconGrid = make(
  <>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.6" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" />
  </>
)
export const IconGem = make(
  <>
    <path d="M6.5 4h11L21 9l-9 11L3 9l3.5-5Z" />
    <path d="M3 9h18M9.5 4 8 9l4 11 4-11-1.5-5" />
  </>
)
export const IconUser = make(
  <>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
  </>
)
export const IconStar = (props) => (
  <svg {...base} fill="currentColor" stroke="none" {...props}>
    <path d="m12 3.6 2.5 5.3 5.8.7-4.3 4 1.1 5.8L12 16.6l-5.1 2.8L8 13.6l-4.3-4 5.8-.7L12 3.6Z" />
  </svg>
)
export const IconTruck = make(
  <>
    <path d="M3 6.5h11v9H3zM14 9.5h3.6L21 13v2.5h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </>
)
export const IconRefresh = make(
  <>
    <path d="M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9" />
    <path d="M18.5 3.5v3.8h-3.8M5.5 20.5v-3.8h3.8" />
  </>
)
export const IconShield = make(
  <>
    <path d="M12 3.5 5 6v5.5c0 4.4 3 7.8 7 9 4-1.2 7-4.6 7-9V6l-7-2.5Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </>
)
export const IconGift = make(
  <>
    <rect x="4" y="9" width="16" height="11" rx="1.5" />
    <path d="M3 9h18v3.5H3zM12 9v11M12 9C10.5 5.5 7 5 7 7s3 2 5 2Zm0 0c1.5-3.5 5-4 5-2s-3 2-5 2Z" />
  </>
)
export const IconMail = make(
  <>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </>
)
export const IconPhone = make(
  <path d="M5 4h3.5l1.7 4.3-2.2 1.5a11 11 0 0 0 6.2 6.2l1.5-2.2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />
)
export const IconPin = make(
  <>
    <path d="M12 21s7-5.6 7-11.5a7 7 0 0 0-14 0C5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </>
)
export const IconClock = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </>
)
export const IconFilter = make(<path d="M4 6h16M7 12h10M10 18h4" />)
export const IconSparkle = make(
  <path d="M12 3c.6 4.4 2.6 6.4 7 7-4.4.6-6.4 2.6-7 7-.6-4.4-2.6-6.4-7-7 4.4-.6 6.4-2.6 7-7ZM19 15.5c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5Z" />
)
export const IconZoom = make(
  <>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2M11 8.5v5M8.5 11h5" />
  </>
)
export const IconRuler = make(
  <>
    <rect x="2.5" y="8" width="19" height="8" rx="1.5" />
    <path d="M6.5 8v3M10 8v4.5M13.5 8v3M17 8v4.5" />
  </>
)
export const IconInstagram = make(
  <>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.8" cy="7.2" r=".6" fill="currentColor" />
  </>
)
export const IconFacebook = make(<path d="M14.5 8.5H16V5.2h-2.2c-2.4 0-3.6 1.5-3.6 3.8v2H8v3.2h2.2V21h3.3v-6.8h2.3l.5-3.2h-2.8V9.4c0-.6.3-.9 1-.9Z" />)
export const IconPinterest = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M11 9.5c.4-1.6 4.6-1.9 4.6 1.3 0 2.2-1.4 3.5-2.9 3.5-1 0-1.6-.8-1.4-1.8M11.2 12l-1.7 7.5" />
  </>
)
export const IconTiktok = make(<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.3 2.4 1.9 4 4.5 4.2" />)
export const IconWhatsapp = make(
  <>
    <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.7l-3.9.8Z" />
    <path d="M9.3 8.8c.2 2.8 2.6 5.4 5.6 5.8l1-1.4-1.6-.9-.8.8c-1-.4-2.1-1.5-2.5-2.5l.8-.8-.9-1.6-1.6.6Z" />
  </>
)
