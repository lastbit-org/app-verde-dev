export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  discount: number;
};

export type CreateOrderItemDto = {
  orderId: number;
  productId: number;
  quantity: number;
};

export type UpdateOrderItemDto = {
  quantity?: number;
};

export type ApplyItemDiscountDto = {
  discount: number;
};
