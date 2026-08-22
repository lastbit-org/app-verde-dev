import type { ReactNode } from 'react'
import { Paragraph, Section } from '../../components'
import { ProfileAddress } from './ProfileAddress'
import { ProfilePersonal } from './ProfilePersonal'
import { ProfileSecurity } from './ProfileSecurity'

type AccountSectionProps = {
  name?: string
  email?: string
  children?: ReactNode
}

export function AccountSection({ name, email, children }: AccountSectionProps) {
  return (
    <Section id="perfil" eyebrow="Conta" title="Meus dados">
      <Paragraph>
        Dados da conta, endereço de entrega e opções de segurança.
      </Paragraph>
      <div className="account-grid">
        <ProfilePersonal name={name} email={email} />
        <ProfileAddress />
        <ProfileSecurity />
        {children}
      </div>
    </Section>
  )
}
