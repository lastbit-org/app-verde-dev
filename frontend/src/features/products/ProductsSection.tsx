import { Paragraph, Section } from '../../components'
import { products as localPhotos } from '../../data/products'
import { ProductBuyBox } from './ProductBuyBox'
import { ProductDescription } from './ProductDescription'
import { ProductForm } from './ProductForm'
import { ProductGallery } from './ProductGallery'
import { ProductPayments } from './ProductPayments'
import { ProductViewer } from './ProductViewer'
import { useProducts } from './useProducts'

export function ProductsSection() {
  const { products, loading, saving, error, message, addProduct } = useProducts()
  const product = products[0]

  const viewerImages =
    products.length > 0
      ? products.map((item) => ({
          src: item.image.url,
          alt: item.name,
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
        <div className="product-aside">
          <ProductBuyBox
            stock={12}
            deliveryDate="2026-08-28"
            seller="Verde Atelier"
          />
          <ProductPayments />
        </div>
      </div>

      <ProductDescription
        name={product?.name ?? 'Oliveira em vaso sage'}
        price={product?.price ?? 248}
        text={
          'Folhagem densa, irrigação espaçada. Um objeto quieto para mesa, recuo da sala ou janela com luz filtrada.\n\nO vaso sage é cerâmica fosca; a planta chega aclimatada. Pense nele como peça de permanência, não como enfeite de temporada.'
        }
        details={[
          { label: 'Origem', value: 'Muda cultivada em vaso' },
          { label: 'Luz', value: 'Indireta, algumas horas ao dia' },
          { label: 'Rega', value: 'Quando o substrato secar na superfície' },
        ]}
      />

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
