import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createOrderInput } from '../api/orders'
import { ApiError } from '../api/client'
import { Eyebrow, Paragraph, Title } from '../components'
import { useSession } from '../features/auth/SessionProvider'
import { CheckoutPage } from '../features/cart/CheckoutPage'
import { useCart } from '../features/cart/CartProvider'
import { writeLastOrder } from '../features/orders/lastOrder'
import { useOrders } from '../features/orders/useOrders'
import { useCurrentUser } from '../features/user/useCurrentUser'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function PaymentPage() {
  const { items, total, clear } = useCart()
  const { user, loading: sessionLoading } = useSession()
  const { updateAddress, saving: savingAddress, error: addressError } =
    useCurrentUser()
  const { addOrder } = useOrders(Boolean(user))
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function pay(payment: string) {
    if (!user) {
      setError('Entre na conta para registrar o pedido.')
      return
    }

    setPaying(true)
    setError(null)

    try {
      const order = await addOrder(
        createOrderInput(
          items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          payment,
        ),
      )
      writeLastOrder(order)
      clear()
      navigate('/checkout/confirm', { state: { order } })
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError('Estoque insuficiente ou item inválido. Atualize o carrinho.')
      } else if (err instanceof ApiError && err.status === 401) {
        setError('Entre na conta para registrar o pedido.')
      } else {
        setError('Não foi possível registrar o pedido. Confira se a API está no ar.')
      }
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
        ) : sessionLoading ? (
          <p className="status">Carregando sessão…</p>
        ) : !user ? (
          <p className="status">
            Entre para concluir o pagamento.{' '}
            <Link to="/login">Ir ao login</Link>
          </p>
        ) : (
          <>
            <CheckoutPage
              deliveryDate="2026-08-28"
              amount={total}
              paying={paying}
              address={user.address}
              savingAddress={savingAddress}
              addressError={addressError}
              onSaveAddress={updateAddress}
              onPay={(payment) => void pay(payment)}
            />
            {error ? <p className="status status-error">{error}</p> : null}
          </>
        )}
      </main>

      <PageFooter />
    </AppChrome>
  )
}
