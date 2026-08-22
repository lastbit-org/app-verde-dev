import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input } from '../../components'
import type { Product } from '../../types/product'

type ProductListProps = {
  products: Product[]
  onDiscount?: (id: number, discount: number) => Promise<boolean>
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function salePrice(product: Product) {
  const discount = product.discount ?? 0
  return product.price * (1 - discount / 100)
}

export function ProductList({ products, onDiscount }: ProductListProps) {
  if (products.length === 0) {
    return null
  }

  async function handleDiscount(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault()
    const value = Number(new FormData(event.currentTarget).get('discount'))
    await onDiscount?.(id, value)
  }

  return (
    <div className="product-list">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Arquivo</th>
            <th>Desconto</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>
                <Link to={`/product/${product.id}`}>{product.name}</Link>
              </td>
              <td>
                {(product.discount ?? 0) > 0 ? (
                  <>
                    <s>{formatPrice(product.price)}</s>{' '}
                    {formatPrice(salePrice(product))}
                  </>
                ) : (
                  formatPrice(product.price)
                )}
              </td>
              <td>{product.image.name}</td>
              <td>
                <form
                  key={`${product.id}-${product.discount ?? 0}`}
                  className="discount-field"
                  onSubmit={(event) => void handleDiscount(event, product.id)}
                >
                  <Input
                    type="number"
                    name="discount"
                    min={0}
                    max={100}
                    step={1}
                    defaultValue={product.discount ?? 0}
                    aria-label={`Desconto de ${product.name}`}
                  />
                  <span>%</span>
                  <Button type="submit">Aplicar</Button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
