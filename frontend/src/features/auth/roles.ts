export type UserRole = 'user' | 'admin' | 'partner'

export const CATALOG_ROLES: UserRole[] = ['admin', 'partner']

export function canManageCatalog(role?: UserRole | null) {
  return role !== undefined && role !== null && CATALOG_ROLES.includes(role)
}

export function roleLabel(role: UserRole) {
  if (role === 'admin') {
    return 'Administrador'
  }

  if (role === 'partner') {
    return 'Parceiro'
  }

  return 'Cliente'
}

export function safeNextPath(value: string | null) {
  if (value && value.startsWith('/') && !value.startsWith('//')) {
    return value
  }

  return '/user'
}
