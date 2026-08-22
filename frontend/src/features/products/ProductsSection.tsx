import { useNavigate } from 'react-router-dom'
import { Paragraph, Section } from '../../components'
import { products as localPhotos } from '../../data/products'
import { useCart } from '../cart/CartProvider'
import { ProductBuyBox } from './ProductBuyBox'
import { ProductCarousel } from './ProductCarousel'
import { ProductDescription } from './ProductDescription'
import { ProductForm } from './ProductForm'
import { ProductGallery } from './ProductGallery'
import { ProductList } from './ProductList'
import { ProductPayments } from './ProductPayments'
import { ProductViewer } from './ProductViewer'
import { productCopy } from './productCopy'
import { useProducts } from './useProducts'

export function ProductsSection() {
  const navigate = useNavigate()
  const { addProduct: addToCart } = useCart()
  const {
    products,
    loading,
    saving,
    error,
    message,
    addProduct,
    setDiscount,
  } = useProducts()
  const product = products[0]
  const copy = productCopy(product?.id ?? 1)

  const viewerImages =
    products.length > 0
      ? products.map((item) => ({
          src: item.image.url,
          alt: item.name,
        }))
      : localPhotos

  function go(to: '/cart' | '/checkout') {
    if (!product) {
      return
    }
    addToCart(product)
    navigate(to)
  }

  return (
    <Section id="galeria" eyebrow="Loja" title="Produtos">
      <Paragraph>
        A galeria lista <code>GET /products</code>. O cadastro envia{' '}
        <code>POST /products</code>.
      </Paragraph>

      {loading ? <p className="status">Carregando produtos…</p> : null}

      <div className="product-stage">
        <ProductViewer images={viewerImages} />
        <div className="product-aside">
          <ProductBuyBox
            stock={12}
            deliveryDate="2026-08-28"
            seller="Verde Atelier"
            onBuy={() => go('/checkout')}
            onAddToCart={() => go('/cart')}
          />
          <ProductPayments />
        </div>
      </div>

      <ProductDescription
        name={product?.name ?? 'Oliveira em vaso sage'}
        price={product?.price ?? 248}
        discount={product?.discount}
        text={copy.text}
        details={copy.details}
      />

      <ProductCarousel products={products} />

      <ProductList products={products} onDiscount={setDiscount} />

      <ProductGallery products={products} />

      <ProductForm
        saving={saving}
        error={error}
        message={message}
        onSubmit={addProduct}
      />
    </Section>
  )
}
