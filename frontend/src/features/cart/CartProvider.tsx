import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../../types/product'
import { initialCart, type CartItem } from './cartData'
import { productToCartItem } from './productToCartItem'

type CartValue = {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  addProduct: (product: Product) => void
  increase: (id: number) => void
  decrease: (id: number) => void
  remove: (id: number) => void
  clear: () => void
}

const CartContext = createContext<CartValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(initialCart)

  const addItem = useCallback((item: CartItem) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id)
      if (!existing) {
        return [...current, item]
      }

      return current.map((entry) =>
        entry.id === item.id
          ? { ...entry, quantity: entry.quantity + item.quantity }
          : entry,
      )
    })
  }, [])

  const addProduct = useCallback(
    (product: Product) => {
      addItem(productToCartItem(product))
    },
    [addItem],
  )

  const increase = useCallback((id: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    )
  }, [])

  const decrease = useCallback((id: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    )
  }, [])

  const remove = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const clear = useCallback(() => {
    setItems([])
  }, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const value = useMemo(
    () => ({
      items,
      total,
      addItem,
      addProduct,
      increase,
      decrease,
      remove,
      clear,
    }),
    [items, total, addItem, addProduct, increase, decrease, remove, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}
