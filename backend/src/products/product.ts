export type ProductImage = {
  url: string;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  image: ProductImage;
};

export type CreateProductDto = {
  name: string;
  price: number;
  image: ProductImage;
};
