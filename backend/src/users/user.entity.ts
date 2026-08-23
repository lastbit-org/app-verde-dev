import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AddressEntity } from '../addresses/address.entity';
import type { UserRole } from './roles';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 72, nullable: true })
  passwordHash: string | null;

  @Column({ type: 'varchar', length: 11, unique: true, nullable: true })
  cpf: string | null;

  @Column({ type: 'varchar', length: 16, default: 'user' })
  role: UserRole;

  @Column({ type: 'int', nullable: true })
  addressId: number | null;

  @OneToOne(() => AddressEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'addressId' })
  address: AddressEntity | null;
}
