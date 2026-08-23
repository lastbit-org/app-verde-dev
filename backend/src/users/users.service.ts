import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from '../addresses/address.entity';
import { assertCpf, formatCpf, normalizeCpf } from './cpf';
import {
  hashPassword,
  isStrongPassword,
  verifyPassword,
} from './password';
import type { Address, User } from './user';
import type { CreateUserDto, UpdateUserDto, UpsertAddressDto } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(AddressEntity)
    private readonly addresses: Repository<AddressEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const rows = await this.users.find({ order: { id: 'ASC' } });
    return rows.map((row) => this.toUser(row));
  }

  async findOne(id: number): Promise<User> {
    return this.toUser(await this.requireUser(id));
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmailRow(email);

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matches = await verifyPassword(password, user.passwordHash);

    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.toUser(user);
  }

  async create(dto: CreateUserDto): Promise<User> {
    const password = this.requirePassword(dto.password);
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
        passwordHash: await hashPassword(password),
        cpf,
        role: 'user',
        addressId: null,
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

  async upsertAddress(id: number, dto: UpsertAddressDto): Promise<User> {
    const user = await this.requireUser(id);
    const payload = {
      street: dto.street.trim(),
      cep: dto.cep.trim(),
      number: dto.number.trim(),
      complement: dto.complement?.trim() ? dto.complement.trim() : null,
      city: dto.city.trim(),
      uf: dto.uf.trim().toUpperCase(),
    };

    if (user.addressId) {
      const address = await this.addresses.findOneBy({ id: user.addressId });
      if (address) {
        Object.assign(address, payload);
        user.address = await this.addresses.save(address);
        return this.toUser(user);
      }
    }

    const address = await this.addresses.save(this.addresses.create(payload));
    user.addressId = address.id;
    user.address = address;
    return this.toUser(await this.users.save(user));
  }

  async changePassword(
    id: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.requireUser(id);
    const next = this.requirePassword(newPassword);

    if (!user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matches = await verifyPassword(currentPassword, user.passwordHash);

    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.passwordHash = await hashPassword(next);
    await this.users.save(user);
  }

  private requirePassword(password: string) {
    if (!isStrongPassword(password)) {
      throw new BadRequestException(
        'Password must be 8–72 characters and include a letter and a number',
      );
    }

    return password;
  }

  private async requireUser(id: number) {
    const user = await this.users.findOne({
      where: { id },
      relations: { address: true },
    });

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

  private toAddress(row: AddressEntity): Address {
    return {
      id: row.id,
      street: row.street,
      cep: row.cep,
      number: row.number,
      complement: row.complement,
      city: row.city,
      uf: row.uf,
    };
  }

  private toUser(row: UserEntity): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      cpf: formatCpf(row.cpf),
      role: row.role ?? 'user',
      addressId: row.addressId ?? null,
      address: row.address ? this.toAddress(row.address) : null,
    };
  }
}
