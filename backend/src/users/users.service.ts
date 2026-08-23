import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { assertCpf, formatCpf, normalizeCpf } from './cpf';
import type { CreateUserDto, UpdateUserDto, User } from './user';
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
    return this.toUser(await this.requireUser(id));
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

    const cpf = dto.cpf ? assertCpf(dto.cpf) : null;

    if (cpf && (await this.findByCpfRow(cpf))) {
      throw new ConflictException('CPF already in use');
    }

    const user = await this.users.save(
      this.users.create({
        name: dto.name.trim(),
        email: dto.email.trim(),
        cpf,
      }),
    );

    return this.toUser(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.requireUser(id);
    const email = dto.email.trim();
    const name = dto.name.trim();
    const cpf = assertCpf(dto.cpf);

    if (!name) {
      throw new BadRequestException('Name is required');
    }

    const emailOwner = await this.findByEmailRow(email);
    if (emailOwner && emailOwner.id !== id) {
      throw new ConflictException('Email already in use');
    }

    const cpfOwner = await this.findByCpfRow(cpf);
    if (cpfOwner && cpfOwner.id !== id) {
      throw new ConflictException('CPF already in use');
    }

    user.name = name;
    user.email = email;
    user.cpf = cpf;

    return this.toUser(await this.users.save(user));
  }

  private async requireUser(id: number) {
    const user = await this.users.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  private async findByEmailRow(email: string) {
    const rows = await this.users.find();
    return (
      rows.find((item) => item.email.toLowerCase() === email.toLowerCase()) ??
      null
    );
  }

  private async findByCpfRow(cpf: string) {
    const digits = normalizeCpf(cpf);
    const rows = await this.users.find();
    return rows.find((item) => item.cpf === digits) ?? null;
  }

  private toUser(row: UserEntity): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      cpf: formatCpf(row.cpf),
    };
  }
}
