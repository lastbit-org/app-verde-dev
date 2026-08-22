import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'

type ProductGalleryProps = {
  products: Product[]
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
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
              <span>{formatPrice(product.price)}</span>
            </figcaption>
          </Link>
        </figure>
      ))}
    </div>
  )
}
