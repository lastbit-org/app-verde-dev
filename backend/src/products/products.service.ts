import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateProductDto, Product } from './product';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly products: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const rows = await this.products.find({ order: { id: 'ASC' } });
    return rows.map((row) => this.toProduct(row));
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.products.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return this.toProduct(product);
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = await this.products.save(
      this.products.create({
        name: dto.name,
        price: dto.price,
        discount: 0,
        imageUrl: dto.image.url,
        imageName: dto.image.name,
      }),
    );

    return this.toProduct(product);
  }

  async applyDiscount(id: number, discount: number): Promise<Product> {
    if (Number.isNaN(discount) || discount < 0 || discount > 100) {
      throw new BadRequestException('Discount must be between 0 and 100');
    }

    const product = await this.products.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    product.discount = discount;
    return this.toProduct(await this.products.save(product));
  }

  async remove(id: number): Promise<void> {
    const product = await this.products.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    await this.products.remove(product);
  }

  private toProduct(row: ProductEntity): Product {
    return {
      id: row.id,
      name: row.name,
      price: row.price,
      discount: row.discount,
      image: {
        url: row.imageUrl,
        name: row.imageName,
      },
    };
  }
}
