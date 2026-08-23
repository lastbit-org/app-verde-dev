import { canManageCatalog } from '../features/auth/roles'
import type { User } from '../types/user'

export type NavAction = 'logout'

export const menu = [
  { href: '/#topo', label: 'Início' },
  { href: '/products', label: 'Produtos' },
  { href: '/cart', label: 'Carrinho' },
  { href: '/checkout', label: 'Pagamento' },
  { href: '/user', label: 'Conta' },
]

export const shortcuts = [
  { href: '/#topo', label: 'Início', icon: 'home' as const },
  { href: '/products', label: 'Produtos', icon: 'shop' as const },
  { href: '/products/new', label: 'Nova peça', icon: 'plus' as const },
  { href: '/cart', label: 'Carrinho', icon: 'bag' as const },
  { href: '/user', label: 'Conta', icon: 'user' as const },
  { href: '/checkout', label: 'Pagamento', icon: 'nodes' as const },
]

export const account = [
  { href: '/user', label: 'Meu perfil', icon: 'user' as const },
  { href: '/user#pedidos', label: 'Pedidos', icon: 'package' as const },
  { href: '/purchases', label: 'Compras', icon: 'receipt' as const },
  { href: '/products', label: 'Produtos', icon: 'shop' as const },
  { href: '/favorites', label: 'Favoritos', icon: 'heart' as const },
]

export function menuFor(user: User | null) {
  if (user) {
    return [
      ...menu,
      { href: '/login', label: 'Sair', action: 'logout' as const },
    ]
  }

  return [...menu, { href: '/login', label: 'Entrar' }]
}

export function shortcutsFor(user: User | null) {
  return shortcuts.filter(
    (item) => item.href !== '/products/new' || canManageCatalog(user?.role),
  )
}

export function accountFor(user: User | null) {
  if (!user) {
    return account
  }

  return [
    ...account,
    {
      href: '/login',
      label: 'Sair',
      icon: 'logout' as const,
      action: 'logout' as const,
    },
  ]
}
