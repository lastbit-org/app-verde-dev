import { Link, useNavigate } from 'react-router-dom'
import { Eyebrow, Paragraph, Title } from '../components'
import { CartPage } from '../features/cart/CartPage'
import { useCart } from '../features/cart/CartProvider'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function ShoppingCartPage() {
  const { items, increase, decrease, remove } = useCart()
  const navigate = useNavigate()

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Pedido</Eyebrow>
          <Title as="h1">Carrinho</Title>
          <Paragraph variant="lead">
            Revise as peças e siga para o pagamento quando estiver pronto.
          </Paragraph>
        </section>

        {items.length === 0 ? (
          <p className="status">
            O carrinho está vazio.{' '}
            <Link to="/#galeria">Ver produtos</Link>
          </p>
        ) : (
          <CartPage
            items={items}
            onIncrease={increase}
            onDecrease={decrease}
            onRemove={remove}
            continueLabel="Ir ao pagamento"
            onContinue={() => navigate('/checkout')}
          />
        )}

        <p className="row product-links">
          <Link to="/#galeria">Continuar comprando</Link>
          {items.length > 0 ? <Link to="/checkout">Ir ao pagamento</Link> : null}
        </p>
      </main>

      <PageFooter />
    </AppChrome>
  )
}
