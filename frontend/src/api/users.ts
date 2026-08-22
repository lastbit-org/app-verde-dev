import { request } from './client'
import type { User } from '../types/user'

export function getUsers() {
  return request<User[]>('/users')
}

export function getUser(id: number) {
  return request<User>(`/users/${id}`)
}
