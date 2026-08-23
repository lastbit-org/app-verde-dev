import type { UserRole } from '../features/auth/roles'

export type User = {
  id: number
  name: string
  email: string
  cpf: string | null
  role: UserRole
}

export type UpdateUserInput = {
  name: string
  email: string
  cpf: string
}
