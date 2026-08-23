import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateProductDto, Product, UpdateProductDto } from './product';
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
    const image = this.requireImage(dto.image);
    const product = await this.products.save(
      this.products.create({
        name: this.requireName(dto.name),
        price: this.requirePrice(dto.price),
        discount:
          dto.discount === undefined ? 0 : this.requireDiscount(dto.discount),
        stock: dto.stock === undefined ? 12 : this.requireStock(dto.stock),
        imageUrl: image.url,
        imageName: image.name,
      }),
    );

    return this.toProduct(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.products.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    if (dto.name !== undefined) {
      product.name = this.requireName(dto.name);
    }

    if (dto.price !== undefined) {
      product.price = this.requirePrice(dto.price);
    }

    if (dto.image !== undefined) {
      const image = this.requireImage(dto.image);
      product.imageUrl = image.url;
      product.imageName = image.name;
    }

    if (dto.discount !== undefined) {
      product.discount = this.requireDiscount(dto.discount);
    }

    if (dto.stock !== undefined) {
      product.stock = this.requireStock(dto.stock);
    }

    return this.toProduct(await this.products.save(product));
  }

  async applyDiscount(id: number, discount: number): Promise<Product> {
    return this.update(id, { discount });
  }

  async remove(id: number): Promise<void> {
    const product = await this.products.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    await this.products.remove(product);
  }

  private requireName(name: string) {
    if (typeof name !== 'string' || !name.trim()) {
      throw new BadRequestException('Name is required');
    }

    return name.trim();
  }

  private requirePrice(price: number) {
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      throw new BadRequestException(
        'Price must be a number greater than or equal to 0',
      );
    }

    return price;
  }

  private requireDiscount(discount: number) {
    if (Number.isNaN(discount) || discount < 0 || discount > 100) {
      throw new BadRequestException('Discount must be between 0 and 100');
    }

    return discount;
  }

  private requireStock(stock: number) {
    if (!Number.isInteger(stock) || stock < 0) {
      throw new BadRequestException(
        'Stock must be an integer greater than or equal to 0',
      );
    }

    return stock;
  }

  private requireImage(image: { url: string; name: string }) {
    const url = image?.url?.trim() ?? '';
    const name = image?.name?.trim() ?? '';

    if (!url || !name) {
      throw new BadRequestException('Image url and name are required');
    }

    return { url, name };
  }

  private toProduct(row: ProductEntity): Product {
    return {
      id: row.id,
      name: row.name,
      price: row.price,
      discount: row.discount,
      stock: row.stock,
      image: {
        url: row.imageUrl,
        name: row.imageName,
      },
    };
  }
}
