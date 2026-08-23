import type { Order } from '../../types/order'

type OrderListProps = {
  orders: Order[]
  showUser?: boolean
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

function itemsLabel(order: Order) {
  return order.items
    .map((item) => `${item.quantity}× ${item.name}`)
    .join(', ')
}

function formatItems(order: Order, limit = 40) {
  const text = itemsLabel(order)

  if (text.length <= limit) {
    return text
  }

  return `${text.slice(0, limit).trimEnd()}...`
}

export function OrderList({ orders, showUser = false }: OrderListProps) {
  if (orders.length === 0) {
    return <p className="status">Nenhuma compra ainda.</p>
  }

  return (
    <div className="product-list">
      <table>
        <thead>
          <tr>
            <th>Pedido</th>
            {showUser ? <th>Cliente</th> : null}
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
              <td>{order.orderId}</td>
              {showUser ? <td>{order.userId}</td> : null}
              <td>{formatDay(order.createdAt)}</td>
              <td className="order-items" title={itemsLabel(order)}>
                {formatItems(order)}
              </td>
              <td>{order.payment}</td>
              <td>{order.status}</td>
              <td>{formatPrice(order.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
