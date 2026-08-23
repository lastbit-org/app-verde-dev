import { isAdmin } from '../features/auth/roles'
import type { IconName } from '../components/Icon'
import type { User } from '../types/user'

export type NavAction = 'logout'

export type NavItem = {
  href: string
  label: string
  icon: IconName
  action?: NavAction
}

export const storeNav: NavItem[] = [
  { href: '/', label: 'Início', icon: 'home' },
  { href: '/#categorias', label: 'Categorias', icon: 'grid' },
  { href: '/#promocoes', label: 'Promoções', icon: 'tag' },
]

export const accountNav: NavItem[] = [
  { href: '/user', label: 'Conta', icon: 'user' },
  { href: '/purchases', label: 'Compras', icon: 'receipt' },
  { href: '/favorites', label: 'Favoritos', icon: 'heart' },
  { href: '/cart', label: 'Carrinho', icon: 'bag' },
]

export const guestNav: NavItem[] = [
  { href: '/login', label: 'Entrar', icon: 'user' },
  { href: '/cart', label: 'Carrinho', icon: 'bag' },
]

export const adminNav: NavItem[] = [
  { href: '/products', label: 'Todos os produtos', icon: 'shop' },
  { href: '/users', label: 'Todos os usuários', icon: 'users' },
  { href: '/orders', label: 'Todos os pedidos', icon: 'package' },
]

export function clientNavFor(user: User | null): NavItem[] {
  if (!user) {
    return guestNav
  }

  return accountNav
}

export function adminNavFor(user: User | null): NavItem[] {
  if (!user || !isAdmin(user.role)) {
    return []
  }

  return adminNav
}
