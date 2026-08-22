import { Link, useNavigate, useParams } from 'react-router-dom'
import { Eyebrow, Paragraph, Title } from '../components'
import { useCart } from '../features/cart/CartProvider'
import { ProductBuyBox } from '../features/products/ProductBuyBox'
import { ProductCarousel } from '../features/products/ProductCarousel'
import { ProductDescription } from '../features/products/ProductDescription'
import { ProductPayments } from '../features/products/ProductPayments'
import { ProductViewer } from '../features/products/ProductViewer'
import { productCopy } from '../features/products/productCopy'
import { useProduct } from '../features/products/useProduct'
import { useProducts } from '../features/products/useProducts'
import { AppChrome, PageFooter } from '../layout/AppChrome'

export function ProductPage() {
  const { id } = useParams()
  const productId = Number(id)
  const { product, loading, error } = useProduct(productId)
  const { products } = useProducts()
  const { addProduct } = useCart()
  const navigate = useNavigate()
  const copy = productCopy(productId)
  const related = products.filter((item) => item.id !== productId)

  function addAndGo(to: '/cart' | '/checkout') {
    if (!product) {
      return
    }
    addProduct(product)
    navigate(to)
  }

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Produto</Eyebrow>
          <p className="crumbs">
            <Link to="/#galeria">Loja</Link>
            <span> / </span>
            <span>{product?.name ?? 'Peça'}</span>
          </p>
          <Title as="h1">{product?.name ?? 'Produto'}</Title>
          <Paragraph variant="lead">
            Detalhe da peça, com atalho para o carrinho e para o pagamento.
          </Paragraph>
        </section>

        {loading ? <p className="status">Carregando produto…</p> : null}
        {error ? <p className="status status-error">{error}</p> : null}

        {product ? (
          <>
            <div className="product-stage">
              <ProductViewer
                images={[{ src: product.image.url, alt: product.name }]}
              />
              <div className="product-aside">
                <ProductBuyBox
                  stock={12}
                  deliveryDate="2026-08-28"
                  seller="Verde Atelier"
                  onBuy={() => addAndGo('/checkout')}
                  onAddToCart={() => addAndGo('/cart')}
                />
                <ProductPayments />
              </div>
            </div>

            <ProductDescription
              name={product.name}
              price={product.price}
              discount={product.discount}
              text={copy.text}
              details={copy.details}
            />

            <p className="row product-links">
              <Link to="/cart">Ver carrinho</Link>
              <Link to="/checkout">Ir ao pagamento</Link>
            </p>

            {related.length > 0 ? (
              <section className="block">
                <Title as="h2">Outras peças</Title>
                <Paragraph variant="muted">
                  Cada card abre a página do produto.
                </Paragraph>
                <ProductCarousel products={related} />
              </section>
            ) : null}
          </>
        ) : null}
      </main>

      <PageFooter />
    </AppChrome>
  )
}
