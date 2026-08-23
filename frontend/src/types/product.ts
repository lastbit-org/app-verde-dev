export type ProductImage = {
  url: string
  name: string
}

export type Product = {
  id: number
  name: string
  price: number
  discount: number
  stock: number
  image: ProductImage
}

export type CreateProductInput = {
  name: string
  price: number
  discount?: number
  stock?: number
  image: ProductImage
}

export type UpdateProductInput = {
  name: string
  price: number
  discount: number
  stock: number
  image: ProductImage
}
