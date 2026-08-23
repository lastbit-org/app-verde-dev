import { Link } from 'react-router-dom'
import { Eyebrow, Paragraph, Title } from '../components'
import { ProductGallery } from '../features/products/ProductGallery'
import { useProducts } from '../features/products/useProducts'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function PromotionsPage() {
  const { products, loading, error } = useProducts()
  const deals = products.filter((product) => (product.discount ?? 0) > 0)

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Ofertas</Eyebrow>
          <Title as="h1">Promoções</Title>
          <Paragraph variant="lead">
            Só itens com desconto ativo. O card abre o detalhe do produto.
          </Paragraph>
        </section>

        {loading ? <p className="status">Carregando promoções…</p> : null}
        {error ? <p className="status status-error">{error}</p> : null}

        {!loading && !error && deals.length === 0 ? (
          <p className="status">
            Nenhuma promoção ativa no momento.{' '}
            <Link to="/#galeria">Ver a loja</Link>
          </p>
        ) : (
          <ProductGallery products={deals} />
        )}

        <p className="row product-links">
          <Link to="/categories">Ver categorias</Link>
          <Link to="/#galeria">Todas as peças</Link>
        </p>
      </main>
      <PageFooter />
    </AppChrome>
  )
}
