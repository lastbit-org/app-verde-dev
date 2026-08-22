import type { CreateOrderItemDto, OrderItem } from './order-item';

export type OrderStatus = 'preparando' | 'em trânsito' | 'entregue' | 'cancelado';

export type Order = {
  id: number;
  orderId: string;
  userId: number;
  payment: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
};

export type OrderWithItems = Order & {
  items: OrderItem[];
};

export type CreateOrderLineDto = Omit<CreateOrderItemDto, 'orderId'>;

export type CreateOrderDto = {
  userId: number;
  payment: string;
  createdAt?: string;
  items?: CreateOrderLineDto[];
};

export type UpdateOrderDto = {
  payment?: string;
  status?: OrderStatus;
};
