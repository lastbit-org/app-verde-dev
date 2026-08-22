import { Link, NavLink } from 'react-router-dom'

type MenuItem = {
  href: string
  label: string
}

type MenuBarProps = {
  brand: string
  items: MenuItem[]
}

export function MenuBar({ brand, items }: MenuBarProps) {
  return (
    <header className="menubar">
      <Link className="brand" to="/">
        <span className="brand-mark" aria-hidden="true" />
        {brand}
      </Link>
      <nav className="menubar-nav" aria-label="Principal">
        {items.map((item) =>
          item.href === '/login' ? (
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
