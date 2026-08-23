import { request } from './client'
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '../types/product'

export function getProducts() {
  return request<Product[]>('/products')
}

export function createProduct(payload: CreateProductInput) {
  return request<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateProduct(id: number, payload: UpdateProductInput) {
  return request<Product>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function applyProductDiscount(id: number, discount: number) {
  return request<Product>(`/products/${id}/discount`, {
    method: 'PATCH',
    body: JSON.stringify({ discount }),
  })
}

export function getProduct(id: number) {
  return request<Product>(`/products/${id}`)
}

export function deleteProduct(id: number) {
  return request<null>(`/products/${id}`, { method: 'DELETE' })
}
