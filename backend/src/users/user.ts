export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string | null;
}

export interface CreateUserDto {
  name: string;
  email: string;
  cpf?: string;
}

export interface UpdateUserDto {
  name: string;
  email: string;
  cpf: string;
}

export interface LoginDto {
  email: string;
}
