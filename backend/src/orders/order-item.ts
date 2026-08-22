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
  name: string;
  price: number;
  quantity: number;
  discount?: number;
};

export type UpdateOrderItemDto = {
  price?: number;
  quantity?: number;
  discount?: number;
};

export type ApplyItemDiscountDto = {
  discount: number;
};
