import { request } from './client'
import type { User } from '../types/user'

export function signupUser(payload: { name: string; email: string }) {
  return request<User>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function loginUser(payload: { email: string }) {
  return request<User>('/users/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
