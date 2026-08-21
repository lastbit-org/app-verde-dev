import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    service = new ProductsService();
  });

  it('lists products', () => {
    expect(service.findAll()).toHaveLength(5);
  });

  it('returns a product by id', () => {
    expect(service.findOne(1)).toEqual({
      id: 1,
      name: 'Oliveira em vaso sage',
      price: 248,
      image: {
        url: 'https://picsum.photos/seed/oliveira/600/800',
        name: 'oliveira-vaso-sage.jpg',
      },
    });
  });

  it('throws when the product does not exist', () => {
    expect(() => service.findOne(99)).toThrow(NotFoundException);
  });

  it('creates a product', () => {
    const product = service.create({
      name: 'Ramo seco',
      price: 48,
      image: {
        url: 'https://picsum.photos/seed/ramo/600/800',
        name: 'ramo-seco.jpg',
      },
    });

    expect(product.id).toBe(6);
    expect(product.name).toBe('Ramo seco');
    expect(service.findAll()).toHaveLength(6);
  });
});
