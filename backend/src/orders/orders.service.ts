import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { User } from '../users/user';
import { isAdmin } from '../users/roles';
import { ProductEntity } from '../products/product.entity';
import type {
  CreateOrderDto,
  Order,
  OrderStatus,
  OrderWithItems,
  UpdateOrderDto,
} from './order';
import type { CancelOrderDto } from './order.dto';
import type { OrderItem, UpdateOrderItemDto } from './order-item';
import { OrderItemEntity } from './order-item.entity';
import { OrderCancellationEntity } from './order-cancellation.entity';
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
    @InjectRepository(ProductEntity)
    private readonly products: Repository<ProductEntity>,
    @InjectRepository(OrderCancellationEntity)
    private readonly cancellations: Repository<OrderCancellationEntity>,
  ) {}

  async findAllOrders(userId?: number): Promise<OrderWithItems[]> {
    const rows = await this.orders.find({
      ...(userId === undefined ? {} : { where: { userId } }),
      order: { id: 'ASC' },
    });
    return Promise.all(rows.map((row) => this.withItems(row)));
  }

  async requireOrderAccess(id: number, user: User): Promise<OrderWithItems> {
    const order = await this.findOneOrder(id);

    if (order.userId !== user.id && !isAdmin(user.role)) {
      throw new ForbiddenException();
    }

    return order;
  }

  async requireOwnedItem(id: number, user: User): Promise<OrderItem> {
    const item = await this.findOneItem(id);
    await this.requireOrderAccess(item.orderId, user);
    return item;
  }

  async findOneOrder(id: number): Promise<OrderWithItems> {
    const order = await this.orders.findOneBy({ id });

    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    return this.withItems(order);
  }

  async createOrder(userId: number, dto: CreateOrderDto): Promise<OrderWithItems> {
    const order = await this.orders.save(
      this.orders.create({
        orderId: await this.nextOrderCode(),
        userId,
        payment: dto.payment,
        status: 'preparando',
        totalPrice: 0,
        createdAt: dto.createdAt ?? new Date().toISOString().slice(0, 10),
      }),
    );

    try {
      for (const line of dto.items ?? []) {
        await this.addItem(order.id, line.productId, line.quantity);
      }
    } catch (error) {
      await this.restoreOrderStock(order.id);
      await this.items.delete({ orderId: order.id });
      await this.orders.remove(order);
      throw error;
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

  async cancelOrder(
    id: number,
    user: User,
    dto: CancelOrderDto,
  ): Promise<OrderWithItems> {
    const current = await this.requireOrderAccess(id, user);

    if (current.status === 'entregue') {
      throw new BadRequestException('Delivered orders cannot be cancelled');
    }

    if (current.status === 'cancelado') {
      throw new BadRequestException('Order is already cancelled');
    }

    const order = await this.orders.findOneBy({ id });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }

    await this.restoreOrderStock(id);
    order.status = 'cancelado';
    order.cancelReason = dto.reason;
    order.cancelDetails = dto.details?.trim() ? dto.details.trim() : null;
    await this.orders.save(order);

    const existing = await this.cancellations.findOneBy({ orderId: id });
    if (existing) {
      existing.reason = dto.reason;
      existing.details = order.cancelDetails;
      existing.userId = user.id;
      await this.cancellations.save(existing);
    } else {
      await this.cancellations.save(
        this.cancellations.create({
          orderId: id,
          userId: user.id,
          reason: dto.reason,
          details: order.cancelDetails,
        }),
      );
    }

    return this.findOneOrder(id);
  }

  async findCancellation(id: number, user: User) {
    await this.requireOrderAccess(id, user);
    const row = await this.cancellations.findOneBy({ orderId: id });

    if (!row) {
      throw new NotFoundException(`Cancellation for order ${id} not found`);
    }

    return {
      id: row.id,
      orderId: row.orderId,
      userId: row.userId,
      reason: row.reason,
      details: row.details,
      createdAt: row.createdAt,
    };
  }

  async findAllItems(orderId: number | undefined, user: User): Promise<OrderItem[]> {
    if (orderId === undefined) {
      if (!isAdmin(user.role)) {
        throw new ForbiddenException();
      }

      const rows = await this.items.find({ order: { id: 'ASC' } });
      return rows.map((row) => this.toItem(row));
    }

    await this.requireOrderAccess(orderId, user);
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

  async createItem(
    dto: { orderId: number; productId: number; quantity: number },
    user: User,
  ): Promise<OrderItem> {
    await this.requireOrderAccess(dto.orderId, user);
    return this.addItem(dto.orderId, dto.productId, dto.quantity);
  }

  async updateItem(
    id: number,
    dto: UpdateOrderItemDto,
    user: User,
  ): Promise<OrderItem> {
    await this.requireOwnedItem(id, user);
    const item = await this.items.findOneBy({ id });

    if (!item) {
      throw new NotFoundException(`Order item ${id} not found`);
    }

    if (dto.quantity !== undefined) {
      const quantity = this.requireQuantity(dto.quantity);
      await this.adjustStock(item.productId, item.quantity, quantity);
      item.quantity = quantity;
    }

    await this.items.save(item);
    await this.refreshTotal(item.orderId);
    return this.toItem(item);
  }

  async applyItemDiscount(
    id: number,
    discount: number,
    user: User,
  ): Promise<OrderItem> {
    await this.requireOwnedItem(id, user);
    const item = await this.items.findOneBy({ id });

    if (!item) {
      throw new NotFoundException(`Order item ${id} not found`);
    }

    item.discount = this.requireDiscount(discount);
    await this.items.save(item);
    await this.refreshTotal(item.orderId);
    return this.toItem(item);
  }

  private async addItem(
    orderId: number,
    productId: number,
    quantity: number,
  ): Promise<OrderItem> {
    await this.findOneOrder(orderId);
    const product = await this.requireProduct(productId);
    const qty = this.requireQuantity(quantity);

    if (product.stock < qty) {
      throw new BadRequestException(
        `Insufficient stock for product ${productId}`,
      );
    }

    product.stock -= qty;
    await this.products.save(product);

    const item = await this.items.save(
      this.items.create({
        orderId,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        discount: product.discount,
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

  private async requireProduct(id: number) {
    const product = await this.products.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }

    return product;
  }

  private async adjustStock(
    productId: number,
    previous: number,
    next: number,
  ) {
    const delta = next - previous;

    if (delta === 0) {
      return;
    }

    const product = await this.requireProduct(productId);

    if (delta > 0 && product.stock < delta) {
      throw new BadRequestException(
        `Insufficient stock for product ${productId}`,
      );
    }

    product.stock -= delta;
    await this.products.save(product);
  }

  private async restoreOrderStock(orderId: number) {
    const items = await this.items.find({ where: { orderId } });

    for (const item of items) {
      const product = await this.products.findOneBy({ id: item.productId });
      if (!product) {
        continue;
      }
      product.stock += item.quantity;
      await this.products.save(product);
    }
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
      cancelReason: row.cancelReason ?? null,
      cancelDetails: row.cancelDetails ?? null,
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
