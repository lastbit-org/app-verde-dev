import type { User } from '../../types/user'

const KEY = 'verde.session.user'

export function readSession(): User | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as User

    if (!parsed?.id || !parsed.name || !parsed.email) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function writeSession(user: User) {
  localStorage.setItem(KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(KEY)
}
