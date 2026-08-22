import type { Order } from './orderData'

type OrderListProps = {
  orders: Order[]
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

function formatItems(order: Order) {
  return order.items
    .map((item) => `${item.quantity}× ${item.name}`)
    .join(', ')
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return <p className="status">Nenhuma compra ainda.</p>
  }

  return (
    <div className="product-list">
      <table>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Data</th>
            <th>Itens</th>
            <th>Pagamento</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{formatDay(order.date)}</td>
              <td className="order-items">{formatItems(order)}</td>
              <td>{order.payment}</td>
              <td>{order.status}</td>
              <td>{formatPrice(order.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
