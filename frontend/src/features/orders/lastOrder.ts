import type { Order } from '../../types/order'

const KEY = 'verde.lastOrder'

export function writeLastOrder(order: Order) {
  sessionStorage.setItem(KEY, JSON.stringify(order))
}

export function readLastOrder(): Order | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Order
    if (!parsed?.orderId || !Array.isArray(parsed.items)) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}
