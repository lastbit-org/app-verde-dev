import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { salePrice } from './price'

type ProductGalleryProps = {
  products: Product[]
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function Price({ product }: { product: Product }) {
  const discount = product.discount ?? 0
  if (discount > 0) {
    return (
      <span>
        <s>{formatPrice(product.price)}</s>
        {formatPrice(salePrice(product.price, discount))}
      </span>
    )
  }
  return <span>{formatPrice(product.price)}</span>
}

export function ProductGallery({ products }: ProductGalleryProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <div className="gallery">
      {products.map((product) => (
        <figure key={product.id} className="gallery-item">
          <Link to={`/product/${product.id}`}>
            <img src={product.image.url} alt={product.image.name} />
            <figcaption>
              <strong>{product.name}</strong>
              <Price product={product} />
            </figcaption>
          </Link>
        </figure>
      ))}
    </div>
  )
}
