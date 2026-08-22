import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(() => {
    service = new OrdersService();
  });

  it('lists orders with items', () => {
    const orders = service.findAllOrders();

    expect(orders).toHaveLength(3);
    expect(orders[0].orderId).toBe('VER-1042');
    expect(orders[0].items).toHaveLength(2);
    expect(orders[0].totalPrice).toBe(432);
  });

  it('returns an order by id', () => {
    const order = service.findOneOrder(2);

    expect(order.orderId).toBe('VER-1108');
    expect(order.items[0].name).toBe('Vaso de cerâmica artesanal');
  });

  it('throws when the order does not exist', () => {
    expect(() => service.findOneOrder(99)).toThrow(NotFoundException);
  });

  it('creates an order with items and a generated orderId', () => {
    const order = service.createOrder({
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

  it('updates order status', () => {
    expect(service.updateOrder(3, { status: 'em trânsito' }).status).toBe(
      'em trânsito',
    );
  });

  it('rejects an invalid status', () => {
    expect(() =>
      service.updateOrder(1, { status: 'lost' as 'preparando' }),
    ).toThrow(BadRequestException);
  });

  it('lists items for an order', () => {
    expect(service.findAllItems(1)).toHaveLength(2);
  });

  it('creates an item and refreshes the order total', () => {
    const item = service.createItem({
      orderId: 2,
      productId: 3,
      name: 'Kit de cuidados',
      price: 92,
      quantity: 1,
    });

    expect(item.id).toBe(5);
    expect(service.findOneOrder(2).totalPrice).toBe(278);
  });

  it('throws when creating an item for a missing order', () => {
    expect(() =>
      service.createItem({
        orderId: 99,
        productId: 1,
        name: 'Oliveira em vaso sage',
        price: 248,
        quantity: 1,
      }),
    ).toThrow(NotFoundException);
  });

  it('applies a line discount', () => {
    const item = service.applyItemDiscount(3, 50);

    expect(item.discount).toBe(50);
    expect(service.findOneOrder(2).totalPrice).toBe(93);
  });

  it('rejects an invalid quantity', () => {
    expect(() => service.updateItem(1, { quantity: 0 })).toThrow(
      BadRequestException,
    );
  });
});
