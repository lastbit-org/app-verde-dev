import { Link } from 'react-router-dom'
import { salePrice } from '../products/price'
import type { Order, OrderItem, OrderStatus } from '../../types/order'

export type PurchasedItem = {
  key: string
  orderId: number
  orderCode: string
  createdAt: string
  status: OrderStatus
  payment: string
  productId: number
  name: string
  price: number
  quantity: number
  discount: number
  total: number
}

type PurchaseListProps = {
  items: PurchasedItem[]
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDay(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('pt-BR')
}

function lineTotal(item: OrderItem) {
  return Number(
    (salePrice(item.price, item.discount) * item.quantity).toFixed(2),
  )
}

export function flattenPurchases(orders: Order[]): PurchasedItem[] {
  return orders.flatMap((order) =>
    [...order.items]
      .sort((a, b) => a.id - b.id)
      .map((item) => ({
        key: `${order.id}-${item.id}`,
        orderId: order.id,
        orderCode: order.orderId,
        createdAt: order.createdAt,
        status: order.status,
        payment: order.payment,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,
        total: lineTotal(item),
      })),
  )
}

function canCancel(status: OrderStatus) {
  return status !== 'entregue' && status !== 'cancelado'
}

export function PurchaseList({ items }: PurchaseListProps) {
  return (
    <div className="product-list">
      <table>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Data</th>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Preço</th>
            <th>Desconto</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.key}>
              <td>{item.orderCode}</td>
              <td>{formatDay(item.createdAt)}</td>
              <td>
                <Link to={`/product/${item.productId}`}>{item.name}</Link>
              </td>
              <td>{item.quantity}</td>
              <td>{formatPrice(item.price)}</td>
              <td>{item.discount}%</td>
              <td>{formatPrice(item.total)}</td>
              <td>{item.status}</td>
              <td>
                {canCancel(item.status) ? (
                  <Link to={`/purchases/${item.orderId}/cancel`}>Cancelar</Link>
                ) : (
                  '—'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
