import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateUserDto, User } from './user';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'Ana Silva', email: 'ana@example.com' },
    { id: 2, name: 'Bruno Costa', email: 'bruno@example.com' },
  ];

  private nextId = 3;

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((item) => item.id === id);

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  create(dto: CreateUserDto): User {
    const user: User = {
      id: this.nextId++,
      name: dto.name,
      email: dto.email,
    };

    this.users.push(user);
    return user;
  }
}
