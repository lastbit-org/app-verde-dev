import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CreateOrderDto,
  Order,
  OrderStatus,
  OrderWithItems,
  UpdateOrderDto,
} from './order';
import type {
  CreateOrderItemDto,
  OrderItem,
  UpdateOrderItemDto,
} from './order-item';

const STATUSES: OrderStatus[] = [
  'preparando',
  'em trânsito',
  'entregue',
  'cancelado',
];

@Injectable()
export class OrdersService {
  private orders: Order[] = [
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
  ];

  private items: OrderItem[] = [
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
  ];

  private nextOrderId = 4;
  private nextItemId = 5;
  private nextOrderCode = 1121;

  findAllOrders(): OrderWithItems[] {
    return this.orders.map((order) => this.withItems(order));
  }

  findOneOrder(id: number): OrderWithItems {
    const order = this.orders.find((item) => item.id === id);

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return this.withItems(order);
  }

  createOrder(dto: CreateOrderDto): OrderWithItems {
    const order: Order = {
      id: this.nextOrderId++,
      orderId: `VER-${this.nextOrderCode++}`,
      userId: dto.userId,
      payment: dto.payment,
      status: 'preparando',
      totalPrice: 0,
      createdAt: dto.createdAt ?? new Date().toISOString().slice(0, 10),
    };

    this.orders.push(order);

    for (const line of dto.items ?? []) {
      this.addItem({ ...line, orderId: order.id });
    }

    return this.findOneOrder(order.id);
  }

  updateOrder(id: number, dto: UpdateOrderDto): OrderWithItems {
    const order = this.findOneOrder(id);

    if (dto.status !== undefined) {
      if (!STATUSES.includes(dto.status)) {
        throw new BadRequestException('Invalid order status');
      }
      this.patchOrder(id, { status: dto.status });
    }

    if (dto.payment !== undefined) {
      if (!dto.payment.trim()) {
        throw new BadRequestException('Payment is required');
      }
      this.patchOrder(id, { payment: dto.payment });
    }

    return this.findOneOrder(order.id);
  }

  findAllItems(orderId?: number): OrderItem[] {
    if (orderId === undefined) {
      return this.items;
    }

    this.findOneOrder(orderId);
    return this.items.filter((item) => item.orderId === orderId);
  }

  findOneItem(id: number): OrderItem {
    const item = this.items.find((entry) => entry.id === id);

    if (!item) {
      throw new NotFoundException(`Order item ${id} not found`);
    }

    return item;
  }

  createItem(dto: CreateOrderItemDto): OrderItem {
    return this.addItem(dto);
  }

  updateItem(id: number, dto: UpdateOrderItemDto): OrderItem {
    const item = this.findOneItem(id);

    if (dto.price !== undefined) {
      item.price = this.requirePrice(dto.price);
    }

    if (dto.quantity !== undefined) {
      item.quantity = this.requireQuantity(dto.quantity);
    }

    if (dto.discount !== undefined) {
      item.discount = this.requireDiscount(dto.discount);
    }

    this.refreshTotal(item.orderId);
    return item;
  }

  applyItemDiscount(id: number, discount: number): OrderItem {
    return this.updateItem(id, { discount });
  }

  private addItem(dto: CreateOrderItemDto): OrderItem {
    this.findOneOrder(dto.orderId);

    const item: OrderItem = {
      id: this.nextItemId++,
      orderId: dto.orderId,
      productId: dto.productId,
      name: dto.name,
      price: this.requirePrice(dto.price),
      quantity: this.requireQuantity(dto.quantity),
      discount: this.requireDiscount(dto.discount ?? 0),
    };

    this.items.push(item);
    this.refreshTotal(item.orderId);
    return item;
  }

  private withItems(order: Order): OrderWithItems {
    return {
      ...order,
      items: this.items.filter((item) => item.orderId === order.id),
    };
  }

  private patchOrder(id: number, patch: Partial<Order>) {
    const order = this.orders.find((item) => item.id === id);

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    Object.assign(order, patch);
  }

  private refreshTotal(orderId: number) {
    const totalPrice = this.items
      .filter((item) => item.orderId === orderId)
      .reduce((sum, item) => sum + this.lineTotal(item), 0);

    this.patchOrder(orderId, { totalPrice: Number(totalPrice.toFixed(2)) });
  }

  private lineTotal(item: OrderItem) {
    return item.price * item.quantity * (1 - item.discount / 100);
  }

  private requirePrice(price: number) {
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      throw new BadRequestException('Price must be a number greater than or equal to 0');
    }

    return price;
  }

  private requireQuantity(quantity: number) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new BadRequestException('Quantity must be an integer greater than 0');
    }

    return quantity;
  }

  private requireDiscount(discount: number) {
    if (Number.isNaN(discount) || discount < 0 || discount > 100) {
      throw new BadRequestException('Discount must be between 0 and 100');
    }

    return discount;
  }
}
