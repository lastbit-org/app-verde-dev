import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Button,
  Eyebrow,
  Pagination,
  Paragraph,
  Quote,
  Section,
  Title,
} from '../../components'
import { storeCategories } from '../../data/categories'
import { products as localPhotos } from '../../data/products'
import type { Product } from '../../types/product'
import { useCart } from '../cart/CartProvider'
import { CategoryGallery } from './CategoryGallery'
import { ProductCarousel } from '../products/ProductCarousel'
import { ProductGallery } from '../products/ProductGallery'
import { salePrice } from '../products/price'
import { productCopy } from '../products/productCopy'
import { useProducts } from '../products/useProducts'

const VITRINE_PAGE_SIZE = 4

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function matchesQuery(product: { id: number; name: string }, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) {
    return true
  }

  return (
    product.name.toLowerCase().includes(needle) ||
    String(product.id).includes(needle)
  )
}

function HousePicks({ id, products }: { id: string; products: Product[] }) {
  if (products.length === 0) {
    return null
  }

  return (
    <Section id={id} eyebrow="Coleção" title="Escolhas da casa">
      <Paragraph>
        Deslize o trilho. Cada card abre o detalhe da peça.
      </Paragraph>
      <ProductCarousel products={products} />
    </Section>
  )
}

export function HomeStore() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const { addProduct } = useCart()
  const { products, loading, error } = useProducts()
  const featured = products[0]
  const searched = products.filter((product) => matchesQuery(product, query))
  const deals = searched.filter((product) => (product.discount ?? 0) > 0)
  const pageCount = Math.max(1, Math.ceil(searched.length / VITRINE_PAGE_SIZE))
  const requestedPage = Number(params.get('page')) || 1
  const page = Math.min(Math.max(1, requestedPage), pageCount)
  const paged = searched.slice(
    (page - 1) * VITRINE_PAGE_SIZE,
    page * VITRINE_PAGE_SIZE,
  )
  const copy = productCopy(featured?.id ?? 1)
  const heroPhoto = featured
    ? { src: featured.image.url, alt: featured.name }
    : localPhotos[0]
  const featuredPrice = featured
    ? salePrice(featured.price, featured.discount)
    : null

  function addFeatured() {
    if (!featured) {
      return
    }
    addProduct(featured)
    navigate('/cart')
  }

  function goToVitrinePage(next: number) {
    const nextParams = new URLSearchParams(params)
    if (next <= 1) {
      nextParams.delete('page')
    } else {
      nextParams.set('page', String(next))
    }
    setParams(nextParams, { preventScrollReset: true })
    document.getElementById('galeria')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section
        className="hero home-hero"
        id="topo"
        style={{ backgroundImage: `url(${JSON.stringify(heroPhoto.src)})` }}
        aria-label={heroPhoto.alt}
      >
        <div className="home-hero-veil" aria-hidden />
        <div className="home-hero-copy">
          <Eyebrow>Ateliê</Eyebrow>
          <Title as="h1">Plantas e vasos para uma casa mais quieta.</Title>
          <Paragraph variant="lead">
            Peças selecionadas para mesa, recuo e janela. Pouca cor, bastante
            presença — o verde entra como tom de fundo, não como enfeite.
          </Paragraph>
          {featured ? (
            <Paragraph variant="muted">{copy.description}</Paragraph>
          ) : null}
          <div className="row">
            <Link className="btn btn-primary" to="/#galeria">
              Ver a loja
            </Link>
            {featured ? (
              <>
                <Button variant="secondary" onClick={() => navigate(`/product/${featured.id}`)}>
                  Ver peça
                </Button>
                <Button variant="ghost" onClick={addFeatured}>
                  Adicionar ao carrinho
                </Button>
              </>
            ) : (
              <Link className="btn btn-secondary" to="/products">
                Tabela de produtos
              </Link>
            )}
          </div>
          {featured ? (
            <p className="home-hero-photo-meta">
              <strong>{featured.name}</strong>
              <span>
                {(featured.discount ?? 0) > 0 ? (
                  <>
                    <s>{formatPrice(featured.price)}</s>
                    {formatPrice(featuredPrice ?? featured.price)}
                  </>
                ) : (
                  formatPrice(featured.price)
                )}
              </span>
            </p>
          ) : null}
        </div>
      </section>

      <div className="home-rest">
        {loading ? <p className="status">Carregando a loja…</p> : null}
        {error ? <p className="status status-error">{error}</p> : null}

        <HousePicks id="trilho" products={products} />

      <Section id="categorias" eyebrow="Navegar" title="Categorias">
        <Paragraph>
          Recortes da vitrine em hardware selecionado. Cada card abre o
          departamento.
        </Paragraph>
        <CategoryGallery categories={storeCategories} />
        <p className="row product-links">
          <Link to="/categories">Todas as categorias</Link>
          <Link to="/promocoes">Em promoção</Link>
        </p>
      </Section>

      {deals.length > 0 ? (
        <Section id="promocoes" eyebrow="Ofertas" title="Promoções">
          <Paragraph>
            Só itens com desconto. O card abre o detalhe do produto.
          </Paragraph>
          <ProductGallery products={deals} />
          <p className="row product-links">
            <Link to="/promocoes">Ver todas as promoções</Link>
          </p>
        </Section>
      ) : (
        <Section id="promocoes" eyebrow="Ofertas" title="Promoções">
          <Paragraph>
            Nenhuma promoção ativa no momento.{' '}
            <Link to="/promocoes">Abrir a página de ofertas</Link>
          </Paragraph>
        </Section>
      )}

      <HousePicks id="favoritos" products={products} />

      <Section id="galeria" eyebrow="Loja" title="Todas as peças">
        <Paragraph>
          {query.trim()
            ? `Resultados para “${query.trim()}”. O nome e a foto abrem a página do produto.`
            : 'A vitrine completa. O nome e a foto abrem a página do produto.'}
        </Paragraph>
        {paged.length > 0 ? (
          <>
            <ProductGallery products={paged} />
            <Pagination
              page={page}
              pageCount={pageCount}
              onPage={goToVitrinePage}
            />
          </>
        ) : !loading ? (
          <p className="status">
            {query.trim()
              ? `Nenhuma peça encontrada para “${query.trim()}”.`
              : 'Nenhum produto no catálogo ainda.'}
          </p>
        ) : null}
        <p className="row product-links">
          <Link to="/products">Ver tabela de produtos</Link>
          <Link to="/cart">Ir ao carrinho</Link>
        </p>
      </Section>

      <Section id="atelie" eyebrow="Cuidado" title="Como a Verde envia">
        <div className="home-notes">
          <article className="home-note">
            <Title as="h3">Embalagem rígida</Title>
            <Paragraph>
              Planta aclimatada, vaso protegido. Chega pronto para a janela.
            </Paragraph>
          </article>
          <article className="home-note">
            <Title as="h3">Peças selecionadas</Title>
            <Paragraph>
              Poucas unidades, escolhidas pelo ateliê. Nada de estoque barulhento.
            </Paragraph>
          </article>
          <article className="home-note">
            <Title as="h3">Devolução simples</Title>
            <Paragraph>
              Sete dias para devolver, sem custo. A compra fica garantida.
            </Paragraph>
          </article>
        </div>
        <Quote>
          “Menos vitrine, mais cuidado. O verde entra como tom de fundo, não
          como enfeite.”
        </Quote>
      </Section>
      </div>
    </>
  )
}
