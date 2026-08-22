import { Paragraph, Section } from '../../components'
import { ProfileAddress } from './ProfileAddress'
import { ProfilePersonal } from './ProfilePersonal'
import { ProfileSecurity } from './ProfileSecurity'

export function AccountSection() {
  return (
    <Section id="perfil" eyebrow="Conta" title="Meus dados">
      <Paragraph>
        Dados da conta, endereço de entrega e opções de segurança.
      </Paragraph>
      <div className="account-grid">
        <ProfilePersonal />
        <ProfileAddress />
        <ProfileSecurity />
      </div>
    </Section>
  )
}
