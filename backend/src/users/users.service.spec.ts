import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { fakeRepo } from '../testing/fake-repo';
import { UsersService } from './users.service';

jest.mock('./password', () => {
  const actual = jest.requireActual('./password') as typeof import('./password');
  return {
    ...actual,
    hashPassword: jest.fn(async (plain: string) => `hashed:${plain}`),
    verifyPassword: jest.fn(
      async (plain: string, hash: string) => hash === `hashed:${plain}`,
    ),
  };
});

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    const users = fakeRepo([
      {
        id: 1,
        name: 'Ana Silva',
        email: 'ana@example.com',
        cpf: '12345678900',
        passwordHash: 'hashed:verde123',
        role: 'admin',
      },
      {
        id: 2,
        name: 'Bruno Costa',
        email: 'bruno@example.com',
        cpf: null,
        passwordHash: 'hashed:verde123',
        role: 'partner',
      },
    ]);
    service = new UsersService(users as never, fakeRepo([]) as never);
  });

  it('lists users', async () => {
    expect(await service.findAll()).toHaveLength(2);
  });

  it('returns a user by id', async () => {
    expect(await service.findOne(1)).toEqual({
      id: 1,
      name: 'Ana Silva',
      email: 'ana@example.com',
      cpf: '123.456.789-00',
      role: 'admin',
      addressId: null,
      address: null,
    });
  });

  it('throws when the user does not exist', async () => {
    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a user', async () => {
    const user = await service.create({
      name: 'Carla Souza',
      email: 'carla@example.com',
      password: 'secret12',
    });

    expect(user).toEqual({
      id: 3,
      name: 'Carla Souza',
      email: 'carla@example.com',
      cpf: null,
      role: 'user',
      addressId: null,
      address: null,
    });
    expect(await service.findAll()).toHaveLength(3);
  });

  it('rejects a duplicated email', async () => {
    await expect(
      service.create({
        name: 'Ana',
        email: 'ana@example.com',
        password: 'secret12',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in with email and password', async () => {
    expect(
      (await service.validateUser('ana@example.com', 'verde123')).name,
    ).toBe('Ana Silva');
  });

  it('rejects an unknown email', async () => {
    await expect(
      service.validateUser('nina.v@example.com', 'verde123'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a wrong password', async () => {
    await expect(
      service.validateUser('ana@example.com', 'wrong-password'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('updates name, email and cpf', async () => {
    const user = await service.update(1, {
      name: 'Ana Lima',
      email: 'ana.lima@example.com',
      cpf: '987.654.321-00',
    });

    expect(user).toEqual({
      id: 1,
      name: 'Ana Lima',
      email: 'ana.lima@example.com',
      cpf: '987.654.321-00',
      role: 'admin',
      addressId: null,
      address: null,
    });
  });

  it('rejects an email already used by another account', async () => {
    await expect(
      service.update(1, {
        name: 'Ana Silva',
        email: 'bruno@example.com',
        cpf: '123.456.789-00',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('changes the password', async () => {
    await service.changePassword(1, 'verde123', 'nova4567');
    await expect(
      service.validateUser('ana@example.com', 'verde123'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(
      (await service.validateUser('ana@example.com', 'nova4567')).id,
    ).toBe(1);
  });

  it('rejects the same password', async () => {
    await expect(
      service.changePassword(1, 'verde123', 'verde123'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
