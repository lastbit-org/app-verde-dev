import { Link, NavLink } from 'react-router-dom'
import type { NavItem } from '../layout/nav'
import { Icon } from './Icon'

type SidebarProps = {
  items: NavItem[]
  side?: 'start' | 'end'
  label?: string
  onLogout?: () => void
}

export function Sidebar({
  items,
  side = 'start',
  label = 'Atalhos',
  onLogout,
}: SidebarProps) {
  return (
    <aside className={`sidebar${side === 'end' ? ' sidebar-end' : ''}`}>
      <nav className="sidebar-nav" aria-label={label}>
        {items.map((item) =>
          item.action === 'logout' ? (
            <button
              key={item.label}
              type="button"
              className="sidebar-item"
              aria-label={item.label}
              title={item.label}
              onClick={() => onLogout?.()}
            >
              <Icon name={item.icon} />
            </button>
          ) : item.href.startsWith('/') && !item.href.includes('#') ? (
            <NavLink
              key={`${item.href}-${item.label}`}
              end={item.href !== '/categories'}
              className={({ isActive }) =>
                isActive ? 'sidebar-item is-active' : 'sidebar-item'
              }
              to={item.href}
              aria-label={item.label}
              title={item.label}
            >
              <Icon name={item.icon} />
            </NavLink>
          ) : (
            <Link
              key={`${item.href}-${item.label}`}
              className="sidebar-item"
              to={item.href}
              aria-label={item.label}
              title={item.label}
            >
              <Icon name={item.icon} />
            </Link>
          ),
        )}
      </nav>
    </aside>
  )
}
