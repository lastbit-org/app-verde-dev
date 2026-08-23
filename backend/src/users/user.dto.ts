import { Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PASSWORD_MAX, PASSWORD_MIN } from './password';

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(PASSWORD_MIN)
  @MaxLength(PASSWORD_MAX)
  @Matches(PASSWORD_PATTERN, {
    message: 'Password must include a letter and a number',
  })
  password: string;

  @IsOptional()
  @IsString()
  cpf?: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @MinLength(PASSWORD_MIN)
  @MaxLength(PASSWORD_MAX)
  @Matches(PASSWORD_PATTERN, {
    message: 'Password must include a letter and a number',
  })
  newPassword: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpsertAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  street: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  cep: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  number: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  complement?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  city: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}$/)
  uf: string;
}

export class FavoriteProductDto {
  @Type(() => Number)
  @IsInt()
  productId: number;
}
