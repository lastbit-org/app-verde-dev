import { Link, NavLink } from 'react-router-dom'
import type { NavAction } from '../layout/nav'

type MenuItem = {
  href: string
  label: string
  action?: NavAction
}

type MenuBarProps = {
  brand: string
  items: MenuItem[]
  onLogout?: () => void
}

export function MenuBar({ brand, items, onLogout }: MenuBarProps) {
  return (
    <header className="menubar">
      <Link className="brand" to="/">
        <span className="brand-mark" aria-hidden="true" />
        {brand}
      </Link>
      <nav className="menubar-nav" aria-label="Principal">
        {items.map((item) =>
          item.action === 'logout' ? (
            <button
              key={item.label}
              type="button"
              onClick={() => onLogout?.()}
            >
              {item.label}
            </button>
          ) : item.href.startsWith('/') && !item.href.includes('#') ? (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              {item.label}
            </NavLink>
          ) : (
            <Link key={item.href} to={item.href}>
              {item.label}
            </Link>
          ),
        )}
      </nav>
    </header>
  )
}
