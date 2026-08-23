import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { fakeRepo } from '../testing/fake-repo';
import type { User } from '../users/user';
import { OrdersService } from './orders.service';

const ana: User = {
  id: 1,
  name: 'Ana Silva',
  email: 'ana@example.com',
  cpf: null,
  role: 'admin',
};

const bruno: User = {
  id: 2,
  name: 'Bruno Costa',
  email: 'bruno@example.com',
  cpf: null,
  role: 'partner',
};

describe('OrdersService', () => {
  let service: OrdersService;
  let products: ReturnType<typeof fakeRepo>;

  beforeEach(() => {
    const orders = fakeRepo([
      {
        id: 1,
        orderId: 'VER-1042',
        userId: 1,
        payment: 'Pix',
        status: 'entregue',
        totalPrice: 432,
        createdAt: '2026-08-12',
      },
      {
        id: 2,
        orderId: 'VER-1108',
        userId: 1,
        payment: 'Cartão de crédito',
        status: 'em trânsito',
        totalPrice: 186,
        createdAt: '2026-08-18',
      },
      {
        id: 3,
        orderId: 'VER-1120',
        userId: 2,
        payment: 'Boleto',
        status: 'preparando',
        totalPrice: 164,
        createdAt: '2026-08-21',
      },
    ]);
    const items = fakeRepo([
      {
        id: 1,
        orderId: 1,
        productId: 1,
        name: 'Oliveira em vaso sage',
        price: 248,
        quantity: 1,
        discount: 0,
      },
      {
        id: 2,
        orderId: 1,
        productId: 3,
        name: 'Kit de cuidados',
        price: 92,
        quantity: 2,
        discount: 0,
      },
      {
        id: 3,
        orderId: 2,
        productId: 2,
        name: 'Vaso de cerâmica artesanal',
        price: 186,
        quantity: 1,
        discount: 0,
      },
      {
        id: 4,
        orderId: 3,
        productId: 4,
        name: 'Planta de interior',
        price: 164,
        quantity: 1,
        discount: 0,
      },
    ]);
    products = fakeRepo([
      {
        id: 1,
        name: 'Oliveira em vaso sage',
        price: 248,
        discount: 0,
        stock: 12,
        imageUrl: 'https://picsum.photos/seed/oliveira/600/800',
        imageName: 'oliveira-vaso-sage.jpg',
      },
      {
        id: 2,
        name: 'Vaso de cerâmica artesanal',
        price: 186,
        discount: 0,
        stock: 8,
        imageUrl: 'https://picsum.photos/seed/vaso/600/800',
        imageName: 'vaso-ceramica.jpg',
      },
      {
        id: 3,
        name: 'Kit de cuidados',
        price: 92,
        discount: 10,
        stock: 24,
        imageUrl: 'https://picsum.photos/seed/cuidados/600/800',
        imageName: 'kit-cuidados.jpg',
      },
      {
        id: 4,
        name: 'Planta de interior',
        price: 164,
        discount: 0,
        stock: 6,
        imageUrl: 'https://picsum.photos/seed/planta/600/800',
        imageName: 'planta-interior.jpg',
      },
    ]);
    service = new OrdersService(
      orders as never,
      items as never,
      products as never,
    );
  });

  it('lists orders with items', async () => {
    const orders = await service.findAllOrders();

    expect(orders).toHaveLength(3);
    expect(orders[0].orderId).toBe('VER-1042');
    expect(orders[0].items).toHaveLength(2);
    expect(orders[0].totalPrice).toBe(432);
  });

  it('lists orders for a single user', async () => {
    const orders = await service.findAllOrders(1);
    expect(orders).toHaveLength(2);
    expect(orders.every((order) => order.userId === 1)).toBe(true);
  });

  it('returns an order by id', async () => {
    const order = await service.findOneOrder(2);

    expect(order.orderId).toBe('VER-1108');
    expect(order.items[0].name).toBe('Vaso de cerâmica artesanal');
  });

  it('throws when the order does not exist', async () => {
    await expect(service.findOneOrder(99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('blocks a customer from another order', async () => {
    await expect(service.requireOrderAccess(1, bruno)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('lets an admin read another customer order', async () => {
    const order = await service.requireOrderAccess(3, ana);
    expect(order.userId).toBe(2);
  });

  it('creates an order with catalog price and generated orderId', async () => {
    const order = await service.createOrder(1, {
      payment: 'Pix',
      createdAt: '2026-08-22',
      items: [{ productId: 1, quantity: 1 }],
    });

    expect(order.id).toBe(4);
    expect(order.orderId).toBe('VER-1121');
    expect(order.status).toBe('preparando');
    expect(order.totalPrice).toBe(248);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].price).toBe(248);
    expect(order.items[0].name).toBe('Oliveira em vaso sage');
    expect(products.rows.find((row) => row.id === 1)?.stock).toBe(11);
  });

  it('uses the product discount instead of a client price', async () => {
    const order = await service.createOrder(1, {
      payment: 'Pix',
      items: [{ productId: 3, quantity: 1 }],
    });

    expect(order.items[0].price).toBe(92);
    expect(order.items[0].discount).toBe(10);
    expect(order.totalPrice).toBe(82.8);
  });

  it('rejects an order when stock is insufficient', async () => {
    await expect(
      service.createOrder(1, {
        payment: 'Pix',
        items: [{ productId: 4, quantity: 9 }],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(await service.findAllOrders()).toHaveLength(3);
    expect(products.rows.find((row) => row.id === 4)?.stock).toBe(6);
  });

  it('updates order status', async () => {
    expect((await service.updateOrder(3, { status: 'em trânsito' })).status).toBe(
      'em trânsito',
    );
  });

  it('rejects an invalid status', async () => {
    await expect(
      service.updateOrder(1, { status: 'lost' as 'preparando' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lists items for an owned order', async () => {
    expect(await service.findAllItems(1, ana)).toHaveLength(2);
  });

  it('blocks listing items from another customer order', async () => {
    await expect(service.findAllItems(1, bruno)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('creates an item from catalog data and refreshes the order total', async () => {
    const item = await service.createItem(
      { orderId: 2, productId: 3, quantity: 1 },
      ana,
    );

    expect(item.id).toBe(5);
    expect(item.price).toBe(92);
    expect(item.discount).toBe(10);
    expect((await service.findOneOrder(2)).totalPrice).toBe(268.8);
    expect(products.rows.find((row) => row.id === 3)?.stock).toBe(23);
  });

  it('throws when creating an item for a missing order', async () => {
    await expect(
      service.createItem({ orderId: 99, productId: 1, quantity: 1 }, ana),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('applies a line discount', async () => {
    const item = await service.applyItemDiscount(3, 50, ana);

    expect(item.discount).toBe(50);
    expect((await service.findOneOrder(2)).totalPrice).toBe(93);
  });

  it('rejects an invalid quantity', async () => {
    await expect(
      service.updateItem(1, { quantity: 0 }, ana),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
