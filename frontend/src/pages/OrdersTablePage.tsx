import { Link } from 'react-router-dom'
import { Eyebrow, Paragraph, Title } from '../components'
import { OrderList } from '../features/orders/OrderList'
import { useOrders } from '../features/orders/useOrders'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function OrdersTablePage() {
  const { orders, loading, error } = useOrders(true)

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Admin</Eyebrow>
          <Title as="h1">Todos os pedidos</Title>
          <Paragraph variant="lead">
            Pedidos de todas as contas. O código do cliente aparece na coluna
            ao lado do pedido.
          </Paragraph>
        </section>

        {loading ? <p className="status">Carregando pedidos…</p> : null}
        {error ? <p className="status status-error">{error}</p> : null}

        {!loading ? <OrderList orders={orders} showUser /> : null}

        <p className="row product-links">
          <Link to="/products">Ver produtos</Link>
          <Link to="/users">Ver usuários</Link>
        </p>
      </main>

      <PageFooter />
    </AppChrome>
  )
}
