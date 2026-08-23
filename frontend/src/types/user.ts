import type { UserRole } from '../features/auth/roles'

export type Address = {
  id: number
  street: string
  cep: string
  number: string
  complement: string | null
  city: string
  uf: string
}

export type User = {
  id: number
  name: string
  email: string
  cpf: string | null
  role: UserRole
  addressId: number | null
  address: Address | null
}

export type UpdateUserInput = {
  name: string
  email: string
  cpf: string
}

export type AddressInput = {
  street: string
  cep: string
  number: string
  complement?: string
  city: string
  uf: string
}
