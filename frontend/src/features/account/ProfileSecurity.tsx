import { useState, type FormEvent } from 'react'
import { Button, Field, Input, Paragraph, Title } from '../../components'

type ProfileSecurityProps = {
  saving?: boolean
  error?: string | null
  message?: string | null
  onSave?: (currentPassword: string, newPassword: string) => Promise<boolean>
}

export function ProfileSecurity({
  saving = false,
  error = null,
  message = null,
  onSave,
}: ProfileSecurityProps) {
  const [mismatch, setMismatch] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMismatch(false)

    if (!onSave) {
      return
    }

    const data = new FormData(event.currentTarget)
    const currentPassword = String(data.get('currentPassword') ?? '')
    const newPassword = String(data.get('newPassword') ?? '')
    const confirmPassword = String(data.get('confirmPassword') ?? '')

    if (newPassword !== confirmPassword) {
      setMismatch(true)
      return
    }

    const ok = await onSave(currentPassword, newPassword)
    if (ok) {
      event.currentTarget.reset()
    }
  }

  return (
    <div className="panel">
      <Title as="h4">Segurança</Title>
      <form className="form" onSubmit={(event) => void handleSubmit(event)}>
        <Field label="Senha atual">
          <Input
            type="password"
            name="currentPassword"
            autoComplete="current-password"
            placeholder="••••••••"
            minLength={6}
            required
          />
        </Field>
        <Field label="Nova senha">
          <Input
            type="password"
            name="newPassword"
            autoComplete="new-password"
            placeholder="••••••••"
            minLength={6}
            required
          />
        </Field>
        <Field label="Confirmar nova senha">
          <Input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="••••••••"
            minLength={6}
            required
          />
        </Field>

        <Paragraph variant="muted">
          A sessão fica em cookie httpOnly. A senha não é gravada no navegador.
        </Paragraph>

        <div className="row">
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando…' : 'Atualizar senha'}
          </Button>
        </div>
      </form>
      {mismatch ? (
        <p className="status status-error">A confirmação não confere.</p>
      ) : null}
      {error ? <p className="status status-error">{error}</p> : null}
      {message ? <p className="status status-ok">{message}</p> : null}
    </div>
  )
}
