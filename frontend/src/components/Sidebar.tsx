type SidebarIcon = 'home' | 'shop' | 'user' | 'images' | 'nodes'

type SidebarItem = {
  href: string
  label: string
  icon: SidebarIcon
}

type SidebarProps = {
  items: SidebarItem[]
}

function Icon({ name }: { name: SidebarIcon }) {
  const common = {
    width: 20,
    height: 20,
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

  if (name === 'user') {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 19.5c1.2-3.2 3.6-4.8 7-4.8s5.8 1.6 7 4.8" />
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

  return (
    <svg {...common}>
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="18" cy="17" r="2" />
      <path d="M8 12h8M16.2 8.6 8 11.2M8 12.8l8.2 2.6" />
    </svg>
  )
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav" aria-label="Atalhos">
        {items.map((item) => (
          <a
            key={item.href}
            className="sidebar-item"
            href={item.href}
            aria-label={item.label}
            title={item.label}
          >
            <Icon name={item.icon} />
          </a>
        ))}
      </nav>
    </aside>
  )
}
