import type { FormEvent } from 'react'
import { Button, Field, Input } from '../../components'
import type { CreateProductInput } from '../../types/product'

type ProductFormProps = {
  saving: boolean
  error: string | null
  message: string | null
  onSubmit: (payload: CreateProductInput) => Promise<boolean>
}

export function ProductForm({
  saving,
  error,
  message,
  onSubmit,
}: ProductFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const created = await onSubmit({
      name: String(data.get('name') ?? ''),
      price: Number(data.get('price')),
      image: {
        url: String(data.get('imageUrl') ?? ''),
        name: String(data.get('imageName') ?? ''),
      },
    })

    if (created) {
      form.reset()
    }
  }

  return (
    <div className="panel">
      <form className="form" onSubmit={(event) => void handleSubmit(event)}>
        <Field label="Nome">
          <Input
            type="text"
            name="name"
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
            placeholder="248"
            required
          />
        </Field>

        <Field label="URL da imagem">
          <Input
            type="url"
            name="imageUrl"
            placeholder="https://picsum.photos/seed/novo/600/800"
            required
          />
        </Field>

        <Field label="Nome do arquivo">
          <Input
            type="text"
            name="imageName"
            placeholder="oliveira-vaso-sage.jpg"
            required
          />
        </Field>

        <div className="row">
          <Button type="submit" disabled={saving}>
            {saving ? 'Enviando…' : 'Cadastrar produto'}
          </Button>
        </div>
      </form>

      {error ? <p className="status status-error">{error}</p> : null}
      {message ? <p className="status status-ok">{message}</p> : null}
    </div>
  )
}
