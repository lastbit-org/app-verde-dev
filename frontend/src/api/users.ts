import { request } from './client'
import type { UpdateUserInput, User } from '../types/user'

export function getUsers() {
  return request<User[]>('/users')
}

export function getUser(id: number) {
  return request<User>(`/users/${id}`)
}

export function updateUser(id: number, payload: UpdateUserInput) {
  return request<User>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
