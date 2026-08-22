import type { Product } from '../../types/product'

type ProductListProps = {
  products: Product[]
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function ProductList({ products }: ProductListProps) {
  if (products.length === 0) {
    return null
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
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{formatPrice(product.price)}</td>
              <td>{product.image.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
