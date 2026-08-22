import { Paragraph, Title } from '../../components'
import type { Order } from '../../types/order'

type UserStatsProps = {
  orders: Order[]
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function UserStats({ orders }: UserStatsProps) {
  const spent = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const last = orders[0]

  return (
    <div className="panel user-stats">
      <Title as="h4">Resumo</Title>
      <dl className="user-stats-grid">
        <div>
          <dt>Pedidos</dt>
          <dd>{orders.length}</dd>
        </div>
        <div>
          <dt>Total</dt>
          <dd>{formatPrice(spent)}</dd>
        </div>
        <div>
          <dt>Último status</dt>
          <dd>{last?.status ?? '—'}</dd>
        </div>
      </dl>
      {last ? (
        <Paragraph variant="muted">
          Pedido mais recente: {last.orderId}.
        </Paragraph>
      ) : (
        <Paragraph variant="muted">Nenhuma compra nesta conta ainda.</Paragraph>
      )}
    </div>
  )
}
