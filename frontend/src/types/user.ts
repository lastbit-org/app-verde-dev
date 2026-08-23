export type User = {
  id: number
  name: string
  email: string
  cpf: string | null
}

export type UpdateUserInput = {
  name: string
  email: string
  cpf: string
}
