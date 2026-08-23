export type OrderStatus = 'preparando' | 'em trânsito' | 'entregue' | 'cancelado'

export type CancelReason =
  | 'changed_mind'
  | 'wrong_item'
  | 'too_slow'
  | 'found_cheaper'
  | 'other'

export type OrderItem = {
  id: number
  orderId: number
  productId: number
  name: string
  price: number
  quantity: number
  discount: number
}

export type Order = {
  id: number
  orderId: string
  userId: number
  payment: string
  status: OrderStatus
  totalPrice: number
  createdAt: string
  items: OrderItem[]
  cancelReason: string | null
  cancelDetails: string | null
}

export type CreateOrderLineInput = {
  productId: number
  quantity: number
}

export type CreateOrderInput = {
  payment: string
  createdAt?: string
  items?: CreateOrderLineInput[]
}

export type CancelOrderInput = {
  reason: CancelReason
  details?: string
}
