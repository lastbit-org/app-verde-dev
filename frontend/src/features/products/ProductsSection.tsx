import { Paragraph, Section } from '../../components'
import { ProductForm } from './ProductForm'
import { ProductGallery } from './ProductGallery'
import { useProducts } from './useProducts'

export function ProductsSection() {
  const { products, loading, saving, error, message, addProduct } = useProducts()

  return (
    <Section id="galeria" eyebrow="Loja" title="Produtos">
      <Paragraph>
        A galeria lista <code>GET /products</code>. O cadastro envia{' '}
        <code>POST /products</code>.
      </Paragraph>

      {loading ? <p className="status">Carregando produtos…</p> : null}
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
