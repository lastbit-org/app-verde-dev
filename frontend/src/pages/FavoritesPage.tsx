import { Link } from 'react-router-dom'
import { Eyebrow, Paragraph, Title } from '../components'
import { ProductGallery } from '../features/products/ProductGallery'
import { useFavorites } from '../features/favorites/FavoritesProvider'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function FavoritesPage() {
  const { products, loading } = useFavorites()

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Conta</Eyebrow>
          <Title as="h1">Favoritos</Title>
          <Paragraph variant="lead">
            Peças que você marcou para voltar depois.
          </Paragraph>
        </section>

        {loading ? <p className="status">Carregando favoritos…</p> : null}

        {!loading && products.length === 0 ? (
          <p className="status">
            Nenhuma peça na lista ainda.{' '}
            <Link to="/#galeria">Ver a loja</Link>
          </p>
        ) : null}

        <ProductGallery products={products} />

        <p className="row product-links">
          <Link to="/#galeria">Continuar comprando</Link>
          <Link to="/user">Ver conta</Link>
        </p>
      </main>
      <PageFooter />
    </AppChrome>
  )
}
