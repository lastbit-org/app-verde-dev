import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createProduct, updateProduct } from '../api/products'
import { ApiError } from '../api/client'
import { Eyebrow, Paragraph, Title } from '../components'
import { useSession } from '../features/auth/SessionProvider'
import { ProductForm } from '../features/products/ProductForm'
import { useProduct } from '../features/products/useProduct'
import { AppChrome, PageFooter } from '../layout/AppChrome'
import type { CreateProductInput } from '../types/product'

export function ProductEditorPage() {
  const { id } = useParams()
  const editing = id !== undefined
  const productId = Number(id)
  const { user, loading: sessionLoading } = useSession()
  const { product, loading: productLoading, error: loadError } = useProduct(
    editing ? productId : null,
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdPath, setCreatedPath] = useState<string | null>(null)
  const [formKey, setFormKey] = useState(0)
  const navigate = useNavigate()

  async function save(payload: CreateProductInput) {
    setSaving(true)
    setError(null)
    if (!editing) {
      setCreatedPath(null)
    }

    try {
      const saved = editing
        ? await updateProduct(productId, {
            name: payload.name,
            price: payload.price,
            discount: payload.discount ?? 0,
            stock: payload.stock ?? 0,
            image: payload.image,
          })
        : await createProduct(payload)

      if (editing) {
        navigate(`/product/${saved.id}`)
      } else {
        setCreatedPath(`/product/${saved.id}`)
        setFormKey((current) => current + 1)
      }
      return true
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Entre para salvar o produto.')
      } else if (err instanceof ApiError && err.status === 403) {
        setError('Só administradores e parceiros alteram o catálogo.')
      } else if (err instanceof ApiError && err.status === 400) {
        setError('Confira nome, preço, estoque, desconto e imagem.')
      } else {
        setError('Não foi possível salvar. Confira se a API está no ar.')
      }
      return false
    } finally {
      setSaving(false)
    }
  }

  const loading = sessionLoading || (editing && productLoading)

  return (
    <AppChrome>
      <main>
        <section className="hero">
          <Eyebrow>Catálogo</Eyebrow>
          <p className="crumbs">
            <Link to="/products">Produtos</Link>
            <span> / </span>
            <span>{editing ? 'Editar' : 'Nova peça'}</span>
          </p>
          <Title as="h1">
            {editing ? 'Editar produto' : 'Cadastrar produto'}
          </Title>
          <Paragraph variant="lead">
            {editing
              ? 'Atualize nome, preço, estoque, desconto e imagem desta peça.'
              : 'Inclua uma peça nova no catálogo da loja.'}
          </Paragraph>
        </section>

        {loading ? <p className="status">Carregando…</p> : null}

        {!sessionLoading && !user ? (
          <p className="status">
            Entre para cadastrar ou editar produtos.{' '}
            <Link to="/login">Ir ao login</Link>
          </p>
        ) : null}

        {editing && !loading && !product ? (
          <p className="status status-error">
            {loadError ?? 'Produto não encontrado.'}
          </p>
        ) : null}

        {user && (!editing || product) ? (
          <ProductForm
            key={editing ? (product?.id ?? 'edit') : `new-${formKey}`}
            product={product}
            saving={saving}
            error={error}
            message={null}
            submitLabel={editing ? 'Salvar alterações' : 'Cadastrar produto'}
            onSubmit={save}
          />
        ) : null}

        {!editing && createdPath ? (
          <p className="status status-ok">
            Peça cadastrada.{' '}
            <Link to={createdPath}>
              {`${window.location.origin}${createdPath}`}
            </Link>
          </p>
        ) : null}

        <p className="row product-links">
          <Link to="/products">Ver tabela</Link>
          {editing && product ? (
            <Link to={`/product/${product.id}`}>Ver peça</Link>
          ) : (
            <Link to="/#galeria">Ver galeria</Link>
          )}
        </p>
      </main>

      <PageFooter />
    </AppChrome>
  )
}
