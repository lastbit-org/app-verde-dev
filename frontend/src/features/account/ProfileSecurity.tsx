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
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    if (!onSave) {
      return
    }

    const data = new FormData(event.currentTarget)
    const currentPassword = String(data.get('currentPassword') ?? '')
    const newPassword = String(data.get('newPassword') ?? '')
    const confirmPassword = String(data.get('confirmPassword') ?? '')

    if (newPassword !== confirmPassword) {
      setFormError('A confirmação não confere.')
      return
    }

    if (newPassword === currentPassword) {
      setFormError('A nova senha precisa ser diferente da atual.')
      return
    }

    const ok = await onSave(currentPassword, newPassword)
    if (ok) {
      event.currentTarget.reset()
    }
  }

  return (
    <div className="panel" id="seguranca">
      <Title as="h4">Segurança</Title>
      <form className="form" onSubmit={(event) => void handleSubmit(event)}>
        <Field label="Senha atual">
          <Input
            type="password"
            name="currentPassword"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </Field>
        <Field label="Nova senha">
          <Input
            type="password"
            name="newPassword"
            autoComplete="new-password"
            placeholder="••••••••"
            minLength={8}
            required
          />
        </Field>
        <Field label="Confirmar nova senha">
          <Input
            type="password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="••••••••"
            minLength={8}
            required
          />
        </Field>

        <Paragraph variant="muted">
          Mínimo 8 caracteres, com letra e número. A senha não fica no
          navegador.
        </Paragraph>

        <div className="row">
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando…' : 'Atualizar senha'}
          </Button>
        </div>
      </form>
      {formError ? <p className="status status-error">{formError}</p> : null}
      {error ? <p className="status status-error">{error}</p> : null}
      {message ? <p className="status status-ok">{message}</p> : null}
    </div>
  )
}
