import type { ReactNode } from 'react'
import type { Address, AddressInput, UpdateUserInput } from '../../types/user'
import { Paragraph, Section } from '../../components'
import { ProfileAddress } from './ProfileAddress'
import { ProfilePersonal } from './ProfilePersonal'
import { ProfileSecurity } from './ProfileSecurity'

type AccountSectionProps = {
  name?: string
  email?: string
  cpf?: string | null
  address?: Address | null
  saving?: boolean
  error?: string | null
  message?: string | null
  onSavePersonal?: (payload: UpdateUserInput) => Promise<boolean>
  onSavePassword?: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>
  onSaveAddress?: (payload: AddressInput) => Promise<boolean>
  children?: ReactNode
}

export function AccountSection({
  name,
  email,
  cpf,
  address,
  saving,
  error,
  message,
  onSavePersonal,
  onSavePassword,
  onSaveAddress,
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
        <ProfileAddress
          key={address?.id ?? 'new-address'}
          address={address}
          saving={saving}
          error={error}
          message={message}
          onSave={onSaveAddress}
        />
        <ProfileSecurity
          saving={saving}
          error={error}
          message={message}
          onSave={onSavePassword}
        />
        {children}
      </div>
    </Section>
  )
}
