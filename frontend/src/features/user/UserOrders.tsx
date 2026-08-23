import { Link } from 'react-router-dom'
import { Paragraph, Title } from '../../components'
import type { Order } from '../../types/order'
import { OrderList } from '../orders/OrderList'

type UserOrdersProps = {
  orders: Order[]
  loading: boolean
  error: string | null
}

export function UserOrders({ orders, loading, error }: UserOrdersProps) {
  return (
    <section id="pedidos" className="block">
      <Title as="h2">Pedidos</Title>
      <Paragraph>
        Compras ligadas a esta conta, com pagamento e andamento da entrega.{' '}
        <Link to="/purchases">Ver itens comprados</Link>.
      </Paragraph>
      {loading ? <p className="status">Carregando pedidos…</p> : null}
      {error ? <p className="status status-error">{error}</p> : null}
      {!loading && !error ? <OrderList orders={orders} /> : null}
    </section>
  )
}
