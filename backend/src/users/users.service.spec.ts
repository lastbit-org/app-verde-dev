import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService();
  });

  it('lists users', () => {
    expect(service.findAll()).toHaveLength(2);
  });

  it('returns a user by id', () => {
    expect(service.findOne(1)).toEqual({
      id: 1,
      name: 'Ana Silva',
      email: 'ana@example.com',
    });
  });

  it('throws when the user does not exist', () => {
    expect(() => service.findOne(99)).toThrow(NotFoundException);
  });

  it('creates a user', () => {
    const user = service.create({
      name: 'Carla Souza',
      email: 'carla@example.com',
    });

    expect(user).toEqual({
      id: 3,
      name: 'Carla Souza',
      email: 'carla@example.com',
    });
    expect(service.findAll()).toHaveLength(3);
  });

  it('rejects a duplicated email', () => {
    expect(() =>
      service.create({ name: 'Ana', email: 'ana@example.com' }),
    ).toThrow(ConflictException);
  });

  it('logs in by email', () => {
    expect(service.findByEmail('ana@example.com').name).toBe('Ana Silva');
  });

  it('rejects an unknown email', () => {
    expect(() => service.findByEmail('nina.v@example.com')).toThrow(
      UnauthorizedException,
    );
  });
});
