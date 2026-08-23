import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eyebrow, Field, Input, Paragraph, Title } from '../components'
import {
  flattenPurchases,
  PurchaseList,
} from '../features/orders/PurchaseList'
import { useOrders } from '../features/orders/useOrders'
import { useCurrentUser } from '../features/user/useCurrentUser'
import { AppChrome, PageFooter } from '../layout/AppChrome'

function matches(query: string, value: string | number) {
  return String(value).toLowerCase().includes(query)
}

export function PurchasesPage() {
  const { user, loading: userLoading } = useCurrentUser()
  const { orders, loading: ordersLoading, error } = useOrders(Boolean(user))
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()

  const items = useMemo(() => {
    if (!user) {
      return []
    }

    return flattenPurchases(
      orders.filter((order) => order.userId === user.id),
    )
  }, [orders, user])

  const filtered = useMemo(() => {
    if (!needle) {
      return items
    }

    return items.filter(
      (item) =>
        matches(needle, item.name) ||
        matches(needle, item.orderCode) ||
        matches(needle, item.status) ||
        matches(needle, item.payment) ||
        matches(needle, item.productId),
    )
  }, [items, needle])

  const loading = userLoading || ordersLoading

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Conta</Eyebrow>
          <Title as="h1">Itens comprados</Title>
          <Paragraph variant="lead">
            Peças já pedidas nesta conta. O nome abre a página do produto.
          </Paragraph>
        </section>

        <form
          className="form catalog-search"
          onSubmit={(event) => event.preventDefault()}
        >
          <Field label="Busca">
            <Input
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Oliveira, VER-1042, entregue…"
              autoComplete="off"
            />
          </Field>
        </form>

        {loading ? <p className="status">Carregando compras…</p> : null}
        {error ? <p className="status status-error">{error}</p> : null}

        {!loading && !user ? (
          <p className="status">
            Entre para ver as compras.{' '}
            <Link to="/login">Ir ao login</Link>
          </p>
        ) : null}

        {!loading && user && filtered.length === 0 ? (
          <p className="status">
            {needle
              ? `Nenhum item encontrado para “${query.trim()}”.`
              : 'Nenhuma compra nesta conta ainda.'}
          </p>
        ) : null}

        {!loading && filtered.length > 0 ? (
          <PurchaseList items={filtered} />
        ) : null}

        <p className="row product-links">
          <Link to="/user#pedidos">Ver pedidos</Link>
          <Link to="/products">Ver produtos</Link>
        </p>
      </main>

      <PageFooter />
    </AppChrome>
  )
}
