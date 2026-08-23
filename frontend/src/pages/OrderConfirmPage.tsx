import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Eyebrow, Paragraph, Title } from '../components'
import { readLastOrder } from '../features/orders/lastOrder'
import { AppChrome, PageFooter } from '../layout/AppChrome'
import type { Order } from '../types/order'

type ConfirmState = {
  order?: Order
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function OrderConfirmPage() {
  const location = useLocation()
  const order = useMemo(() => {
    const fromState = (location.state as ConfirmState | null)?.order
    return fromState ?? readLastOrder()
  }, [location.state])

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Pedido</Eyebrow>
          <p className="crumbs">
            <Link to="/cart">Carrinho</Link>
            <span> / </span>
            <Link to="/checkout">Pagamento</Link>
            <span> / </span>
            <span>Confirmação</span>
          </p>
          <Title as="h1">Compra confirmada.</Title>
          <Paragraph variant="lead">
            {order
              ? `O pedido ${order.orderId} foi registrado. Acompanhe a entrega na sua conta.`
              : 'Não encontramos um pedido recente nesta sessão.'}
          </Paragraph>
        </section>

        {order ? (
          <div className="panel confirm-summary">
            <dl className="confirm-facts">
              <div>
                <dt>Pedido</dt>
                <dd>{order.orderId}</dd>
              </div>
              <div>
                <dt>Pagamento</dt>
                <dd>{order.payment}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{order.status}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{formatPrice(order.totalPrice)}</dd>
              </div>
            </dl>
            {order.items.length > 0 ? (
              <ul className="confirm-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}× {item.name}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <p className="row product-links">
          <Link to="/purchases">Ver minhas compras</Link>
          <Link to="/user#pedidos">Ver pedidos</Link>
          <Link to="/#galeria">Continuar comprando</Link>
          <Link to="/">Voltar à loja</Link>
        </p>
      </main>

      <PageFooter />
    </AppChrome>
  )
}
