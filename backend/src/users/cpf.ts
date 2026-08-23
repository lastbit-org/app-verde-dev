import { BadRequestException } from '@nestjs/common';

export function normalizeCpf(value: string) {
  return value.replace(/\D/g, '');
}

export function assertCpf(value: string) {
  const digits = normalizeCpf(value);

  if (digits.length !== 11) {
    throw new BadRequestException('CPF must have 11 digits');
  }

  return digits;
}

export function formatCpf(digits: string | null) {
  if (!digits) {
    return null;
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
