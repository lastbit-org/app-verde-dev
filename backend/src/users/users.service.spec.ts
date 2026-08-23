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
      { id: 1, name: 'Ana Silva', email: 'ana@example.com' },
      { id: 2, name: 'Bruno Costa', email: 'bruno@example.com' },
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
});
