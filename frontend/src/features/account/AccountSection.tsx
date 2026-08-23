import type { ReactNode } from 'react'
import type { Address, AddressInput, UpdateUserInput } from '../../types/user'
import { Paragraph, Section } from '../../components'
import { ProfileAddress } from './ProfileAddress'
import { ProfilePersonal } from './ProfilePersonal'
import { ProfileSecurity } from './ProfileSecurity'

type FormStatus = {
  saving?: boolean
  error?: string | null
  message?: string | null
}

type AccountSectionProps = {
  name?: string
  email?: string
  cpf?: string | null
  address?: Address | null
  personalStatus?: FormStatus
  addressStatus?: FormStatus
  passwordStatus?: FormStatus
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
  personalStatus,
  addressStatus,
  passwordStatus,
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
          saving={personalStatus?.saving}
          error={personalStatus?.error}
          message={personalStatus?.message}
          onSave={onSavePersonal}
        />
        <ProfileAddress
          key={address?.id ?? 'new-address'}
          address={address}
          saving={addressStatus?.saving}
          error={addressStatus?.error}
          message={addressStatus?.message}
          onSave={onSaveAddress}
        />
        <ProfileSecurity
          saving={passwordStatus?.saving}
          error={passwordStatus?.error}
          message={passwordStatus?.message}
          onSave={onSavePassword}
        />
        {children}
      </div>
    </Section>
  )
}
