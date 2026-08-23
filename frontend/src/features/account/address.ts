import type { Address } from '../../types/user'

export function formatAddress(address: Address) {
  const complement = address.complement ? ` — ${address.complement}` : ''
  return `${address.street}, ${address.number}${complement}. ${address.city}/${address.uf}. CEP ${address.cep}`
}
