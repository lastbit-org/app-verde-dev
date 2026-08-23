import { Link, Navigate, useParams } from 'react-router-dom'
import { Eyebrow, Paragraph, Title } from '../components'
import { categoryBySlug, storeCategories } from '../data/categories'
import { CategoryGallery } from '../features/store/CategoryGallery'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function CategoryPage() {
  const { slug } = useParams()
  const category = categoryBySlug(slug)

  if (!category) {
    return <Navigate to="/categories" replace />
  }

  const others = storeCategories.filter((item) => item.slug !== category.slug)

  return (
    <AppChrome>
      <main>
        <section className="hero home-hero">
          <div className="home-hero-copy">
            <Eyebrow>{category.eyebrow}</Eyebrow>
            <Title as="h1">{category.name}</Title>
            <Paragraph variant="lead">{category.summary}</Paragraph>
            <Paragraph>{category.description}</Paragraph>
            <p className="row product-links">
              <Link to="/#galeria">Ver a loja</Link>
              <Link to="/promocoes">Peças em promoção</Link>
            </p>
          </div>
          <div className="home-hero-photo">
            <img src={category.image} alt={category.imageAlt} />
          </div>
        </section>

        {others.length > 0 ? (
          <section>
            <Eyebrow>Navegar</Eyebrow>
            <Title as="h2">Outras categorias</Title>
            <CategoryGallery categories={others} />
          </section>
        ) : null}

        <p className="row product-links">
          <Link to="/categories">Todas as categorias</Link>
          <Link to="/">Voltar ao início</Link>
        </p>
      </main>
      <PageFooter />
    </AppChrome>
  )
}
