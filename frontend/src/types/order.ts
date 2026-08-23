export type OrderStatus = 'preparando' | 'em trânsito' | 'entregue' | 'cancelado'

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
