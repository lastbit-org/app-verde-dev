import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
