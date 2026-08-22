import { Paragraph, Section } from '../../components'
import type { Order } from '../../types/order'
import { OrderList } from './OrderList'

type OrdersSectionProps = {
  orders: Order[]
  loading: boolean
  error: string | null
}

export function OrdersSection({ orders, loading, error }: OrdersSectionProps) {
  return (
    <Section id="pedidos" eyebrow="Conta" title="Minhas compras">
      <Paragraph>
        Pedidos desta conta, com pagamento e andamento da entrega. O checkout
        envia <code>POST /orders</code>.
      </Paragraph>
      {loading ? <p className="status">Carregando pedidos…</p> : null}
      {error ? <p className="status status-error">{error}</p> : null}
      {!loading && !error ? <OrderList orders={orders} /> : null}
    </Section>
  )
}
