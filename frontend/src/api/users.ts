import { request } from './client'
import type { User } from '../types/user'

export function getUsers() {
  return request<User[]>('/users')
}
