import * as bcrypt from 'bcrypt';

const ROUNDS = 10;

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

export function isStrongPassword(password: string) {
  return (
    typeof password === 'string' &&
    password.length >= PASSWORD_MIN &&
    password.length <= PASSWORD_MAX &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  );
}

export function hashPassword(plain: string) {
  return bcrypt.hash(plain, ROUNDS);
}

export function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
