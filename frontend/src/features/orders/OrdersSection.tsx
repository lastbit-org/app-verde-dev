import { Paragraph, Section } from '../../components'
import { OrderList } from './OrderList'
import { orders } from './orderData'

export function OrdersSection() {
  return (
    <Section id="pedidos" eyebrow="Conta" title="Minhas compras">
      <Paragraph>
        Pedidos desta conta, com pagamento e andamento da entrega.
      </Paragraph>
      <OrderList orders={orders} />
    </Section>
  )
}
