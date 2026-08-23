import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import { salePrice } from './price'

type ProductCarouselProps = {
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

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === 'left' ? (
        <path d="M15 6 9 12l6 6" />
      ) : (
        <path d="m9 6 6 6-6 6" />
      )}
    </svg>
  )
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const track = useRef<HTMLDivElement>(null)

  if (products.length === 0) {
    return null
  }

  function scroll(direction: -1 | 1) {
    const node = track.current
    if (!node) {
      return
    }

    node.scrollBy({
      left: node.clientWidth * 0.85 * direction,
      behavior: 'smooth',
    })
  }

  return (
    <div className="rail">
      <button
        type="button"
        className="rail-nav"
        aria-label="Produtos anteriores"
        onClick={() => scroll(-1)}
      >
        <Chevron dir="left" />
      </button>

      <div className="rail-track" ref={track}>
        {products.map((product) => (
          <Link
            key={product.id}
            className="rail-card"
            to={`/product/${product.id}`}
          >
            <img src={product.image.url} alt={product.image.name} />
            <div className="rail-card-body">
              <strong>{product.name}</strong>
              <Price product={product} />
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        className="rail-nav"
        aria-label="Próximos produtos"
        onClick={() => scroll(1)}
      >
        <Chevron dir="right" />
      </button>
    </div>
  )
}
