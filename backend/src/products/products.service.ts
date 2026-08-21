import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateProductDto, Product } from './product';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Oliveira em vaso sage',
      price: 248,
      image: {
        url: 'https://picsum.photos/seed/oliveira/600/800',
        name: 'oliveira-vaso-sage.jpg',
      },
    },
    {
      id: 2,
      name: 'Vaso de cerâmica artesanal',
      price: 186,
      image: {
        url: 'https://picsum.photos/seed/vaso/600/800',
        name: 'vaso-ceramica.jpg',
      },
    },
    {
      id: 3,
      name: 'Kit de cuidados',
      price: 92,
      image: {
        url: 'https://picsum.photos/seed/cuidados/600/800',
        name: 'kit-cuidados.jpg',
      },
    },
    {
      id: 4,
      name: 'Planta de interior',
      price: 164,
      image: {
        url: 'https://picsum.photos/seed/planta/600/800',
        name: 'planta-interior.jpg',
      },
    },
    {
      id: 5,
      name: 'Composição sobre linho',
      price: 210,
      image: {
        url: 'https://picsum.photos/seed/linho/600/800',
        name: 'composicao-linho.jpg',
      },
    },
  ];

  private nextId = 6;

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((item) => item.id === id);

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  create(dto: CreateProductDto): Product {
    const product: Product = {
      id: this.nextId++,
      name: dto.name,
      price: dto.price,
      image: dto.image,
    };

    this.products.push(product);
    return product;
  }
}
