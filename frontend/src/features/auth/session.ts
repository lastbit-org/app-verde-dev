const KEY = 'verde.session.user'

export function forgetLegacySession() {
  localStorage.removeItem(KEY)
}
