import { Link, NavLink } from 'react-router-dom'
import type { NavItem } from '../layout/nav'
import { Icon } from './Icon'

type BottomBarProps = {
  items: NavItem[]
}

export function BottomBar({ items }: BottomBarProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <nav className="bottombar" aria-label="Administração">
      {items.map((item) =>
        item.href.startsWith('/') && !item.href.includes('#') ? (
          <NavLink
            key={`${item.href}-${item.label}`}
            end
            className={({ isActive }) =>
              isActive ? 'bottombar-item is-active' : 'bottombar-item'
            }
            to={item.href}
            aria-label={item.label}
            title={item.label}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ) : (
          <Link
            key={`${item.href}-${item.label}`}
            className="bottombar-item"
            to={item.href}
            aria-label={item.label}
            title={item.label}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        ),
      )}
    </nav>
  )
}
