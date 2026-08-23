import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericTransformer, dateTransformer } from '../database/transformers';
import { OrderItemEntity } from './order-item.entity';
import type { OrderStatus } from './order';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderId: string;

  @Column()
  userId: number;

  @Column()
  payment: string;

  @Column({ type: 'varchar', length: 32 })
  status: OrderStatus;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  totalPrice: number;

  @Column({ type: 'date', transformer: dateTransformer })
  createdAt: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  cancelReason: string | null;

  @Column({ type: 'varchar', length: 400, nullable: true })
  cancelDetails: string | null;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items: OrderItemEntity[];
}
