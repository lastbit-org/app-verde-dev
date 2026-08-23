import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Product } from '../products/product';
import { ProductsService } from '../products/products.service';
import { FavoriteEntity } from './favorite.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favorites: Repository<FavoriteEntity>,
    private readonly productsService: ProductsService,
  ) {}

  async list(userId: number): Promise<Product[]> {
    const rows = await this.favorites.find({
      where: { userId },
      order: { id: 'ASC' },
    });
    const products: Product[] = [];

    for (const row of rows) {
      try {
        products.push(await this.productsService.findOne(row.productId));
      } catch (error) {
        if (!(error instanceof NotFoundException)) {
          throw error;
        }
      }
    }

    return products;
  }

  async ids(userId: number): Promise<number[]> {
    const rows = await this.favorites.find({
      where: { userId },
      order: { id: 'ASC' },
    });
    return rows.map((row) => row.productId);
  }

  async add(userId: number, productId: number): Promise<Product> {
    const product = await this.productsService.findOne(productId);
    const existing = await this.favorites.findOneBy({ userId, productId });

    if (existing) {
      throw new ConflictException('Product already in favorites');
    }

    await this.favorites.save(this.favorites.create({ userId, productId }));
    return product;
  }

  async remove(userId: number, productId: number): Promise<void> {
    const existing = await this.favorites.findOneBy({ userId, productId });

    if (!existing) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favorites.remove(existing);
  }
}
