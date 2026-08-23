import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createOrderInput } from '../api/orders'
import { Eyebrow, Paragraph, Title } from '../components'
import { useSession } from '../features/auth/SessionProvider'
import { CheckoutPage } from '../features/cart/CheckoutPage'
import { useCart } from '../features/cart/CartProvider'
import { useOrders } from '../features/orders/useOrders'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function PaymentPage() {
  const { items, total } = useCart()
  const { user } = useSession()
  const { addOrder } = useOrders()
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdId, setCreatedId] = useState<string | null>(null)

  async function pay(payment: string) {
    setPaying(true)
    setError(null)

    try {
      const order = await addOrder(
        createOrderInput(
          items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            discount: 0,
          })),
          payment,
          user?.id ?? 1,
        ),
      )
      setCreatedId(order.orderId)
    } catch {
      setError('Não foi possível registrar o pedido. Confira se a API está no ar.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Pedido</Eyebrow>
          <p className="crumbs">
            <Link to="/cart">Carrinho</Link>
            <span> / </span>
            <span>Pagamento</span>
          </p>
          <Title as="h1">Pagamento</Title>
          <Paragraph variant="lead">
            Confirme o endereço, a entrega e o meio de pagamento. O Pix é simulado.
          </Paragraph>
        </section>

        {items.length === 0 ? (
          <p className="status">
            Não há itens para pagar.{' '}
            <Link to="/cart">Voltar ao carrinho</Link>
            {' · '}
            <Link to="/#galeria">Ver produtos</Link>
          </p>
        ) : (
          <>
            <CheckoutPage
              deliveryDate="2026-08-28"
              amount={total}
              paying={paying}
              onPay={(payment) => void pay(payment)}
            />
            {error ? <p className="status status-error">{error}</p> : null}
            {createdId ? (
              <p className="status status-ok">
                Pedido {createdId} registrado.{' '}
                <Link to="/purchases">Ver minhas compras</Link>
              </p>
            ) : null}
          </>
        )}
      </main>

      <PageFooter />
    </AppChrome>
  )
}
