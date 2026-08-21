import { Paragraph, Section } from '../../components'
import { products as localPhotos } from '../../data/products'
import { ProductBuyBox } from './ProductBuyBox'
import { ProductForm } from './ProductForm'
import { ProductGallery } from './ProductGallery'
import { ProductViewer } from './ProductViewer'
import { useProducts } from './useProducts'

export function ProductsSection() {
  const { products, loading, saving, error, message, addProduct } = useProducts()

  const viewerImages =
    products.length > 0
      ? products.map((product) => ({
          src: product.image.url,
          alt: product.name,
        }))
      : localPhotos

  return (
    <Section id="galeria" eyebrow="Loja" title="Produtos">
      <Paragraph>
        A galeria lista <code>GET /products</code>. O cadastro envia{' '}
        <code>POST /products</code>.
      </Paragraph>

      {loading ? <p className="status">Carregando produtos…</p> : null}

      <div className="product-stage">
        <ProductViewer images={viewerImages} />
        <ProductBuyBox
          stock={12}
          deliveryDate="2026-08-28"
          seller="Verde Atelier"
        />
      </div>

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
