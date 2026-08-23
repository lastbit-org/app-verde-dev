import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateUserDto, User } from './user';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const rows = await this.users.find({ order: { id: 'ASC' } });
    return rows.map((row) => this.toUser(row));
  }

  async findOne(id: number): Promise<User> {
    const user = await this.users.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return this.toUser(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.findByEmailRow(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.toUser(user);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const taken = await this.findByEmailRow(dto.email);

    if (taken) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.users.save(
      this.users.create({
        name: dto.name,
        email: dto.email,
      }),
    );

    return this.toUser(user);
  }

  private async findByEmailRow(email: string) {
    const rows = await this.users.find();
    return (
      rows.find((item) => item.email.toLowerCase() === email.toLowerCase()) ??
      null
    );
  }

  private toUser(row: UserEntity): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
    };
  }
}
