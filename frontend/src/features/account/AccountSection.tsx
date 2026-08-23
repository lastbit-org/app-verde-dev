import type { ReactNode } from 'react'
import type { UpdateUserInput } from '../../types/user'
import { Paragraph, Section } from '../../components'
import { ProfileAddress } from './ProfileAddress'
import { ProfilePersonal } from './ProfilePersonal'
import { ProfileSecurity } from './ProfileSecurity'

type AccountSectionProps = {
  name?: string
  email?: string
  cpf?: string | null
  saving?: boolean
  error?: string | null
  message?: string | null
  onSavePersonal?: (payload: UpdateUserInput) => Promise<boolean>
  children?: ReactNode
}

export function AccountSection({
  name,
  email,
  cpf,
  saving,
  error,
  message,
  onSavePersonal,
  children,
}: AccountSectionProps) {
  return (
    <Section id="perfil" eyebrow="Conta" title="Meus dados">
      <Paragraph>
        Dados da conta, endereço de entrega e opções de segurança.
      </Paragraph>
      <div className="account-grid">
        <ProfilePersonal
          key={`${name}-${email}-${cpf ?? ''}`}
          name={name}
          email={email}
          cpf={cpf}
          saving={saving}
          error={error}
          message={message}
          onSave={onSavePersonal}
        />
        <ProfileAddress />
        <ProfileSecurity />
        {children}
      </div>
    </Section>
  )
}
