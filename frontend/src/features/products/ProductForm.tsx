import type { FormEvent } from 'react'
import { Button, Field, Input } from '../../components'
import type { CreateProductInput, Product } from '../../types/product'

type ProductFormProps = {
  product?: Product | null
  saving: boolean
  error: string | null
  message: string | null
  submitLabel?: string
  onSubmit: (payload: CreateProductInput) => Promise<boolean>
}

export function ProductForm({
  product,
  saving,
  error,
  message,
  submitLabel = 'Cadastrar produto',
  onSubmit,
}: ProductFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const saved = await onSubmit({
      name: String(data.get('name') ?? ''),
      price: Number(data.get('price')),
      discount: Number(data.get('discount') ?? 0),
      stock: Math.trunc(Number(data.get('stock') ?? 0)),
      image: {
        url: String(data.get('imageUrl') ?? ''),
        name: String(data.get('imageName') ?? ''),
      },
    })

    if (saved && !product) {
      form.reset()
    }
  }

  return (
    <div className="panel product-editor">
      {product ? (
        <img
          className="editor-preview"
          src={product.image.url}
          alt={product.name}
        />
      ) : null}
      <form className="form" onSubmit={(event) => void handleSubmit(event)}>
        <Field label="Nome">
          <Input
            type="text"
            name="name"
            defaultValue={product?.name ?? ''}
            placeholder="Oliveira em vaso sage"
            required
          />
        </Field>

        <Field label="Preço">
          <Input
            type="number"
            name="price"
            min={0}
            step="0.01"
            defaultValue={product?.price ?? ''}
            placeholder="248"
            required
          />
        </Field>

        <Field label="Estoque">
          <Input
            type="number"
            name="stock"
            min={0}
            step={1}
            defaultValue={product?.stock ?? 12}
            required
          />
        </Field>

        <Field label="Desconto (%)">
          <Input
            type="number"
            name="discount"
            min={0}
            max={100}
            step={1}
            defaultValue={product?.discount ?? 0}
            required
          />
        </Field>

        <Field label="URL da imagem">
          <Input
            type="url"
            name="imageUrl"
            defaultValue={product?.image.url ?? ''}
            placeholder="https://picsum.photos/seed/novo/600/800"
            required
          />
        </Field>

        <Field label="Nome do arquivo">
          <Input
            type="text"
            name="imageName"
            defaultValue={product?.image.name ?? ''}
            placeholder="oliveira-vaso-sage.jpg"
            required
          />
        </Field>

        <div className="row">
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando…' : submitLabel}
          </Button>
        </div>
      </form>

      {error ? <p className="status status-error">{error}</p> : null}
      {message ? <p className="status status-ok">{message}</p> : null}
    </div>
  )
}
