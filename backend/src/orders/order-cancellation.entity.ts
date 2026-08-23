import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order_cancellations')
export class OrderCancellationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderId: number;

  @Column()
  userId: number;

  @Column({ length: 80 })
  reason: string;

  @Column({ type: 'varchar', length: 400, nullable: true })
  details: string | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
