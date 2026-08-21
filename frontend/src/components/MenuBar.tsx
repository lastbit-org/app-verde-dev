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
      <a className="brand" href="#topo">
        <span className="brand-mark" aria-hidden="true" />
        {brand}
      </a>
      <nav className="menubar-nav" aria-label="Principal">
        {items.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
