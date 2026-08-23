import { request } from './client'
import type { CreateOrderInput, CreateOrderLineInput, Order } from '../types/order'

export function getOrders() {
  return request<Order[]>('/orders')
}

export function createOrder(payload: CreateOrderInput) {
  return request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
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
