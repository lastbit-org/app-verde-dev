import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eyebrow, Field, Input, Paragraph, Title } from '../components'
import { ProductList } from '../features/products/ProductList'
import { useProducts } from '../features/products/useProducts'
import { AppChrome, PageFooter } from '../layout/AppChrome'

function matches(query: string, value: string | number) {
  return String(value).toLowerCase().includes(query)
}

export function ProductsTablePage() {
  const { products, loading, error, message, setDiscount } = useProducts()
  const [query, setQuery] = useState('')
  const needle = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    if (!needle) {
      return products
    }

    return products.filter(
      (product) =>
        matches(needle, product.name) ||
        matches(needle, product.id) ||
        matches(needle, product.image.name) ||
        matches(needle, product.price),
    )
  }, [needle, products])

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Catálogo</Eyebrow>
          <Title as="h1">Tabela de produtos</Title>
          <Paragraph variant="lead">
            Busque por nome, código, arquivo ou preço. O nome abre a página da
            peça.
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
              placeholder="Oliveira, 1, vaso-ceramica…"
              autoComplete="off"
            />
          </Field>
        </form>

        {loading ? <p className="status">Carregando produtos…</p> : null}
        {error ? <p className="status status-error">{error}</p> : null}
        {message ? <p className="status status-ok">{message}</p> : null}

        {!loading && filtered.length === 0 ? (
          <p className="status">
            {needle
              ? `Nenhum produto encontrado para “${query.trim()}”.`
              : 'Nenhum produto cadastrado.'}
          </p>
        ) : (
          <ProductList products={filtered} onDiscount={setDiscount} />
        )}

        <p className="row product-links">
          <Link to="/#galeria">Ver galeria</Link>
        </p>
      </main>

      <PageFooter />
    </AppChrome>
  )
}
