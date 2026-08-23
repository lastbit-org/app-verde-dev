import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { OrderItemEntity } from './order-item.entity';
import { OrderEntity } from './order.entity';

const STATUSES: OrderStatus[] = [
  'preparando',
  'em trânsito',
  'entregue',
  'cancelado',
];

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orders: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly items: Repository<OrderItemEntity>,
  ) {}

  async findAllOrders(userId?: number): Promise<OrderWithItems[]> {
    const rows = await this.orders.find({
      ...(userId === undefined ? {} : { where: { userId } }),
      order: { id: 'ASC' },
    });
    return Promise.all(rows.map((row) => this.withItems(row)));
  }

  async requireOwnedOrder(id: number, userId: number): Promise<OrderWithItems> {
    const order = await this.findOneOrder(id);

    if (order.userId !== userId) {
      throw new ForbiddenException();
    }

    return order;
  }

  async findOneOrder(id: number): Promise<OrderWithItems> {
    const order = await this.orders.findOneBy({ id });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return this.withItems(order);
  }

  async createOrder(dto: CreateOrderDto): Promise<OrderWithItems> {
    const order = await this.orders.save(
      this.orders.create({
        orderId: await this.nextOrderCode(),
        userId: dto.userId,
        payment: dto.payment,
        status: 'preparando',
        totalPrice: 0,
        createdAt: dto.createdAt ?? new Date().toISOString().slice(0, 10),
      }),
    );

    for (const line of dto.items ?? []) {
      await this.addItem({ ...line, orderId: order.id });
    }

    return this.findOneOrder(order.id);
  }

  async updateOrder(id: number, dto: UpdateOrderDto): Promise<OrderWithItems> {
    const order = await this.orders.findOneBy({ id });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    if (dto.status !== undefined) {
      if (!STATUSES.includes(dto.status)) {
        throw new BadRequestException('Invalid order status');
      }
      order.status = dto.status;
    }

    if (dto.payment !== undefined) {
      if (!dto.payment.trim()) {
        throw new BadRequestException('Payment is required');
      }
      order.payment = dto.payment;
    }

    await this.orders.save(order);
    return this.findOneOrder(id);
  }

  async findAllItems(orderId?: number): Promise<OrderItem[]> {
    if (orderId === undefined) {
      const rows = await this.items.find({ order: { id: 'ASC' } });
      return rows.map((row) => this.toItem(row));
    }

    await this.findOneOrder(orderId);
    const rows = await this.items.find({
      where: { orderId },
      order: { id: 'ASC' },
    });
    return rows.map((row) => this.toItem(row));
  }

  async findOneItem(id: number): Promise<OrderItem> {
    const item = await this.items.findOneBy({ id });

    if (!item) {
      throw new NotFoundException(`Order item ${id} not found`);
    }

    return this.toItem(item);
  }

  async createItem(dto: CreateOrderItemDto): Promise<OrderItem> {
    return this.addItem(dto);
  }

  async updateItem(id: number, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const item = await this.items.findOneBy({ id });

    if (!item) {
      throw new NotFoundException(`Order item ${id} not found`);
    }

    if (dto.price !== undefined) {
      item.price = this.requirePrice(dto.price);
    }

    if (dto.quantity !== undefined) {
      item.quantity = this.requireQuantity(dto.quantity);
    }

    if (dto.discount !== undefined) {
      item.discount = this.requireDiscount(dto.discount);
    }

    await this.items.save(item);
    await this.refreshTotal(item.orderId);
    return this.toItem(item);
  }

  async applyItemDiscount(id: number, discount: number): Promise<OrderItem> {
    return this.updateItem(id, { discount });
  }

  private async addItem(dto: CreateOrderItemDto): Promise<OrderItem> {
    await this.findOneOrder(dto.orderId);

    const item = await this.items.save(
      this.items.create({
        orderId: dto.orderId,
        productId: dto.productId,
        name: dto.name,
        price: this.requirePrice(dto.price),
        quantity: this.requireQuantity(dto.quantity),
        discount: this.requireDiscount(dto.discount ?? 0),
      }),
    );

    await this.refreshTotal(item.orderId);
    return this.toItem(item);
  }

  private async withItems(order: OrderEntity): Promise<OrderWithItems> {
    const items = await this.items.find({
      where: { orderId: order.id },
      order: { id: 'ASC' },
    });

    return {
      ...this.toOrder(order),
      items: items.map((item) => this.toItem(item)),
    };
  }

  private async nextOrderCode() {
    const rows = await this.orders.find();
    let max = 1120;

    for (const row of rows) {
      const match = /^VER-(\d+)$/.exec(row.orderId);
      if (match) {
        max = Math.max(max, Number(match[1]));
      }
    }

    return `VER-${max + 1}`;
  }

  private async refreshTotal(orderId: number) {
    const items = await this.items.find({ where: { orderId } });
    const totalPrice = Number(
      items.reduce((sum, item) => sum + this.lineTotal(item), 0).toFixed(2),
    );

    const order = await this.orders.findOneBy({ id: orderId });

    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    order.totalPrice = totalPrice;
    await this.orders.save(order);
  }

  private toOrder(row: OrderEntity): Order {
    return {
      id: row.id,
      orderId: row.orderId,
      userId: row.userId,
      payment: row.payment,
      status: row.status,
      totalPrice: row.totalPrice,
      createdAt: row.createdAt,
    };
  }

  private toItem(row: OrderItemEntity): OrderItem {
    return {
      id: row.id,
      orderId: row.orderId,
      productId: row.productId,
      name: row.name,
      price: row.price,
      quantity: row.quantity,
      discount: row.discount,
    };
  }

  private lineTotal(item: OrderItemEntity) {
    return item.price * item.quantity * (1 - item.discount / 100);
  }

  private requirePrice(price: number) {
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      throw new BadRequestException(
        'Price must be a number greater than or equal to 0',
      );
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
