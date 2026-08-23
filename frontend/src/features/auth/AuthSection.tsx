import { Paragraph, Section } from '../../components'
import { AuthForm } from './AuthForm'

export function AuthSection() {
  return (
    <Section id="conta" eyebrow="Acesso" title="Entrar ou criar conta">
      <Paragraph>
        Entre com e-mail e senha. A sessão fica num cookie httpOnly.
      </Paragraph>
      <AuthForm />
    </Section>
  )
}
