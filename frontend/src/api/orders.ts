import { request } from './client'
import type {
  CancelOrderInput,
  CreateOrderInput,
  CreateOrderLineInput,
  Order,
} from '../types/order'

export function getOrders() {
  return request<Order[]>('/orders')
}

export function getOrder(id: number) {
  return request<Order>(`/orders/${id}`)
}

export function createOrder(payload: CreateOrderInput) {
  return request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function cancelOrder(id: number, payload: CancelOrderInput) {
  return request<Order>(`/orders/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getOrderCancellation(id: number) {
  return request<{
    id: number
    orderId: number
    userId: number
    reason: string
    details: string | null
    createdAt: string
  }>(`/orders/${id}/cancellation`)
}

export function createOrderInput(
  items: CreateOrderLineInput[],
  payment: string,
): CreateOrderInput {
  return {
    payment,
    items,
  }
}
