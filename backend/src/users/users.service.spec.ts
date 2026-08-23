import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { fakeRepo } from '../testing/fake-repo';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    const users = fakeRepo([
      { id: 1, name: 'Ana Silva', email: 'ana@example.com', cpf: '12345678900' },
      { id: 2, name: 'Bruno Costa', email: 'bruno@example.com', cpf: null },
    ]);
    service = new UsersService(users as never);
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
    });
  });

  it('throws when the user does not exist', async () => {
    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a user', async () => {
    const user = await service.create({
      name: 'Carla Souza',
      email: 'carla@example.com',
    });

    expect(user).toEqual({
      id: 3,
      name: 'Carla Souza',
      email: 'carla@example.com',
      cpf: null,
    });
    expect(await service.findAll()).toHaveLength(3);
  });

  it('rejects a duplicated email', async () => {
    await expect(
      service.create({ name: 'Ana', email: 'ana@example.com' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in by email', async () => {
    expect((await service.findByEmail('ana@example.com')).name).toBe(
      'Ana Silva',
    );
  });

  it('rejects an unknown email', async () => {
    await expect(service.findByEmail('nina.v@example.com')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
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
});
