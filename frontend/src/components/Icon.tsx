export type IconName =
  | 'home'
  | 'shop'
  | 'grid'
  | 'tag'
  | 'user'
  | 'users'
  | 'images'
  | 'nodes'
  | 'package'
  | 'bag'
  | 'heart'
  | 'receipt'
  | 'plus'
  | 'logout'

type IconProps = {
  name: IconName
}

export function Icon({ name }: IconProps) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  if (name === 'home') {
    return (
      <svg {...common}>
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
      </svg>
    )
  }

  if (name === 'shop') {
    return (
      <svg {...common}>
        <path d="M5 8h14l-1 12H6L5 8z" />
        <path d="M8 8V7a4 4 0 0 1 8 0v1" />
      </svg>
    )
  }

  if (name === 'grid') {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
        <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
        <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
        <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
      </svg>
    )
  }

  if (name === 'tag') {
    return (
      <svg {...common}>
        <path d="M20 13.5 12.5 21a2 2 0 0 1-2.8 0L3 14.3V4h10.3z" />
        <circle cx="8.2" cy="8.2" r="1.2" />
      </svg>
    )
  }

  if (name === 'user') {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 19.5c1.2-3.2 3.6-4.8 7-4.8s5.8 1.6 7 4.8" />
      </svg>
    )
  }

  if (name === 'users') {
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="2.8" />
        <path d="M3.5 19c.9-2.8 2.8-4.2 5.5-4.2s4.6 1.4 5.5 4.2" />
        <circle cx="17" cy="9" r="2.2" />
        <path d="M16 14.8c2 .3 3.6 1.5 4.4 4.2" />
      </svg>
    )
  }

  if (name === 'images') {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.4" />
        <path d="m8 16 3.2-3.2 2.3 2.3L17 12l3 4" />
      </svg>
    )
  }

  if (name === 'package') {
    return (
      <svg {...common}>
        <path d="M21 8.5 12 3 3 8.5v7L12 21l9-5.5z" />
        <path d="M3 8.5 12 14l9-5.5" />
        <path d="M12 14v7" />
      </svg>
    )
  }

  if (name === 'bag') {
    return (
      <svg {...common}>
        <path d="M6 8h12l-.8 12H6.8L6 8z" />
        <path d="M9 8V7a3 3 0 0 1 6 0v1" />
      </svg>
    )
  }

  if (name === 'heart') {
    return (
      <svg {...common}>
        <path d="M12 20s-7-4.4-9.2-8.2C1 8.8 2.4 5 6.2 5c2.1 0 3.4 1.2 5.8 3.6C14.4 6.2 15.7 5 17.8 5c3.8 0 5.2 3.8 3.4 6.8C19 15.6 12 20 12 20z" />
      </svg>
    )
  }

  if (name === 'receipt') {
    return (
      <svg {...common}>
        <path d="M7 3h10v18l-2.2-1.3-2.3 1.3-2.3-1.3-2.2 1.3z" />
        <path d="M10 8h4M10 12h4M10 16h2.5" />
      </svg>
    )
  }

  if (name === 'plus') {
    return (
      <svg {...common}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    )
  }

  if (name === 'logout') {
    return (
      <svg {...common}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="18" cy="17" r="2" />
      <path d="M8 12h8M16.2 8.6 8 11.2M8 12.8l8.2 2.6" />
    </svg>
  )
}
