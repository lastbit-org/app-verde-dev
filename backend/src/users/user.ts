import type { UserRole } from './roles';

export type Address = {
  id: number;
  street: string;
  cep: string;
  number: string;
  complement: string | null;
  city: string;
  uf: string;
};

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string | null;
  role: UserRole;
  addressId: number | null;
  address: Address | null;
}
