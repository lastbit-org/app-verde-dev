import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('addresses')
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column({ length: 16 })
  cep: string;

  @Column({ length: 16 })
  number: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  complement: string | null;

  @Column()
  city: string;

  @Column({ length: 2 })
  uf: string;
}
