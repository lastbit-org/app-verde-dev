import { BadRequestException, NotFoundException } from '@nestjs/common';
import { fakeRepo } from '../testing/fake-repo';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    const products = fakeRepo([
      {
        id: 1,
        name: 'Oliveira em vaso sage',
        price: 248,
        discount: 0,
        imageUrl: 'https://picsum.photos/seed/oliveira/600/800',
        imageName: 'oliveira-vaso-sage.jpg',
      },
      {
        id: 2,
        name: 'Vaso de cerâmica artesanal',
        price: 186,
        discount: 0,
        imageUrl: 'https://picsum.photos/seed/vaso/600/800',
        imageName: 'vaso-ceramica.jpg',
      },
      {
        id: 3,
        name: 'Kit de cuidados',
        price: 92,
        discount: 0,
        imageUrl: 'https://picsum.photos/seed/cuidados/600/800',
        imageName: 'kit-cuidados.jpg',
      },
      {
        id: 4,
        name: 'Planta de interior',
        price: 164,
        discount: 0,
        imageUrl: 'https://picsum.photos/seed/planta/600/800',
        imageName: 'planta-interior.jpg',
      },
      {
        id: 5,
        name: 'Composição sobre linho',
        price: 210,
        discount: 0,
        imageUrl: 'https://picsum.photos/seed/linho/600/800',
        imageName: 'composicao-linho.jpg',
      },
    ]);
    service = new ProductsService(products as never);
  });

  it('lists products', async () => {
    expect(await service.findAll()).toHaveLength(5);
  });

  it('returns a product by id', async () => {
    expect(await service.findOne(1)).toEqual({
      id: 1,
      name: 'Oliveira em vaso sage',
      price: 248,
      discount: 0,
      image: {
        url: 'https://picsum.photos/seed/oliveira/600/800',
        name: 'oliveira-vaso-sage.jpg',
      },
    });
  });

  it('throws when the product does not exist', async () => {
    await expect(service.findOne(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a product', async () => {
    const product = await service.create({
      name: 'Ramo seco',
      price: 48,
      image: {
        url: 'https://picsum.photos/seed/ramo/600/800',
        name: 'ramo-seco.jpg',
      },
    });

    expect(product.id).toBe(6);
    expect(product.name).toBe('Ramo seco');
    expect(product.discount).toBe(0);
    expect(await service.findAll()).toHaveLength(6);
  });

  it('applies a discount', async () => {
    expect((await service.applyDiscount(1, 10)).discount).toBe(10);
  });

  it('rejects an invalid discount', async () => {
    await expect(service.applyDiscount(1, 150)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
