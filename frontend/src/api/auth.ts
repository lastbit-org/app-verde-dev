import { request } from './client'
import type { User } from '../types/user'

export function signupUser(payload: {
  name: string
  email: string
  password: string
}) {
  return request<User>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function loginUser(payload: { email: string; password: string }) {
  return request<User>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getMe() {
  return request<User>('/auth/me')
}

export function logoutUser() {
  return request<{ ok: true }>('/auth/logout', { method: 'POST' })
}

export function changePassword(payload: {
  currentPassword: string
  newPassword: string
}) {
  return request<{ ok: true }>('/auth/password', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
