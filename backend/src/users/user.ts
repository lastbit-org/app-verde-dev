export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string | null;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  cpf?: string;
}

export interface UpdateUserDto {
  name: string;
  email: string;
  cpf: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
