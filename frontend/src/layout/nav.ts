export const menu = [
  { href: '/#topo', label: 'Início' },
  { href: '/#galeria', label: 'Produtos' },
  { href: '/cart', label: 'Carrinho' },
  { href: '/checkout', label: 'Pagamento' },
  { href: '/user', label: 'Conta' },
]

export const shortcuts = [
  { href: '/#topo', label: 'Início', icon: 'home' as const },
  { href: '/#galeria', label: 'Loja', icon: 'shop' as const },
  { href: '/cart', label: 'Carrinho', icon: 'bag' as const },
  { href: '/user', label: 'Conta', icon: 'user' as const },
  { href: '/checkout', label: 'Pagamento', icon: 'nodes' as const },
]

export const account = [
  { href: '/user', label: 'Meu perfil', icon: 'user' as const },
  { href: '/user#pedidos', label: 'Pedidos', icon: 'package' as const },
  { href: '/cart', label: 'Compras', icon: 'bag' as const },
  { href: '/#favoritos', label: 'Favoritos', icon: 'heart' as const },
]
