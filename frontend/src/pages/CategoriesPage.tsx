import { Link } from 'react-router-dom'
import { Eyebrow, Paragraph, Title } from '../components'
import { storeCategories } from '../data/categories'
import { CategoryGallery } from '../features/store/CategoryGallery'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function CategoriesPage() {
  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Loja</Eyebrow>
          <Title as="h1">Categorias</Title>
          <Paragraph variant="lead">
            Recortes da vitrine: processadores, placas, memória e armazenamento.
            Cada card abre o departamento.
          </Paragraph>
        </section>

        <CategoryGallery categories={storeCategories} />

        <p className="row product-links">
          <Link to="/promocoes">Ver promoções</Link>
          <Link to="/#galeria">Todas as peças</Link>
        </p>
      </main>
      <PageFooter />
    </AppChrome>
  )
}
