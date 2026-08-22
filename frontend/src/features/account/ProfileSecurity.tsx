import type { FormEvent } from 'react'
import { Button, Checkbox, Field, Input, Paragraph, Title } from '../../components'

type ProfileSecurityProps = {
  mfaEnabled?: boolean
}

export function ProfileSecurity({ mfaEnabled = false }: ProfileSecurityProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="panel">
      <Title as="h4">Segurança</Title>
      <form className="form" onSubmit={handleSubmit}>
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

        <div className="security-mfa">
          <Checkbox name="mfa" defaultChecked={mfaEnabled}>
            Ativar autenticação em dois fatores (MFA)
          </Checkbox>
          <Paragraph variant="muted">
            Um código extra no celular confirma o acesso à conta.
          </Paragraph>
        </div>

        <div className="row">
          <Button type="submit">Atualizar segurança</Button>
        </div>
      </form>
    </div>
  )
}
