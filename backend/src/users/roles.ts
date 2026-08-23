export const USER_ROLES = ['user', 'admin', 'partner'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const CATALOG_ROLES: UserRole[] = ['admin', 'partner'];

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === 'string' &&
    (USER_ROLES as readonly string[]).includes(value)
  );
}

export function canManageCatalog(role: UserRole) {
  return CATALOG_ROLES.includes(role);
}

export function isAdmin(role: UserRole) {
  return role === 'admin';
}
