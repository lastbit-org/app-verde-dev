import type { Product } from '../../types/product'
import type { CartItem } from './cartData'
import { productCopy } from '../products/productCopy'
import { salePrice } from '../products/price'

export function productToCartItem(product: Product): CartItem {
  const copy = productCopy(product.id)
  const price = salePrice(product.price, product.discount)
  const discounted = (product.discount ?? 0) > 0

  return {
    id: product.id,
    name: product.name,
    description: copy.description,
    image: {
      src: product.image.url,
      alt: product.name,
    },
    price,
    originalPrice: discounted ? product.price : undefined,
    quantity: 1,
  }
}
