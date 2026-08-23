export type CartItem = {
  id: number
  name: string
  description: string
  image: { src: string; alt: string }
  price: number
  originalPrice?: number
  quantity: number
}

const STORAGE_KEY = 'verde_cart'

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== 'object') {
    return false
  }

  const item = value as CartItem
  return (
    Number.isInteger(item.id) &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    typeof item.image?.src === 'string'
  )
}

export function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isCartItem)
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
