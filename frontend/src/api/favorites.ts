import { request } from './client'
import type { Product } from '../types/product'

export function getFavorites() {
  return request<Product[]>('/favorites')
}

export function getFavoriteIds() {
  return request<number[]>('/favorites/ids')
}

export function addFavorite(productId: number) {
  return request<Product>('/favorites', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  })
}

export function removeFavorite(productId: number) {
  return request<null>(`/favorites/${productId}`, { method: 'DELETE' })
}
