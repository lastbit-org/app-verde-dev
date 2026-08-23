import { Link, useNavigate } from 'react-router-dom'
import {
  Button,
  Eyebrow,
  Paragraph,
  Quote,
  Section,
  Title,
} from '../../components'
import { products as localPhotos } from '../../data/products'
import { useCart } from '../cart/CartProvider'
import { ProductCarousel } from '../products/ProductCarousel'
import { ProductGallery } from '../products/ProductGallery'
import { salePrice } from '../products/price'
import { productCopy } from '../products/productCopy'
import { useProducts } from '../products/useProducts'

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function HomeStore() {
  const navigate = useNavigate()
  const { addProduct } = useCart()
  const { products, loading, error } = useProducts()
  const featured = products[0]
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

  return (
    <>
      <section className="hero home-hero" id="topo">
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
        </div>

        {featured ? (
          <Link className="home-hero-photo" to={`/product/${featured.id}`}>
            <img src={heroPhoto.src} alt={heroPhoto.alt} />
            <span className="home-hero-photo-meta">
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
            </span>
          </Link>
        ) : (
          <div className="home-hero-photo">
            <img src={heroPhoto.src} alt={heroPhoto.alt} />
          </div>
        )}
      </section>

      {loading ? <p className="status">Carregando a loja…</p> : null}
      {error ? <p className="status status-error">{error}</p> : null}

      {products.length > 0 ? (
        <Section id="favoritos" eyebrow="Coleção" title="Escolhas da casa">
          <Paragraph>
            Deslize o trilho. Cada card abre o detalhe da peça.
          </Paragraph>
          <ProductCarousel products={products} />
        </Section>
      ) : null}

      <Section id="galeria" eyebrow="Loja" title="Todas as peças">
        <Paragraph>
          A vitrine completa. O nome e a foto abrem a página do produto.
        </Paragraph>
        {products.length > 0 ? (
          <ProductGallery products={products} />
        ) : !loading ? (
          <p className="status">Nenhum produto no catálogo ainda.</p>
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
    </>
  )
}
