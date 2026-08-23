import type { FormEvent } from 'react'
import { Button, Field, Input, Title } from '../../components'
import type { UpdateUserInput } from '../../types/user'

type ProfilePersonalProps = {
  name?: string
  email?: string
  cpf?: string | null
  saving?: boolean
  error?: string | null
  message?: string | null
  onSave?: (payload: UpdateUserInput) => Promise<boolean>
}

export function ProfilePersonal({
  name = 'Ana Silva',
  email = 'ana@example.com',
  cpf = '',
  saving = false,
  error = null,
  message = null,
  onSave,
}: ProfilePersonalProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!onSave) {
      return
    }

    const data = new FormData(event.currentTarget)
    await onSave({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      cpf: String(data.get('cpf') ?? ''),
    })
  }

  return (
    <div className="panel">
      <Title as="h4">Informações pessoais</Title>
      <form className="form" onSubmit={(event) => void handleSubmit(event)}>
        <Field label="Nome">
          <Input
            type="text"
            name="name"
            autoComplete="name"
            defaultValue={name}
            required
          />
        </Field>
        <Field label="E-mail">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            defaultValue={email}
            required
          />
        </Field>
        <Field label="CPF">
          <Input
            type="text"
            name="cpf"
            inputMode="numeric"
            autoComplete="off"
            placeholder="000.000.000-00"
            defaultValue={cpf ?? ''}
            required
          />
        </Field>
        <div className="row">
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
        </div>
      </form>
      {error ? <p className="status status-error">{error}</p> : null}
      {message ? <p className="status status-ok">{message}</p> : null}
    </div>
  )
}
