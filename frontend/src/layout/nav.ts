export const menu = [
  { href: '/#topo', label: 'Início' },
  { href: '/#conteudo', label: 'Produtos' },
  { href: '/#galeria', label: 'Galeria' },
  { href: '/#carrinho', label: 'Carrinho' },
  { href: '/user', label: 'Conta' },
]

export const shortcuts = [
  { href: '/#topo', label: 'Início', icon: 'home' as const },
  { href: '/#conteudo', label: 'Loja', icon: 'shop' as const },
  { href: '/#galeria', label: 'Fotos', icon: 'images' as const },
  { href: '/user', label: 'Conta', icon: 'user' as const },
  { href: '/#api', label: 'API', icon: 'nodes' as const },
]

export const account = [
  { href: '/user', label: 'Meu perfil', icon: 'user' as const },
  { href: '/user#pedidos', label: 'Pedidos', icon: 'package' as const },
  { href: '/#carrinho', label: 'Compras', icon: 'bag' as const },
  { href: '/#favoritos', label: 'Favoritos', icon: 'heart' as const },
]
