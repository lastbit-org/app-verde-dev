import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { numericTransformer } from '../database/transformers';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  price: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ type: 'int', default: 12 })
  stock: number;

  @Column()
  imageUrl: string;

  @Column()
  imageName: string;
}
