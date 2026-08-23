export type ProductImage = {
  url: string;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  discount: number;
  stock: number;
  image: ProductImage;
};

export type CreateProductDto = {
  name: string;
  price: number;
  image: ProductImage;
  discount?: number;
  stock?: number;
};

export type UpdateProductDto = {
  name?: string;
  price?: number;
  image?: ProductImage;
  discount?: number;
  stock?: number;
};

export type ApplyDiscountDto = {
  discount: number;
};
