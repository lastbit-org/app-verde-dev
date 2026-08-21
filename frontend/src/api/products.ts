import { request } from './client'
import type { CreateProductInput, Product } from '../types/product'

export function getProducts() {
  return request<Product[]>('/products')
}

export function createProduct(payload: CreateProductInput) {
  return request<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
