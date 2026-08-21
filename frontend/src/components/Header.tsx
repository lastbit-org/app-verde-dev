type NavItem = {
  href: string
  label: string
}

type HeaderProps = {
  brand: string
  links: NavItem[]
}

export function Header({ brand, links }: HeaderProps) {
  return (
    <header className="header">
      <a className="brand" href="#topo">
        <span className="brand-mark" aria-hidden="true" />
        {brand}
      </a>
      <nav className="nav" aria-label="Seções">
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
