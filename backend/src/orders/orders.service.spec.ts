import { BadRequestException, NotFoundException } from '@nestjs/common';
import { fakeRepo } from '../testing/fake-repo';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

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
    service = new OrdersService(orders as never, items as never);
  });

  it('lists orders with items', async () => {
    const orders = await service.findAllOrders();

    expect(orders).toHaveLength(3);
    expect(orders[0].orderId).toBe('VER-1042');
    expect(orders[0].items).toHaveLength(2);
    expect(orders[0].totalPrice).toBe(432);
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

  it('creates an order with items and a generated orderId', async () => {
    const order = await service.createOrder({
      userId: 1,
      payment: 'Pix',
      createdAt: '2026-08-22',
      items: [
        {
          productId: 1,
          name: 'Oliveira em vaso sage',
          price: 248,
          quantity: 1,
          discount: 10,
        },
      ],
    });

    expect(order.id).toBe(4);
    expect(order.orderId).toBe('VER-1121');
    expect(order.status).toBe('preparando');
    expect(order.totalPrice).toBe(223.2);
    expect(order.items).toHaveLength(1);
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

  it('lists items for an order', async () => {
    expect(await service.findAllItems(1)).toHaveLength(2);
  });

  it('creates an item and refreshes the order total', async () => {
    const item = await service.createItem({
      orderId: 2,
      productId: 3,
      name: 'Kit de cuidados',
      price: 92,
      quantity: 1,
    });

    expect(item.id).toBe(5);
    expect((await service.findOneOrder(2)).totalPrice).toBe(278);
  });

  it('throws when creating an item for a missing order', async () => {
    await expect(
      service.createItem({
        orderId: 99,
        productId: 1,
        name: 'Oliveira em vaso sage',
        price: 248,
        quantity: 1,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('applies a line discount', async () => {
    const item = await service.applyItemDiscount(3, 50);

    expect(item.discount).toBe(50);
    expect((await service.findOneOrder(2)).totalPrice).toBe(93);
  });

  it('rejects an invalid quantity', async () => {
    await expect(service.updateItem(1, { quantity: 0 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
