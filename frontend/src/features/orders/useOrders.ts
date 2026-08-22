import { useCallback, useEffect, useState } from 'react'
import { createOrder, getOrders } from '../../api/orders'
import type { CreateOrderInput, Order } from '../../types/order'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const list = await getOrders()
      setOrders([...list].sort((a, b) => b.id - a.id))
    } catch {
      setOrders([])
      setError('Não foi possível carregar os pedidos. Confira se a API está no ar.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadOrders()
  }, [loadOrders])

  const addOrder = useCallback(async (payload: CreateOrderInput) => {
    const order = await createOrder(payload)
    setOrders((current) => [order, ...current.filter((item) => item.id !== order.id)])
    return order
  }, [])

  return { orders, loading, error, addOrder }
}
